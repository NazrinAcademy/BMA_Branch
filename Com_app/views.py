from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
from mongoengine.errors import NotUniqueError
from django.contrib.auth.hashers import check_password
from mongoengine.errors import DoesNotExist, ValidationError
from datetime import datetime
from datetime import timedelta
import random
from Com_app.mongomodels import UserData ,EmailOTP
from Com_app.mongomodels import Company,SalesParty,PurchaseLedger,AccountingVoucher,PurchaseParty,SalesLedger,PurchaseVoucher,Payment
from Com_app.serializers import CompanySerializer,SalesPartySerializer,PurchaseLedgerSerializer,AccountingVoucherSerializer,PurchasePartySerializer,SalesLedgerSerializer,PurchaseVoucherSerializer,PaymentSerializer
from django.conf import settings

class RegisterUser(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            phone = data.get('phone')
            license_key = data.get('license_key')

            # Validate that all fields are provided
            if not all([username, email, password, phone, license_key]):
                return Response(
                    {"message": "All fields (username, email, password, phone, license_key) are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Check if the email is already in use
            if UserData.objects.filter(email=email).first():
                return Response(
                    {'message': 'A user with this email is already registered.'},
                    status=status.HTTP_409_CONFLICT
                )

            # Check if the phone number is already in use
            if UserData.objects.filter(phone=phone).first():
                return Response(
                    {"message": "A user with this phone number is already registered."},
                    status=status.HTTP_409_CONFLICT
                )

            # Check if the license key is already in use
            if UserData.objects.filter(license_key=license_key).first():
                return Response(
                    {'message': 'A user with this license key is already registered.'},
                    status=status.HTTP_409_CONFLICT
                )

            # Generate a random OTP and set expiration time
            otp = random.randint(1000, 9999)
            otp = str(otp)  # Convert the OTP to a string
            expires_at = datetime.utcnow() + timedelta(minutes=10)

            # Check if an OTP record exists for the given email
            email_otp = EmailOTP.objects.filter(email=email).first()

            # If an OTP record exists, update it
            if email_otp:
                email_otp.otp = otp
                email_otp.expires_at = expires_at
                email_otp.save()  # Save the updated OTP record
            else:
                # If no OTP record exists, create a new one
                email_otp = EmailOTP(
                    email=email,
                    otp=otp,
                    expires_at=expires_at
                )
                email_otp.save()  # Save the new OTP record

            # Send OTP to the user's email
            send_mail(
                subject='Email Verification OTP',
                message=f'Your OTP is {otp}. It will expire in 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            # Hash the password before saving to the database
            hashed_password = make_password(password)

            # Create the user in the UserData collection
            user = UserData(
                username=username,
                email=email,
                password=hashed_password,
                phone=phone,
                license_key=license_key,
                status='unverified',
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            user.save()

            return Response(
                {'message': 'User registered successfully. OTP sent to your email for verification.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {'message': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class VerifyOTP(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            email = data.get('email')
            otp = data.get('otp')

            if not email or not otp:
                return Response(
                    {"message": "Email and OTP are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                email_otp = EmailOTP.objects.get(email=email)
            except EmailOTP.DoesNotExist:
                return Response(
                    {"message": "Invalid email or OTP."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if email_otp.otp != otp:
                return Response(
                    {"message": "Invalid OTP."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if email_otp.is_expired():
                return Response(
                    {"message": "OTP has expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = UserData.objects.get(email=email)
            user.status = "verified"
            user.save()
            email_otp.delete()

            return Response(
                {"message": "Email verified successfully."},
                status=status.HTTP_200_OK
            )

        except UserData.DoesNotExist:
            return Response(
                {"message": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {"message": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return Response(
                    {'error': 'Email and password are required.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = None

            # Check for the user in the database by email
            for usr in UserData.objects.all():
                if usr.email == email:
                    user = usr
                    # Check if the user is verified
                    if usr.status == "unverified":
                        return Response(
                            {'error': 'You are unverified.'}, 
                            status=status.HTTP_401_UNAUTHORIZED
                        )
                    break

            if not user:
                print("Emails in database:", [usr.email for usr in UserData.objects.all()])
                return Response(
                    {'error': 'Invalid email.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Check if the password is correct
            if not check_password(password, user.password):
                return Response(
                    {'error': 'Invalid password.'},  
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            # Generate refresh and access tokens using Simple JWT
            refresh = RefreshToken.for_user(user)

            # Convert ObjectId to string for the response
            user_id_str = str(user.id)

            return Response(
                {   
                    'message': 'Login successful.',
                    'id': user_id_str,  # Convert the ObjectId to string
                    'username': user.username,
                    'email': user.email,
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh),
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {'error': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        
class CompanyCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "company_name",
            "financial_year_begins_from",
            "books_beginning_from",
            "base_currency_symbol",
        ]

        missing_fields = [
            field
            for field in required_fields
            if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {"error": f"The following fields are missing or empty: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Pass data to serializer
        serializer = CompanySerializer(data=request.data)

        if serializer.is_valid():
            try:
                # Save the company document
                company = serializer.save()
                return Response(
                    {"message": "Company successfully created.", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

class CompanyManagementView(APIView):
    def get(self, request, company_id=None, *args, **kwargs):
        try:
            if company_id:
                # Fetch a single company by company_id
                company = Company.objects.get(company_id=company_id)
                serializer = CompanySerializer(company)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                # Fetch all companies
                companies = Company.objects.all()
                serializer = CompanySerializer(companies, many=True)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
        except DoesNotExist:
            return Response(
                {"error": f"Company with ID {company_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, company_id, *args, **kwargs):
        try:
            # Fetch company by company_id
            company = Company.objects.get(company_id=company_id)
            # Update with validated data
            serializer = CompanySerializer(company, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Company updated successfully", "data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"errors": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except DoesNotExist:
            return Response(
                {"error": f"Company with ID {company_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as e:
            return Response(
                {"error": f"Validation error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, company_id, *args, **kwargs):
        try:
            # Fetch and delete company by company_id
            company = Company.objects.get(company_id=company_id)
            company.delete()
            return Response(
                {"message": "Company deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except DoesNotExist:
            return Response(
                {"error": f"Company with ID {company_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class SalesPartyCreateView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "name",
            "mailing_name",
            "mailing_address",
            "mailing_country",
            "mailing_state",
            "mailing_pincode",
        ]

        missing_fields = [
            field for field in required_fields
            if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {
                    "error": "Missing or empty required fields.",
                    "missing_fields": missing_fields,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Deserialize data and validate it
        serializer = SalesPartySerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Save data to MongoDB (MongoEngine will handle the insert operation)
                sales_party = SalesParty(**serializer.validated_data)
                sales_party.save()

                # Prepare response data
                response_data = sales_party.to_mongo().to_dict()  # Convert document to dictionary for response
                
                # Handle optional fields for response formatting
                if 'default_credit_period' not in response_data or response_data['default_credit_period'] == '':
                    response_data['default_credit_period'] = None
                if 'check_credit_days_during_voucher_entry' not in response_data or response_data['check_credit_days_during_voucher_entry'] == '':
                    response_data['check_credit_days_during_voucher_entry'] = None
                
                return Response(
                    {
                        "message": "SalesParty successfully created.",
                        "data": response_data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except ValidationError as e:
                return Response(
                    {"error": f"Validation error: {str(e)}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {
                    "error": "Validation failed.",
                    "details": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
class SalesPartyManagementView(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        try:
            if pk:
                sales_party = SalesParty.objects.get(id=pk)  # MongoEngine query
                serializer = SalesPartySerializer(sales_party)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                sales_parties = SalesParty.objects.all()  # MongoEngine query
                serializer = SalesPartySerializer(sales_parties, many=True)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
        except SalesParty.DoesNotExist:
            return Response(
                {"error": f"SalesParty with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, pk, *args, **kwargs):
        try:
            sales_party = SalesParty.objects.get(id=pk)  # MongoEngine query
            serializer = SalesPartySerializer(sales_party, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "SalesParty updated successfully", "data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"errors": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except SalesParty.DoesNotExist:
            return Response(
                {"error": f"SalesParty with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk, *args, **kwargs):
        try:
            sales_party = SalesParty.objects.get(id=pk)  # MongoEngine query
            sales_party.delete()
            return Response(
                {"message": "SalesParty deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except SalesParty.DoesNotExist:
            return Response(
                {"error": f"SalesParty with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class AccountingVoucherCreateView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "date",
            "reference_no",
            "party_account_name",
            "current_balance",
            "sales_ledger",
            "quantity",
            "rate",
            "per",
            "amount",
            "narration",
            "total_products_sold",
            "remaining_stock",
        ]

        missing_fields = [
            field for field in required_fields
            if field not in request.data or request.data.get(field) in [None, ""]
        ]

        if missing_fields:
            return Response(
                {"error": f"The following fields are missing or empty: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Extract the data from the request
            data = {
                "date": request.data.get("date"),
                "reference_no": request.data.get("reference_no"),
                "party_account_name": request.data.get("party_account_name"),
                "current_balance": request.data.get("current_balance"),
                "sales_ledger": request.data.get("sales_ledger"),
                "quantity": request.data.get("quantity"),
                "rate": request.data.get("rate"),
                "per": request.data.get("per"),
                "amount": request.data.get("amount"),
                "narration": request.data.get("narration", ""),
                "total_products_sold": request.data.get("total_products_sold"),
                "remaining_stock": request.data.get("remaining_stock"),
            }
            accounting_voucher = AccountingVoucher(**data)
            accounting_voucher.save()
            total_products_sold = request.data.get("total_products_sold", 0)
            remaining_stock = request.data.get("remaining_stock", 0)

            return Response(
                {
                    "message": "Accounting Voucher successfully created.",
                    "data": data,
                    "total_products_sold": total_products_sold,
                    "remaining_stock": remaining_stock,
                },
                status=status.HTTP_201_CREATED,
            )

        except ValidationError as e:
            return Response(
                {"error": f"Validation error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


from django.db.models import Sum      
from mongoengine.queryset.visitor import Q
class AccountingVoucherManagementView(APIView):

    def get(self, request, pk=None, *args, **kwargs):
        try:
            # Extract initial stock from the request payload
            initial_stock = request.data.get("initial_stock", 1000)

            # Get total quantity sold across all vouchers
            total_products_sold = AccountingVoucher.objects.aggregate(total_sold=Sum('quantity'))['total_sold'] or 0

            # Calculate remaining stock dynamically
            remaining_stock = initial_stock - total_products_sold

            if pk:
                # Fetch a single accounting voucher by pk
                accounting_voucher = AccountingVoucher.objects.get(id=pk)
                serializer = AccountingVoucherSerializer(accounting_voucher)
                return Response(
                    {
                        "data": serializer.data,
                        "total_products_sold": total_products_sold,
                        "remaining_stock": remaining_stock,
                    },
                    status=status.HTTP_200_OK
                )
            else:
                accounting_vouchers = AccountingVoucher.objects.all()
                serializer = AccountingVoucherSerializer(accounting_vouchers, many=True)
                return Response(
                    {
                        "data": serializer.data,
                        "total_products_sold": total_products_sold,
                        "remaining_stock": remaining_stock,
                    },
                    status=status.HTTP_200_OK
                )
        except DoesNotExist:
            return Response(
                {"error": f"AccountingVoucher with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, pk, *args, **kwargs):
        try:
            accounting_voucher = AccountingVoucher.objects.get(id=pk)
            serializer = AccountingVoucherSerializer(accounting_voucher, data=request.data, partial=False)
            
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "AccountingVoucher updated successfully", "data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"errors": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except DoesNotExist:
            return Response(
                {"error": f"AccountingVoucher with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk, *args, **kwargs):
        try:
            accounting_voucher = AccountingVoucher.objects.get(id=pk)
            accounting_voucher.delete()
            return Response(
                {"message": "AccountingVoucher deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except DoesNotExist:
            return Response(
                {"error": f"AccountingVoucher with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

# class PurchasePartyViewSet(APIView):
#     def post(self, request, *args, **kwargs):
#         required_fields = [
#             "name",
#             "mailing_name",
#             "mailing_country",
#             "mailing_state",
#             "mailing_pincode",
#         ]

#         # Check for missing or empty fields
#         missing_fields = [
#             field for field in required_fields
#             if field not in request.data or not request.data.get(field)
#         ]

#         if missing_fields:
#             return Response(
#                 {
#                     "error": f"The following fields are missing or empty: {', '.join(missing_fields)}"
#                 },
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         # Validate 'maintain_balances' dependent fields
#         if request.data.get("maintain_balances", False):
#             if not request.data.get("default_credit_period"):
#                 return Response(
#                     {"error": "The field 'default_credit_period' is required when 'maintain_balances' is True."},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )
#             if "check_credit_days" not in request.data:
#                 return Response(
#                     {"error": "The field 'check_credit_days' is required when 'maintain_balances' is True."},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )

#         # Serialize and validate data
#         serializer = PurchasePartySerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 # Save the document to MongoDB
#                 purchase_party = serializer.save()
#                 return Response(
#                     {
#                         "message": "Purchase Party successfully created.",
#                         "data": serializer.data,
#                     },
#                     status=status.HTTP_201_CREATED,
#                 )
#             except NotUniqueError:
#                 return Response(
#                     {"error": "A record with the same unique fields already exists."},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )
#             except ValidationError as e:
#                 return Response(
#                     {"error": f"Validation error: {str(e)}"},
#                     status=status.HTTP_400_BAD_REQUEST,
#                 )
#             except Exception as e:
#                 return Response(
#                     {"error": f"An unexpected error occurred: {str(e)}"},
#                     status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#                 )
#         else:
#             return Response(
#                 {"error": serializer.errors},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
        

from datetime import datetime

class PurchaseLedgercreateView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "name",
            "inventory_values_affected",
            "mailing_name",
            "provide_bank_details",
        ]

        missing_fields = [
            field for field in required_fields if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {
                    "error": f"The following fields are missing or empty: {', '.join(missing_fields)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Use serializer to validate and save data
        serializer = PurchaseLedgerSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Save to the MongoDB database
                purchase_ledger = PurchaseLedger(**serializer.validated_data)
                purchase_ledger.save()

                return Response(
                    {
                        "message": "Purchase Ledger successfully created.",
                        "data": serializer.data,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

class PurchaseLedgerView(APIView):

    def get(self, request, *args, **kwargs):
        if 'purchase_ledger_id' in kwargs:
            try:
                purchase_ledger = PurchaseLedger.objects.get(id=kwargs['purchase_ledger_id'])  # MongoEngine query
                serializer = PurchaseLedgerSerializer(purchase_ledger)
                return Response(
                    {"message": "Purchase Ledger retrieved successfully", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except PurchaseLedger.DoesNotExist:
                return Response(
                    {"error": "Purchase Ledger not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            purchase_ledgers = PurchaseLedger.objects.all()  # MongoEngine query to fetch all documents
            serializer = PurchaseLedgerSerializer(purchase_ledgers, many=True)
            return Response(
                {"message": "Purchase Ledgers retrieved successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        try:
            purchase_ledger = PurchaseLedger.objects.get(id=kwargs['purchase_ledger_id'])  # MongoEngine query
        except PurchaseLedger.DoesNotExist:
            return Response(
                {"error": "Purchase Ledger not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PurchaseLedgerSerializer(purchase_ledger, data=request.data, partial=False)
        if serializer.is_valid():
            try:
                serializer.save()  # Save changes in MongoDB
                return Response(
                    {"message": "Purchase Ledger successfully updated.", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, *args, **kwargs):
        try:
            purchase_ledger = PurchaseLedger.objects.get(id=kwargs['purchase_ledger_id'])  # MongoEngine query
            purchase_ledger.delete()  # Delete the document
            return Response(
                {"message": "Purchase Ledger successfully deleted."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except PurchaseLedger.DoesNotExist:
            return Response(
                {"error": "Purchase Ledger not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        

class PurchasePartycreateViewSet(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "name",
            "mailing_name",
            "mailing_address",
            "mailing_country",
            "mailing_state",
            "mailing_pincode",
        ]

        missing_fields = [
            field for field in required_fields
            if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {
                    "error": f"The following fields are missing or empty: {', '.join(missing_fields)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.data.get("maintain_balances", False):
            if not request.data.get("default_credit_period"):
                return Response(
                    {"error": "The field 'default_credit_period' is required when 'maintain_balances' is True."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if "check_credit_days" not in request.data:
                return Response(
                    {"error": "The field 'check_credit_days' is required when 'maintain_balances' is True."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = PurchasePartySerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Attempt to save the data
                purchase_party = serializer.save()  # This will save to the MongoDB database
                return Response(
                    {
                        "message": "Purchase Party successfully created.",
                        "data": PurchasePartySerializer(purchase_party).data
                    },
                    status=status.HTTP_201_CREATED,
                )
            except NotUniqueError:
                # Handle duplicate gstin_uin error
                return Response(
                    {"error": "The GSTIN/UIN provided already exists."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            except Exception as e:
                # Handle any unexpected errors
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
class PurchasePartyViewSet(APIView):
    def get(self, request, *args, **kwargs):
        purchase_party_id = kwargs.get('pk', None)
        
        if purchase_party_id:
            try:
                # Fetch the document using MongoEngine
                purchase_party = PurchaseParty.objects.get(purchase_party_id=purchase_party_id)
                serializer = PurchasePartySerializer(purchase_party)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except PurchaseParty.DoesNotExist:
                return Response(
                    {"error": "PurchaseParty not found."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            # Fetch all documents
            purchase_parties = PurchaseParty.objects.all()
            serializer = PurchasePartySerializer(purchase_parties, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
    def put(self, request, *args, **kwargs):
        purchase_party_id = kwargs.get('pk', None)
        
        if not purchase_party_id:
            return Response(
                {"error": "PurchaseParty ID is required for updating."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Retrieve the document
            purchase_party = PurchaseParty.objects.get(purchase_party_id=purchase_party_id)
            serializer = PurchasePartySerializer(purchase_party, data=request.data, partial=True)

            if serializer.is_valid():
                try:
                    # Attempt to save
                    serializer.save()
                    return Response(
                        {"message": "Purchase Party successfully updated.", "data": serializer.data},
                        status=status.HTTP_200_OK
                    )
                except NotUniqueError as e:
                    return Response(
                        {"error": f"Duplicate value error: {str(e)}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {"error": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except PurchaseParty.DoesNotExist:
            return Response(
                {"error": "PurchaseParty not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, *args, **kwargs):
        purchase_party_id = kwargs.get('pk', None)
        
        if not purchase_party_id:
            return Response(
                {"error": "PurchaseParty ID is required for deletion."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Fetch and delete the document
            purchase_party = PurchaseParty.objects.get(purchase_party_id=purchase_party_id)
            purchase_party.delete()
            return Response(
                {"message": "Purchase Party successfully deleted."},
                status=status.HTTP_200_OK
            )
        except PurchaseParty.DoesNotExist:
            return Response(
                {"error": "PurchaseParty not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            # Handle unexpected errors
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class SalesLedgerCreateView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "name",
            "type_of_salesLeger",
            "mailing_name",
            "mailing_address",
        ]

        missing_fields = [
            field for field in required_fields if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {
                    "error": f"The following fields are missing or empty: {', '.join(missing_fields)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        type_of_salesLeger = request.data.get("type_of_salesLeger")
        if type_of_salesLeger == "Invoice Rounding":
            if not request.data.get("rounding_method") or not request.data.get("rounding_limit"):
                return Response(
                    {
                        "error": "Both 'rounding_method' and 'rounding_limit' are required when 'type_of_salesLeger' is set to 'Invoice Rounding'."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = SalesLedgerSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Create and save the SalesLedger instance in MongoDB
                sales_ledger = SalesLedger(**serializer.validated_data)
                sales_ledger.save()
                return Response(
                    {"message": "Sales Ledger successfully created.", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        

class SalesLedgerView(APIView):
    def get(self, request, *args, **kwargs):
        if 'SalesLedger_id' in kwargs:
            try:
                sales_ledger = SalesLedger.objects.get(SalesLedger_id=kwargs['SalesLedger_id'])
                serializer = SalesLedgerSerializer(sales_ledger)
                return Response(
                    {"message": "Sales Ledger retrieved successfully", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except SalesLedger.DoesNotExist:
                return Response(
                    {"error": "Sales Ledger not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            sales_ledgers = SalesLedger.objects.all()
            serializer = SalesLedgerSerializer(sales_ledgers, many=True)
            return Response(
                {"message": "Sales Ledgers retrieved successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        try:
            sales_ledger = SalesLedger.objects.get(SalesLedger_id=kwargs['SalesLedger_id'])
        except SalesLedger.DoesNotExist:
            return Response(
                {"error": "Sales Ledger not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Validate rounding_method and rounding_limit if type_of_salesLeger is "Invoice Rounding"
        if request.data.get('type_of_salesLeger') == 'Invoice Rounding':
            if not request.data.get('rounding_method') or not request.data.get('rounding_limit'):
                return Response(
                    {"error": "rounding_method and rounding_limit are required for Invoice Rounding."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        serializer = SalesLedgerSerializer(sales_ledger, data=request.data, partial=False)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(
                    {"message": "Sales Ledger successfully updated.", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, *args, **kwargs):
        try:
            sales_ledger = SalesLedger.objects.get(SalesLedger_id=kwargs['SalesLedger_id'])
            sales_ledger.delete()
            return Response(
                {"message": "Sales Ledger successfully deleted."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except SalesLedger.DoesNotExist:
            return Response(
                {"error": "Sales Ledger not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        

class PurchaseVoucherCreateView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "supplier_invoice_no", "date", "party_account_name", "current_balance", "purchase_ledger", "quantity", "rate_per", "amount",
        ]

        missing_fields = [
            field for field in required_fields if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {"error": f"The following fields are missing or empty: {', '.join(missing_fields)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = PurchaseVoucherSerializer(data=request.data)
        if serializer.is_valid():
            try:
                purchase_voucher = serializer.save()
                return Response(
                    {"message": "Purchase Voucher successfully created.", "data": serializer.data},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

class PurchaseVoucherView(APIView):

    def get(self, request, *args, **kwargs):
        # If a specific purchase_no is provided, fetch that purchase voucher
        if 'purchase_id' in kwargs:
            try:
                purchase_voucher = PurchaseVoucher.objects.get(purchase_no=kwargs['purchase_id'])
                serializer = PurchaseVoucherSerializer(purchase_voucher)
                return Response(
                    {"message": "Purchase Voucher retrieved successfully", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except PurchaseVoucher.DoesNotExist:
                return Response(
                    {"error": "Purchase Voucher not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            # If no specific purchase_no is provided, fetch all purchase vouchers
            purchase_vouchers = PurchaseVoucher.objects.all()
            serializer = PurchaseVoucherSerializer(purchase_vouchers, many=True)
            return Response(
                {"message": "Purchase Vouchers retrieved successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        # Attempt to get the PurchaseVoucher instance to update
        try:
            purchase_voucher = PurchaseVoucher.objects.get(purchase_id=kwargs['purchase_id'])
        except PurchaseVoucher.DoesNotExist:
            return Response(
                {"error": "Purchase Voucher not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Partially update the document using the serializer
        serializer = PurchaseVoucherSerializer(purchase_voucher, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(
                    {"message": "Purchase Voucher successfully updated.", "data": serializer.data},
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, *args, **kwargs):
        try:
            purchase_voucher = PurchaseVoucher.objects.get(purchase_id=kwargs['purchase_id'])
            purchase_voucher.delete()
            return Response(
                {"message": "Purchase Voucher successfully deleted."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except PurchaseVoucher.DoesNotExist:
            return Response(
                {"error": "Purchase Voucher not found."},
                status=status.HTTP_404_NOT_FOUND,
            )
        
class PaymentcreateView(APIView):
    def post(self, request, *args, **kwargs):
      
        required_fields = [
            "date", "account", "cur_balance", "particulars", "amount", "payment_method"
        ]
        
        missing_fields = [
            field for field in required_fields if field not in request.data or not request.data.get(field)
        ]

        if missing_fields:
            return Response(
                {
                    "error": f"The following fields are missing or empty: {', '.join(missing_fields)}"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_method = request.data.get("payment_method")  
        payment_method_details = {}

        if payment_method == "Cash":
            payment_method_details = {
                "method": "Cash",
                "details": "Payment made in cash."
            }
        elif payment_method == "Credit Card":
            payment_method_details = {
                "method": "Credit Card",
                "details": "Payment made using a credit card. Please check the card details."
            }
        elif payment_method == "Bank Transfer":
            payment_method_details = {
                "method": "Bank Transfer",
                "details": "Payment made via bank transfer. Please verify the transaction reference."
            }
        else:
            payment_method_details = {
                "method": payment_method,
                "details": "Custom payment method provided."
            }

        serializer = PaymentSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                payment = serializer.save()

                return Response(
                    {
                        "message": "Payment successfully created.",
                        "data": serializer.data,
                        "payment_method_details": payment_method_details
                    },
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )
        


class PaymentView(APIView):

    def get_payment_method_details(self, payment_method):
        if payment_method == "Cash":
            return {
                "method": "Cash",
                "details": "Payment made in cash."
            }
        elif payment_method == "Credit Card":
            return {
                "method": "Credit Card",
                "details": "Payment made using a credit card."
            }
        elif payment_method == "Bank Transfer":
            return {
                "method": "Bank Transfer",
                "details": "Payment made via bank transfer."
            }
        else:
            return {
                "method": payment_method,
                "details": "Custom payment method provided."
            }

    def get(self, request, *args, **kwargs):
        if 'payment_number' in kwargs:
            try:
                payment = Payment.objects.get(payment_number=kwargs['payment_number'])
                serializer = PaymentSerializer(payment)

                payment_method_details = self.get_payment_method_details(payment.account)

                return Response(
                    {
                        "message": "Payment retrieved successfully",
                        "data": {
                            **serializer.data,
                            "payment_method_details": payment_method_details
                        }
                    },
                    status=status.HTTP_200_OK,
                )
            except Payment.DoesNotExist:
                return Response(
                    {"error": "Payment not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            payments = Payment.objects.all()
            serializer = PaymentSerializer(payments, many=True)

            payments_data = []
            for payment, serialized_payment in zip(payments, serializer.data):
                payment_method_details = self.get_payment_method_details(payment.account)
                payment_data = {
                    **serialized_payment,
                    "payment_method_details": payment_method_details
                }
                payments_data.append(payment_data)

            return Response(
                {
                    "message": "Payments retrieved successfully",
                    "data": payments_data
                },
                status=status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        try:
            payment = Payment.objects.get(payment_number=kwargs['payment_number'])
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PaymentSerializer(payment, data=request.data, partial=False)
        if serializer.is_valid():
            try:
                updated_payment = serializer.save()

                payment_method_details = self.get_payment_method_details(updated_payment.account)

                return Response(
                    {
                        "message": "Payment successfully updated.",
                        "data": {
                            **serializer.data,
                            "payment_method_details": payment_method_details
                        }
                    },
                    status=status.HTTP_200_OK,
                )
            except Exception as e:
                return Response(
                    {"error": f"An unexpected error occurred: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        else:
            return Response(
                {"error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, *args, **kwargs):
        try:
            payment = Payment.objects.get(payment_number=kwargs['payment_number'])
            payment_method_details = self.get_payment_method_details(payment.account)
            payment.delete()

            return Response(
                {
                    "message": "Payment successfully deleted.",
                    "payment_method_details": payment_method_details
                },
                status=status.HTTP_204_NO_CONTENT,
            )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )