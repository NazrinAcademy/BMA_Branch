import random
from datetime import timedelta
from django.shortcuts import render
from rest_framework import  status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.core.mail import send_mail
from django.utils.timezone import now
from django.contrib.auth.hashers import make_password
from django.conf import settings
from .models import UserData,EmailOTP, Company, SalesParty, PurchaseParty, Branch,CurrencySetting,AccountingVoucher,PurchaseLedger,SalesLedger,PurchaseVoucher,Payment
from .serializers import CompanySerializer,BranchSerializer,CurrencySettingSerializer,CompaniesSerializer,SalesPartySerializer,AccountingVoucherSerializer,PurchasePartySerializer,PurchaseLedgerSerializer,SalesLedgerSerializer,PurchaseVoucherSerializer,PaymentSerializer



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

            if not all([username, email, password, phone, license_key]):
                return Response(
                    {"message": "All fields (username, email, password, phone, license_key) are required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if UserData.objects.filter(email=email).exists():
                return Response(
                    {'message': 'A user with this email is already registered.'},
                    status=status.HTTP_409_CONFLICT
                )
            
            if UserData.objects.filter(phone=phone).exists():
                return Response(
                    {"message": "A user with this phone number is already registered."},
                    status=status.HTTP_409_CONFLICT
                )

            if UserData.objects.filter(license_key=license_key).exists():
                return Response(
                    {'message': 'A user with this license key is already registered.'},
                    status=status.HTTP_409_CONFLICT
                )

            otp = random.randint(1000, 9999)
            expires_at = now() + timedelta(minutes=10)

            email_otp, created = EmailOTP.objects.update_or_create(
                email=email,
                defaults={'otp': otp, 'expires_at': expires_at}
            )

            send_mail(
                subject='Email Verification OTP',
                message=f'Your OTP is {otp}. It will expire in 10 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )

            hashed_password = make_password(password)

            User = UserData.objects.create(
                username=username,
                email=email,
                password=hashed_password,
                phone=phone,
                license_key=license_key,
                status='unverified'
            )

            return Response(
                {'message': 'User registered successfully. OTP sent to your email for verification.'},
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            return Response(
                {'message': f'An unexpected error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class VerifyOTPView(APIView):
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

            for usr in UserData.objects.all():
                if usr.email == email:
                    user = usr
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

            if not check_password(password, user.password):
                return Response(
                    {'error': 'Invalid password.'},  
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            refresh = RefreshToken.for_user(user)

            return Response(
                {   
                    'message': 'Login successful.',
                    'id':usr.id,
                    'username': usr.username,
                    'email': usr.email,
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
        

class CompanyViewSet(APIView):
    def post(self, request, *args, **kwargs):
       
        required_fields = [
            "company_name",
            "financial_year_begins_from",
            "books_beginning_from",
            "base_currency_symbol",
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

        serializer = CompanySerializer(data=request.data)
        if serializer.is_valid():
            try:
   
                serializer.save()
                return Response(
                    {
                        "message": "Company successfully created.",
                        "data": serializer.data
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



class CompanyManagementView(APIView):
    def get(self, request, company_id=None, *args, **kwargs):
        try:
            if company_id:
                company = Company.objects.get(company_id=company_id)
                serializer = CompanySerializer(company)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                companies = Company.objects.all()
                serializer = CompanySerializer(companies, many=True)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
        except Company.DoesNotExist:
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
            company = Company.objects.get(company_id=company_id)
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
        except Company.DoesNotExist:
            return Response(
                {"error": f"Company with ID {company_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, company_id, *args, **kwargs):
        try:
            company = Company.objects.get(company_id=company_id)
            company.delete()
            return Response(
                {"message": "Company deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except Company.DoesNotExist:
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


        serializer = SalesPartySerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                response_data = serializer.data.copy()
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
                sales_party = SalesParty.objects.get(pk=pk)
                serializer = SalesPartySerializer(sales_party)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
      
                sales_parties = SalesParty.objects.all()
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
            sales_party = SalesParty.objects.get(pk=pk)
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
            sales_party = SalesParty.objects.get(pk=pk)
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
            "narration"
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

        serializer = AccountingVoucherSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(
                    {
                        "message": "Accounting voucher successfully created.",
                        "data": serializer.data
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


class AccountingVoucherManagementView(APIView):
    def get(self, request, pk=None, *args, **kwargs):
        try:
            if pk:
                accounting_voucher = AccountingVoucher.objects.get(pk=pk)
                serializer = AccountingVoucherSerializer(accounting_voucher)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                accounting_vouchers = AccountingVoucher.objects.all()
                serializer = AccountingVoucherSerializer(accounting_vouchers, many=True)
                return Response(
                    {"data": serializer.data},
                    status=status.HTTP_200_OK
                )
        except AccountingVoucher.DoesNotExist:
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
            accounting_voucher = AccountingVoucher.objects.get(pk=pk)
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
        except AccountingVoucher.DoesNotExist:
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
            accounting_voucher = AccountingVoucher.objects.get(pk=pk)
            accounting_voucher.delete()
            return Response(
                {"message": "AccountingVoucher deleted successfully"},
                status=status.HTTP_204_NO_CONTENT
            )
        except AccountingVoucher.DoesNotExist:
            return Response(
                {"error": f"AccountingVoucher with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PurchasePartyViewSet(APIView):
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
                serializer.save()
                return Response(
                    {
                        "message": "Purchase Party successfully created.",
                        "data": serializer.data
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

class PurchasePartyViewSet(APIView):
    def get(self, request, *args, **kwargs):
        purchase_party_id = kwargs.get('pk', None)
        
        if purchase_party_id:
            try:
                purchase_party = PurchaseParty.objects.get(purchase_party_id=purchase_party_id)
                serializer = PurchasePartySerializer(purchase_party)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except PurchaseParty.DoesNotExist:
                return Response(
                    {"error": "PurchaseParty not found."}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
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
            purchase_party = PurchaseParty.objects.get(purchase_party_id=purchase_party_id)
            serializer = PurchasePartySerializer(purchase_party, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Purchase Party successfully updated.", "data": serializer.data},
                    status=status.HTTP_200_OK
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





class PurchaseLedgerView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = [
            "name",
            "inventory_values_affected",
            "mailing_name",
            "mailing_address",
            "mailing_country",
            "mailing_state",
            "mailing_pincode",
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


        serializer = PurchaseLedgerSerializer(data=request.data)
        if serializer.is_valid():
            try:

                serializer.save()
                return Response(
                    {"message": "Purchase Ledger successfully created.", "data": serializer.data},
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
                purchase_ledger = PurchaseLedger.objects.get(id=kwargs['purchase_ledger_id'])
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
            purchase_ledgers = PurchaseLedger.objects.all()
            serializer = PurchaseLedgerSerializer(purchase_ledgers, many=True)
            return Response(
                {"message": "Purchase Ledgers retrieved successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        try:
     
            purchase_ledger = PurchaseLedger.objects.get(id=kwargs['purchase_ledger_id'])
        except PurchaseLedger.DoesNotExist:
            return Response(
                {"error": "Purchase Ledger not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = PurchaseLedgerSerializer(purchase_ledger, data=request.data, partial=False)
        if serializer.is_valid():
            try:
                serializer.save()
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
            purchase_ledger = PurchaseLedger.objects.get(id=kwargs['purchase_ledger_id'])
            purchase_ledger.delete()
            return Response(
                {"message": "Purchase Ledger successfully deleted."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except PurchaseLedger.DoesNotExist:
            return Response(
                {"error": "Purchase Ledger not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

class SalesLedgerView(APIView):
    def post(self, request, *args, **kwargs):
 
        required_fields = [
            "name",
            "type_of_salesLeger",
            # "under",
            # "inventory_values_affected",
            "mailing_name",
            "mailing_address",
            # "provide_bank_details",
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
                serializer.save()
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
                serializer.save()
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
        if 'purchase_no' in kwargs:
            try:
                purchase_voucher = PurchaseVoucher.objects.get(purchase_no=kwargs['purchase_no'])
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
            purchase_vouchers = PurchaseVoucher.objects.all()
            serializer = PurchaseVoucherSerializer(purchase_vouchers, many=True)
            return Response(
                {"message": "Purchase Vouchers retrieved successfully", "data": serializer.data},
                status=status.HTTP_200_OK,
            )

    def put(self, request, *args, **kwargs):
        try:
            purchase_voucher = PurchaseVoucher.objects.get(purchase_no=kwargs['purchase_no'])
        except PurchaseVoucher.DoesNotExist:
            return Response(
                {"error": "Purchase Voucher not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

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
            purchase_voucher = PurchaseVoucher.objects.get(purchase_no=kwargs['purchase_no'])
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
            "date", "account", "cur_balance", "particulars", "amount"
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

        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            try:
           
                serializer.save()
                return Response(
                    {"message": "Payment successfully created.", "data": serializer.data},
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

    def get(self, request, *args, **kwargs):
        if 'payment_number' in kwargs:
            try:
                payment = Payment.objects.get(payment_number=kwargs['payment_number'])
                serializer = PaymentSerializer(payment)
                return Response(
                    {"message": "Payment retrieved successfully", "data": serializer.data},
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
            return Response(
                {"message": "Payments retrieved successfully", "data": serializer.data},
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
                serializer.save()
                return Response(
                    {"message": "Payment successfully updated.", "data": serializer.data},
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
            payment.delete()
            return Response(
                {"message": "Payment successfully deleted."},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found."},
                status=status.HTTP_404_NOT_FOUND,
            )








class BranchView(APIView):
    def post(self, request, *args, **kwargs):
        required_fields = ['company', 'branch_name', 'default_currency', 'timezone']
        missing_fields = [field for field in required_fields if field not in request.data]
        if missing_fields:
            return Response(
                {
                    'message': 'Missing required fields.',
                    'missing_fields': missing_fields
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = BranchSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Branch created successfully', 'branch': serializer.data},
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                {'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )



class BranchManagementView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, branch_id=None, *args, **kwargs):
        try:
            if branch_id:
                branch = Branch.objects.get(branch_id=branch_id)
                serializer = BranchSerializer(branch)
                return Response(
                    {'branch': serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                branches = Branch.objects.all()
                serializer = BranchSerializer(branches, many=True)
                return Response(
                    {'branches': serializer.data},
                    status=status.HTTP_200_OK
                )
        except Branch.DoesNotExist:
            return Response(
                {'message': 'Branch not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, branch_id, *args, **kwargs):
        try:
            branch = Branch.objects.get(branch_id=branch_id)
            serializer = BranchSerializer(branch, data=request.data, partial=False)

            if serializer.is_valid():
                serializer.save()
                return Response(
                    {'message': 'Branch updated successfully', 'branch': serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {'errors': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Branch.DoesNotExist:
            return Response(
                {'message': 'Branch not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, branch_id, *args, **kwargs):
        try:
            branch = Branch.objects.get(branch_id=branch_id)
            branch.delete()

            return Response(
                {'message': 'Branch deleted successfully'},
                status=status.HTTP_204_NO_CONTENT
            )
        except Branch.DoesNotExist:
            return Response(
                {'message': 'Branch not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'message': f'An error occurred: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CurrencySettingPostView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = CurrencySettingSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {
                        "message": "Currency created successfully",
                        "currency": serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response(
                    {"errors": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {
                    "error": f"An unexpected error occurred: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )



class CurrencySettingView(APIView):
    def get(self, request, currency_id=None, *args, **kwargs):
        try:
            if currency_id:
                currency = CurrencySetting.objects.get(currency_id=currency_id)
                serializer = CurrencySettingSerializer(currency)
                return Response(
                    {"currency": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                currencies = CurrencySetting.objects.all()
                serializer = CurrencySettingSerializer(currencies, many=True)
                return Response(
                    {"currencies": serializer.data},
                    status=status.HTTP_200_OK
                )
        except CurrencySetting.DoesNotExist:
            return Response(
                {"error": "Currency not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def put(self, request, currency_id, *args, **kwargs):
        try:
            currency = CurrencySetting.objects.get(currency_id=currency_id)
            serializer = CurrencySettingSerializer(currency, data=request.data, partial=False)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "Currency updated successfully", "currency": serializer.data},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"errors": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except CurrencySetting.DoesNotExist:
            return Response(
                {"error": f"Currency with ID {currency_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, currency_id, *args, **kwargs):
        try:
            currency = CurrencySetting.objects.get(currency_id=currency_id)
            currency.delete()
            return Response(
                {"message": "Currency deleted successfully."},
                status=status.HTTP_204_NO_CONTENT
            )
        except CurrencySetting.DoesNotExist:
            return Response(
                {"error": f"Currency with ID {currency_id} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )