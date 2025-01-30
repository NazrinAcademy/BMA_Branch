from rest_framework import serializers
from mongoengine import UUIDField,IntField,ValidationError,NotUniqueError
import uuid
from .mongomodels import Company,SalesParty,PurchaseParty,AccountingVoucher,SalesLedger,PurchaseVoucher,Payment


class CompanySerializer(serializers.Serializer):
    company_id = serializers.UUIDField(default=uuid.uuid4, read_only=True) 
    company_name = serializers.CharField(max_length=255)
    financial_year_begins_from = serializers.DateField(format="%Y-%m-%d")
    books_beginning_from = serializers.DateField(format="%Y-%m-%d")
    base_currency_symbol = serializers.CharField(max_length=10)
    mailing_name = serializers.CharField(allow_null=True, required=False, max_length=255)
    country = serializers.CharField(allow_null=True, required=False, max_length=100)
    state = serializers.CharField(max_length=100)
    pincode = serializers.IntegerField(allow_null=True, required=False)
    phone_no = serializers.CharField(allow_null=True, required=False)
    mobile_no = serializers.CharField(allow_null=True, required=False)
    fax_no = serializers.CharField(allow_null=True, required=False)
    email = serializers.EmailField(allow_null=True, required=False)
    website = serializers.URLField(allow_null=True, required=False)
    suffix_symbol_to_amount = serializers.BooleanField(default=False)
    add_space_between_amount_and_symbol = serializers.BooleanField(default=False)
    show_amount_in_millions = serializers.BooleanField(default=False)
    number_of_decimal_places = serializers.IntegerField(default=2)
    word_representing_amount_after_decimal = serializers.CharField(max_length=50, default='paise')
    decimal_places_for_amount_in_words = serializers.IntegerField(default=2)
    use_security_control = serializers.BooleanField(default=False)
    administrator_name = serializers.CharField(allow_null=True, required=False, max_length=255)
    password = serializers.CharField(allow_null=True, required=False, max_length=255)
    repeat_password = serializers.CharField(allow_null=True, required=False, max_length=255)
    use_audit_features = serializers.BooleanField(default=False)
    disallow_opening_in_educational_mode = serializers.BooleanField(default=False)

    def create(self, validated_data):
        try:
            # Creating the company instance
            company_instance = Company(**validated_data)
            company_instance.save()  # Save the instance to the database
            return company_instance  # Return the created instance
        except Exception as e:
            raise serializers.ValidationError(f"Error creating company: {str(e)}")

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class SalesPartySerializer(serializers.Serializer):
    sales_party_id = serializers.UUIDField(default=uuid.uuid4, read_only=True) 
    name = serializers.CharField(max_length=255)
    alias = serializers.CharField(max_length=255, required=False, allow_blank=True)
    maintain_balances_bill_by_bill = serializers.BooleanField(default=False)
    default_credit_period = serializers.IntegerField(required=False, allow_null=True)
    check_credit_days_during_voucher_entry = serializers.IntegerField(required=False, allow_null=True)
    inventory_values_affected = serializers.BooleanField(default=False)
    mailing_name = serializers.CharField(max_length=255, required=False)
    mailing_address = serializers.CharField()
    mailing_country = serializers.CharField(max_length=100)
    mailing_state = serializers.CharField(max_length=100)
    mailing_pincode = serializers.CharField(max_length=10)
    provide_bank_details = serializers.BooleanField(default=False)
    pan_it_number = serializers.CharField(max_length=20, required=False, allow_blank=True)
    registration_type = serializers.ChoiceField(choices=[('Regular', 'Regular'), ('Composition', 'Composition')], default='Regular')
    gstin_uin = serializers.CharField(max_length=15, required=False, allow_blank=True)
    set_alter_gst_details = serializers.BooleanField(default=False)
    gst_rate = serializers.FloatField(required=False, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """
        Create and return a new `SalesParty` instance, given the validated data.
        """
        try:
            sales_party = SalesParty(**validated_data)
            sales_party.save()
            return sales_party
        except ValidationError as e:
            raise serializers.ValidationError(f"MongoEngine validation error: {str(e)}")

    def update(self, instance, validated_data):
        """
        Update and return an existing `SalesParty` instance, given the validated data.
        """
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance

    def validate(self, data):
        if not data.get('maintain_balances_bill_by_bill'):
            data.update({
                'default_credit_period': None,
                'check_credit_days_during_voucher_entry': None,
                'inventory_values_affected': None,
                'mailing_name': None,
                'mailing_address': None,
                'mailing_country': None,
                'mailing_state': None,
                'mailing_pincode': None,
                'provide_bank_details': None,
                'pan_it_number': None,
                'gstin_uin': None,
                'set_alter_gst_details': None,
                'gst_rate': None,
            })
        elif data.get('set_alter_gst_details') and not data.get('gst_rate'):
            raise serializers.ValidationError("GST rate is required when GST details are set.")

        return data
    


class PurchaseLedgerSerializer(serializers.Serializer):
    PurchaseLedger_id = serializers.UUIDField(read_only=True)  # MongoEngine UUIDField, generated automatically
    name = serializers.CharField(max_length=255)
    alias = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)
    under = serializers.CharField(max_length=255, default="Purchase Ledger")
    inventory_values_affected = serializers.BooleanField(default=False)
    type_of_ledger = serializers.ChoiceField(
        choices=[
            ('Not Applicable', 'Not Applicable'),
            ('Discount', 'Discount'),
            ('Invoice Rounding', 'Invoice Rounding'),
        ],
        default='Not Applicable'
    )
    rounding_method = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    rounding_limit = serializers.IntegerField(required=False, allow_null=True)
    mailing_name = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True)
    address = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    provide_bank_details = serializers.BooleanField(default=False)
    pan_it_no = serializers.CharField(max_length=15, required=False, allow_blank=True, allow_null=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        """Create a new PurchaseLedger instance in MongoDB."""
        from Com_app.models import PurchaseLedger
        return PurchaseLedger(**validated_data).save()

    def update(self, instance, validated_data):
        """Update an existing PurchaseLedger instance."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    

class AccountingVoucherSerializer(serializers.Serializer):
    sales_id = serializers.UUIDField(default=uuid.uuid4, read_only=True) 
    date = serializers.DateField()
    reference_no = serializers.CharField(max_length=50)
    party_account_name = serializers.CharField(max_length=255)
    current_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    sales_ledger = serializers.CharField(max_length=255)
    quantity = serializers.IntegerField()
    rate = serializers.DecimalField(max_digits=10, decimal_places=2)
    per = serializers.CharField(max_length=50)
    amount = serializers.DecimalField(max_digits=15, decimal_places=2)
    narration = serializers.CharField()

    def create(self, validated_data):
        # Save the validated data into the MongoDB database
        return AccountingVoucher(**validated_data).save()

    def update(self, instance, validated_data):
        # Update the existing MongoEngine document
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()
        return instance
    

class PurchasePartySerializer(serializers.Serializer):
    purchase_party_id = serializers.UUIDField(default=uuid.uuid4, read_only=True)
    name = serializers.CharField(max_length=255)
    alias = serializers.CharField(max_length=255, required=False, allow_blank=True)
    maintain_balances = serializers.BooleanField(default=False)
    default_credit_period = serializers.IntegerField(required=False, allow_null=True)
    check_credit_days = serializers.BooleanField(required=False, allow_null=True)
    inventory_values_affected = serializers.BooleanField(default=True)
    mailing_name = serializers.CharField(max_length=255)
    mailing_address = serializers.CharField()
    mailing_country = serializers.CharField(max_length=100)
    mailing_state = serializers.CharField(max_length=100)
    mailing_pincode = serializers.CharField(max_length=10)
    provide_bank_details = serializers.BooleanField(default=False)
    pan_it_no = serializers.CharField(max_length=20, required=False, allow_blank=True)
    registration_type = serializers.CharField(max_length=50, default="Regular")
    gstin_uin = serializers.CharField(max_length=15, required=False, allow_blank=True)
    set_alter_gst_details = serializers.BooleanField(default=False)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        # Create the PurchaseParty instance and save it to the MongoDB database
        try:
            purchase_party = PurchaseParty(**validated_data)
            purchase_party.save()  # Save the document to MongoDB
            return purchase_party
        except NotUniqueError:
            raise serializers.ValidationError({"gstin_uin": "The GSTIN/UIN provided already exists."})

    def validate_mailing_pincode(self, value):
        if not value:
            raise serializers.ValidationError("Mailing Pincode cannot be empty.")
        return value

    def validate_mailing_country(self, value):
        if not value:
            raise serializers.ValidationError("Mailing Country cannot be empty.")
        return value

    def validate_mailing_state(self, value):
        if not value:
            raise serializers.ValidationError("Mailing State cannot be empty.")
        return value

    def validate(self, data):
        if data.get("maintain_balances", False):
            if not data.get("default_credit_period"):
                raise serializers.ValidationError(
                    {"default_credit_period": "This field is required when maintain_balances is True."}
                )
            if "check_credit_days" not in data:
                raise serializers.ValidationError(
                    {"check_credit_days": "This field is required when maintain_balances is True."}
                )
        return data
    

class SalesLedgerSerializer(serializers.Serializer):
    SalesLedger_id = serializers.UUIDField(default=uuid.uuid4, read_only=True)
    name = serializers.CharField(max_length=255)
    alias = serializers.CharField(max_length=255, required=False, allow_blank=True)
    under = serializers.CharField(max_length=255, default="Sales Ledger")
    inventory_values_affected = serializers.BooleanField(default=False)
    type_of_salesLeger = serializers.CharField(max_length=50, default='Not Applicable')
    rounding_method = serializers.CharField(max_length=255, required=False, allow_blank=True)
    rounding_limit = serializers.IntegerField(required=False, allow_null=True)
    mailing_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    mailing_address = serializers.CharField(required=False, allow_blank=True)
    provide_bank_details = serializers.BooleanField(default=False)
    pan_it_no = serializers.CharField(max_length=15, required=False, allow_blank=True)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False)

    def validate(self, data):
        # Additional custom validation
        if data.get("type_of_salesLeger") == "Invoice Rounding":
            if not data.get("rounding_method") or not data.get("rounding_limit"):
                raise serializers.ValidationError(
                    {"rounding_method": "Both 'rounding_method' and 'rounding_limit' are required when 'type_of_salesLeger' is set to 'Invoice Rounding'."}
                )
        return data

    def create(self, validated_data):
        # Create a SalesLedger instance with validated data
        sales_ledger = SalesLedger(**validated_data)
        sales_ledger.save()
        return sales_ledger

class PurchaseVoucherSerializer(serializers.Serializer):
    purchase_id = serializers.UUIDField(default=uuid.uuid4, read_only=True)
    supplier_invoice_no = serializers.CharField(max_length=255)
    date = serializers.DateField()
    party_account_name = serializers.CharField(max_length=255)
    current_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    purchase_ledger = serializers.CharField(max_length=255)
    narration = serializers.CharField(required=False, allow_blank=True)
    
    item_name = serializers.CharField(max_length=255)
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)
    rate_per = serializers.DecimalField(max_digits=10, decimal_places=2)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False)

    def create(self, validated_data):
        return PurchaseVoucher.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Update the PurchaseVoucher document
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class PaymentSerializer(serializers.Serializer):
    payment_id= serializers.UUIDField(default=uuid.uuid4, read_only=True)
    date = serializers.DateField()
    account = serializers.CharField(max_length=255)
    cur_balance = serializers.DecimalField(max_digits=10, decimal_places=2)
    particulars = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    narration = serializers.CharField(allow_blank=True, required=False)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False) 

    def create(self, validated_data):
        # Create and save the new payment document using MongoEngine
        payment = Payment(**validated_data)
        payment.save()  # Save to the database
        return payment  # Return the created payment instance

    def update(self, instance, validated_data):
        # Update an existing payment document
        instance.payment_number = validated_data.get('payment_number', instance.payment_number)
        instance.date = validated_data.get('date', instance.date)
        instance.account = validated_data.get('account', instance.account)
        instance.cur_balance = validated_data.get('cur_balance', instance.cur_balance)
        instance.particulars = validated_data.get('particulars', instance.particulars)
        instance.amount = validated_data.get('amount', instance.amount)
        instance.narration = validated_data.get('narration', instance.narration)
        instance.save()
        return instance