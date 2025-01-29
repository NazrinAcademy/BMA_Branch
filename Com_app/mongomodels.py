from mongoengine import Document, StringField, EmailField, DateTimeField,IntField,BooleanField,FloatField,DecimalField, DateField,UUIDField
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import date
import uuid
from rest_framework import serializers
from mongoengine import fields
from datetime import datetime

class UserData(Document):
    username = StringField(max_length=255, required=True)
    email = EmailField(unique=True, required=True)
    password = StringField(max_length=128, required=True)
    role = StringField(max_length=50, null=True, blank=True)
    phone = StringField(max_length=15, null=True, blank=True)
    
    license_key = StringField(
        max_length=50,
        unique=True,
        regex=r'^[A-NP-Za-np-z0-9]+$',
        required=True
    )
    
    status = StringField(default="unverified") 
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return self.username



class EmailOTP(Document):
    email = EmailField(unique=True, required=True)  
    otp = StringField(max_length=4, required=True)  # OTP field
    created_at = DateTimeField(default=datetime.utcnow)  # Creation timestamp
    expires_at = DateTimeField(required=True)  # Expiration timestamp

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

    def __str__(self):
        return f"OTP for {self.email}: {self.otp}"


class Company(Document):
    company_id = fields.UUIDField(primary_key=True, default=uuid.uuid4, required=True)
    company_name = fields.StringField(max_length=255, unique=True, required=True)
    mailing_name = fields.StringField(max_length=255, null=True, blank=True)
    country = fields.StringField(max_length=100, null=True, blank=True)
    state = fields.StringField(max_length=100, null=False)
    pincode = fields.IntField(null=True, blank=True)
    phone_no = fields.LongField(null=True, blank=True)
    mobile_no = fields.LongField(null=True, blank=True, unique=True) 
    fax_no = fields.LongField(null=True, blank=True)
    email = fields.EmailField(null=True, blank=True)
    website = fields.URLField(null=True, blank=True)

    financial_year_begins_from = fields.DateField(required=True)
    books_beginning_from = fields.DateField(required=True)
    base_currency_symbol = fields.StringField(max_length=10, default='₹')
    formal_name = fields.StringField(max_length=100, default='India')
    suffix_symbol_to_amount = fields.BooleanField(default=False)
    add_space_between_amount_and_symbol = fields.BooleanField(default=False)
    show_amount_in_millions = fields.BooleanField(default=False)
    number_of_decimal_places = fields.IntField(default=2)
    word_representing_amount_after_decimal = fields.StringField(max_length=50, default='paise')
    decimal_places_for_amount_in_words = fields.IntField(default=2)

    use_security_control = fields.BooleanField(default=False)
    administrator_name = fields.StringField(max_length=255, null=True, blank=True)
    password = fields.StringField(max_length=255, null=True, blank=True)
    repeat_password = fields.StringField(max_length=255, null=True, blank=True)
    use_audit_features = fields.BooleanField(default=False)
    disallow_opening_in_educational_mode = fields.BooleanField(default=False)

    created_at = fields.DateTimeField(default=date.today)
    updated_at = fields.DateTimeField(default=date.today)


    def clean(self):
        if self.use_security_control:
            if not self.administrator_name:
                raise ValidationError("Administrator name is required when security control is enabled.")
            if not self.password:
                raise ValidationError("Admin password is required when security control is enabled.")
            if self.password != self.repeat_password:
                raise ValidationError("Passwords do not match when security control is enabled.")
        else:
            self.administrator_name = None
            self.password = None
            self.repeat_password = None
            self.use_audit_features = False
            self.disallow_opening_in_educational_mode = False

    def save(self, *args, **kwargs):
        self.clean()  
        super(Company, self).save(*args, **kwargs)


class SalesParty(Document):
    sales_party_id = fields.UUIDField(primary_key=True ,default=uuid.uuid4, required=True)
    name = StringField(max_length=255, required=True)
    alias = StringField(max_length=255, null=True, blank=True)
    maintain_balances_bill_by_bill = BooleanField(default=False)
    default_credit_period = IntField(null=True, blank=True)
    check_credit_days_during_voucher_entry = IntField(null=True, blank=True)
    inventory_values_affected = BooleanField(default=False)
    mailing_name = StringField(max_length=255, null=True, blank=False)
    mailing_address = StringField(null=True, blank=False)
    mailing_country = StringField(max_length=100, null=True, blank=False)
    mailing_state = StringField(max_length=100, null=True, blank=False)
    mailing_pincode = StringField(max_length=10, null=True, blank=False)

    provide_bank_details = BooleanField(default=False)
    pan_it_number = StringField(max_length=20, null=True, blank=True)
    registration_type = StringField(
        max_length=20, 
        choices=[('Regular', 'Regular'), ('Composition', 'Composition')],
        default='Regular'
    )
    gstin_uin = StringField(max_length=15, null=True, blank=True)
    set_alter_gst_details = BooleanField(default=False)
    gst_rate = FloatField(null=True, blank=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def save(self, *args, **kwargs):
        if not self.maintain_balances_bill_by_bill:
            self.default_credit_period = None
            self.check_credit_days_during_voucher_entry = None

        self.updated_at = datetime.utcnow()
        return super(SalesParty, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
    
class AccountingVoucher(Document):
    sales_id = fields.UUIDField(primary_key=True ,default=uuid.uuid4, required=True)
    date = DateField(required=True)  
    reference_no = StringField(max_length=50, required=True)  # Reference number
    party_account_name = StringField(max_length=255, required=True)  # Party account name
    current_balance = DecimalField(precision=2, required=True)  
    sales_ledger = StringField(max_length=255, required=True)  
    quantity = IntField(required=True, min_value=0)  # Quantity
    rate = DecimalField(precision=2, required=True)  # Rate
    per = StringField(max_length=50, required=True)  # Per unit
    amount = DecimalField(precision=2, required=True)  
    narration = StringField(required=True)  


    def __str__(self):
        return f"Voucher {self.sales_no} - {self.party_account_name}"
    

class PurchaseParty(Document):
    purchase_party_id = UUIDField(primary_key=True, default=uuid.uuid4)
    name = StringField(max_length=255, required=True)
    alias = StringField(max_length=255, blank=True, null=True)
    maintain_balances = BooleanField(default=False)
    default_credit_period = IntField(null=True, blank=True, min_value=0)
    check_credit_days = BooleanField(null=True, blank=True)
    inventory_values_affected = BooleanField(default=True)
    mailing_name = StringField(max_length=255, null=True)
    mailing_address = StringField(null=True)
    mailing_country = StringField(max_length=100, null=True)
    mailing_state = StringField(max_length=100, null=True)
    mailing_pincode = StringField(max_length=10, null=True)
    provide_bank_details = BooleanField(default=False)
    pan_it_no = StringField(max_length=20, blank=True, null=True)
    registration_type = StringField(max_length=50, default="Regular")
    gstin_uin = StringField(max_length=15, blank=True, null=True)
    set_alter_gst_details = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)


    def __str__(self):
        return self.name


class PurchaseLedger(Document):
    LEDGER_TYPES = [
        ('Not Applicable', 'Not Applicable'),
        ('Discount', 'Discount'),
        ('Invoice Rounding', 'Invoice Rounding'),
    ]

    PurchaseLedger_id = fields.UUIDField(primary_key=True ,default=uuid.uuid4, required=True)
    name = StringField(max_length=255, required=True)
    alias = StringField(max_length=255, null=True, blank=True)
    under = StringField(max_length=255, default="Purchase Ledger")
    inventory_values_affected = BooleanField(default=False)
    type_of_ledger = StringField(choices=LEDGER_TYPES, default='Not Applicable', max_length=20)
    rounding_method = StringField(max_length=50, null=True, blank=True)
    rounding_limit = IntField(null=True, blank=True)
    mailing_name = StringField(max_length=255, null=True, blank=True)
    address = StringField(null=True, blank=True)
    provide_bank_details = BooleanField(default=False)
    pan_it_no = StringField(max_length=15, null=True, blank=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    def __str__(self):
        return self.name

class SalesLedger(Document):
    TYPE_CHOICES = [
        ('Not Applicable', 'Not Applicable'),
        ('Discount', 'Discount'),
        ('Invoice Rounding', 'Invoice Rounding'),
    ]
    
    SalesLedger_id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = StringField(max_length=255, required=True)
    alias = StringField(max_length=255, blank=True, null=True)
    under = StringField(max_length=255, default="Sales Ledger")
    inventory_values_affected = BooleanField(default=False)
    type_of_salesLeger = StringField(max_length=50, choices=TYPE_CHOICES, default='Not Applicable')
    rounding_method = StringField(max_length=255, blank=True, null=True)
    rounding_limit = IntField(blank=True, null=True)
    mailing_name = StringField(max_length=255, blank=True, null=True)
    mailing_address = StringField(blank=True, null=True)
    provide_bank_details = BooleanField(default=False)
    pan_it_no = StringField(max_length=15, unique=True, blank=True, null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    

class PurchaseVoucher(Document):
    purchase_id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    supplier_invoice_no = fields.StringField(max_length=255, unique=True)  
    date = fields.DateField()  
    party_account_name = fields.StringField(max_length=255)  
    current_balance = fields.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00'))  
    purchase_ledger = fields.StringField(max_length=255)  
    narration = fields.StringField(blank=True, null=True)  

    item_name = fields.StringField(max_length=255)  
    quantity = fields.DecimalField(max_digits=10, decimal_places=2)  
    rate_per = fields.DecimalField(max_digits=10, decimal_places=2)  
    amount = fields.DecimalField(max_digits=10, decimal_places=2)  
    created_at = fields.DateTimeField(auto_now_add=True)
    updated_at = fields.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate amount before saving
        self.amount = self.quantity * self.rate_per  
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"Purchase No: {self.purchase_id} - {self.supplier_invoice_no}"

    def calculate_total_amount(self):
        return self.amount
    

# class PurchaseVoucher(Document):
#     purchase_id = UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     supplier_invoice_no = fields.StringField(max_length=255, unique=True)  
#     date = fields.DateField()  