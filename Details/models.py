from django.db import models
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.utils.timezone import now,timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
import uuid



class UserData(models.Model):
    # ROLES = [
    #     ('admin', 'Admin'),
    #     ('customer', 'Customer'),
    #     ('Employee', 'employee'),
    # ]
    username = models.CharField(max_length=255, null=False, blank=False)
    email = models.EmailField(unique=True ,blank=False)
    password = models.CharField(max_length=128 ,null=False, blank=False) 
    phone = models.CharField(max_length=15, blank=True, null=True)
    license_key = models.CharField(
        max_length=50,
        unique=True,
        validators=[
            RegexValidator(
                regex='^[A-NP-Za-np-z0-9]+$',
                message="The license key cannot contain the characters '0' or 'o'."
            )
        ]
    )
    status = models.TextField(default="unverified") 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

class EmailOTP(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=4)  
    created_at = models.DateTimeField(default=timezone.now) 
    expires_at = models.DateTimeField()

    def is_expired(self):
        return now() > self.expires_at
    
    def __str__(self):
        return f"OTP for {self.email}: {self.otp}"


class Company(models.Model):
    company_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=255, unique=True)
    mailing_name = models.CharField(max_length=255,null=True, blank=True)
    country = models.CharField(max_length=100,null=True, blank=True)
    state = models.CharField(max_length=100,null=True, blank= False )
    pincode = models.IntegerField(null=True, blank=True)
    phone_no = models.BigIntegerField(null=True, blank=True)
    mobile_no = models.BigIntegerField(null=True, blank=True,unique=True)
    fax_no = models.BigIntegerField(blank=True, null=True)
    email = models.EmailField(null=True, blank=True)
    website = models.URLField(blank=True, null=True)

    financial_year_begins_from = models.DateField()
    books_beginning_from = models.DateField()
    base_currency_symbol = models.CharField(max_length=10, default='₹')
    formal_name = models.CharField(max_length=100, default='India')
    suffix_symbol_to_amount = models.BooleanField(default=False)
    add_space_between_amount_and_symbol = models.BooleanField(default=False)
    show_amount_in_millions = models.BooleanField(default=False)
    number_of_decimal_places = models.IntegerField(default=2)
    word_representing_amount_after_decimal = models.CharField(max_length=50, default='paise')
    decimal_places_for_amount_in_words = models.IntegerField(default=2)

    use_security_control = models.BooleanField(default=False)
    administrator_name = models.CharField(max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    repeat_password = models.CharField(max_length=255, blank=True, null=True)
    use_audit_features = models.BooleanField(default=False)
    disallow_opening_in_educational_mode = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
        super().save(*args, **kwargs)




class SalesParty(models.Model):
    # SalesParty_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, null=True, blank=True)
    maintain_balances_bill_by_bill = models.BooleanField(default=False)
    default_credit_period = models.IntegerField(null=True, blank=True)  
    check_credit_days_during_voucher_entry = models.IntegerField(null=True, blank=True) 
    inventory_values_affected = models.BooleanField(default=False)
    mailing_name = models.CharField(max_length=255, null=True, blank=False)
    mailing_address = models.TextField(null=True, blank=False)
    mailing_country = models.CharField(max_length=100, null=True, blank=False)
    mailing_state = models.CharField(max_length=100, null=True, blank=False)
    mailing_pincode = models.CharField(max_length=10, null=True, blank=False)

    provide_bank_details = models.BooleanField(default=False)
    pan_it_number = models.CharField(max_length=20, null=True, blank=True)
    registration_type = models.CharField(max_length=20, choices=[('Regular', 'Regular'), ('Composition', 'Composition')], default='Regular')
    gstin_uin = models.CharField(max_length=15, null=True, blank=True)
  
    set_alter_gst_details = models.BooleanField(default=False)
    gst_rate = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.maintain_balances_bill_by_bill:
            self.default_credit_period = None
            self.check_credit_days_during_voucher_entry = None

        super(SalesParty, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    def clean(self):
        if not self.maintain_balances_bill_by_bill:
            self.default_credit_period = None
            self.check_credit_days_during_voucher_entry = None
            self.inventory_values_affected = None
            self.mailing_name = None
            self.mailing_address = None
            self.mailing_country = None
            self.mailing_state = None
            self.mailing_pincode = None
            self.provide_bank_details = None
            self.bank_name = None
            self.bank_account_number = None
            self.bank_ifsc_code = None
            self.pan_it_number = None
            self.gstin_uin = None
            self.set_alter_gst_details = None
            self.gst_rate = None
      
        if self.set_alter_gst_details and not self.gst_rate:
            raise ValidationError("GST rate is required when GST details are set.")
        
        super().clean()


class AccountingVoucher(models.Model):
    sales_no = models.AutoField(primary_key=True) 
    date = models.DateField()  
    reference_no = models.CharField(max_length=50)  
    party_account_name = models.CharField(max_length=255)  
    current_balance = models.DecimalField(max_digits=15, decimal_places=2) 
    sales_ledger = models.CharField(max_length=255) 
    quantity = models.PositiveIntegerField()  
    rate = models.DecimalField(max_digits=10, decimal_places=2)      
    per = models.CharField(max_length=50)  
    amount = models.DecimalField(max_digits=15, decimal_places=2) 
    narration = models.TextField()  

    def __str__(self):
        return f"Voucher {self.sales_no} - {self.party_account_name}"


class PurchaseParty(models.Model):
    purchase_party_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, blank=True, null=True)
    # under_sales_party = models.CharField(max_length=255, default="Sales Party (Current Assets)")  
    maintain_balances = models.BooleanField(default=False) 
    default_credit_period = models.PositiveIntegerField(null=True, blank=True) 
    check_credit_days = models.BooleanField(null=True, blank=True)  
    inventory_values_affected = models.BooleanField(default=True)  
    mailing_name = models.CharField(max_length=255, null=True, blank=False)
    mailing_address = models.TextField(null=True, blank=False)
    mailing_country = models.CharField(max_length=100, null=True, blank=False)
    mailing_state = models.CharField(max_length=100, null=True, blank=False)
    mailing_pincode = models.CharField(max_length=10, null=True, blank=False)
    provide_bank_details = models.BooleanField(default=False)  
    pan_it_no = models.CharField(max_length=20, blank=True, null=True)
    registration_type = models.CharField(max_length=50, default="Regular")
    gstin_uin = models.CharField(max_length=15, blank=True, null=True)
    set_alter_gst_details = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
   

    def __str__(self):
        return self.name


class PurchaseLedger(models.Model):
    LEDGER_TYPES = [
        ('Not Applicable', 'Not Applicable'),
        ('Discount', 'Discount'),
        ('Invoice Rounding', 'Invoice Rounding'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, blank=True, null=True)
    under = models.CharField(max_length=255, default="Purchase Ledger")
    inventory_values_affected = models.BooleanField(default=False)
    type_of_ledger = models.CharField(max_length=20, choices=LEDGER_TYPES, default='Not Applicable')
    rounding_method = models.CharField(max_length=50, blank=True, null=True)
    rounding_limit = models.IntegerField(blank=True, null=True)
    mailing_name = models.CharField(max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    provide_bank_details = models.BooleanField(default=False)
    pan_it_no = models.CharField(max_length=15, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    
    def __str__(self):
        return self.name


class SalesLedger(models.Model):

    TYPE_CHOICES = [
        ('Not Applicable', 'Not Applicable'),
        ('Discount', 'Discount'),
        ('Invoice Rounding', 'Invoice Rounding'),
    ]

    
    SalesLedger_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, blank=True, null=True) 
    under = models.CharField(max_length=255, default="Sales Ledger")
    inventory_values_affected = models.BooleanField(default=False)
    type_of_salesLeger = models.CharField(max_length=50,choices=TYPE_CHOICES,default='Not Applicable')
    rounding_method = models.CharField(max_length=255, blank=True, null=True)
    rounding_limit = models.IntegerField(blank=True, null=True)
    mailing_name = models.CharField(max_length=255, blank=True, null=True)
    mailing_address = models.TextField(blank=True, null=True)
    provide_bank_details = models.BooleanField(default=False)
    pan_it_no = models.CharField(max_length=15, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

   
    def __str__(self):
        return self.name


class PurchaseVoucher(models.Model):
    purchase_no = models.AutoField(primary_key=True)  
    supplier_invoice_no = models.CharField(max_length=255, unique=True)  
    date = models.DateField()  
    party_account_name = models.CharField(max_length=255)  
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) 
    purchase_ledger = models.CharField(max_length=255) 
    narration = models.TextField(blank=True, null=True)  

    item_name = models.CharField(max_length=255)  
    quantity = models.DecimalField(max_digits=10, decimal_places=2)  
    rate_per = models.DecimalField(max_digits=10, decimal_places=2)  
    amount = models.DecimalField(max_digits=10, decimal_places=2)  
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.amount = self.quantity * self.rate_per  
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Purchase No: {self.purchase_no} - {self.supplier_invoice_no}"

    def calculate_total_amount(self):
        return self.amount




class Payment(models.Model):
    payment_number = models.AutoField(primary_key=True) 
    date = models.DateField()  
    account = models.CharField(max_length=255)  
    cur_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  
    particulars = models.TextField()  
    amount = models.DecimalField(max_digits=10, decimal_places=2)  
    narration = models.TextField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"Payment No: {self.payment_number} - {self.account}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)




from django.db import models

class CashInHand(models.Model):
  
    name = models.CharField(max_length=255)  
    under = models.CharField(max_length=255, default='Cash-in-Hand (Current Assets)')  
    mailing_name = models.CharField(max_length=255)  
    mailing_address = models.TextField()  
    provide_bank_details = models.BooleanField(default=False) 
    bank_details_for = models.CharField(max_length=255, blank=True, null=True)  
    # Bank information (only if 'provide_bank_details' is True)
    Account_number= models.CharField(max_length=50, blank=True, null=True)  
    ifsc_code = models.CharField(max_length=20, blank=True, null=True)  
    bank_name = models.CharField(max_length=255, blank=True, null=True) 
    
    pan_it_no = models.CharField(max_length=20, blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True) 
    updated_at = models.DateTimeField(auto_now=True)  
    
    def __str__(self):
        return self.name





class Companies(models.Model):
    class BusinessType(models.TextChoices):
        MANUFACTURING = 'manufacturing', _('Manufacturing')
        TRADING = 'trading', _('Trading')
        SERVICE = 'service', _('Service')
        OTHER = 'other', _('Other')

    company_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # financial_year_start = models.DateField()
    # financial_year_end = models.DateField()
    gst_number = models.CharField(max_length=15, unique=True, blank=True, null=True)
    pan_number = models.CharField(max_length=10, unique=True, blank=True, null=True)
    default_currency = models.CharField(max_length=10)
    multi_currency_enabled = models.BooleanField(default=False)
    multi_language_support = models.JSONField(blank=True, null=True)
    business_type = models.CharField(
        max_length=20,
        choices=BusinessType.choices,
        default=BusinessType.OTHER,
    )
    data_locking_enabled = models.BooleanField(default=False)
    lock_period_from = models.DateField(blank=True, null=True)
    lock_period_to = models.DateField(blank=True, null=True)
    default_email = models.EmailField(max_length=255, unique=True, blank=True, null=True)
    default_phone = models.CharField(max_length=15, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
       return f"{self.gst_number or 'Company'} - {self.default_email or 'No Email'}"






# class Company(models.Model):
#     company_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     company_name = models.CharField(max_length=255, unique=True)
#     financial_year_start = models.DateField()
#     financial_year_end = models.DateField()
#     gst_number = models.CharField(max_length=50)
#     pan_number = models.CharField(max_length=50)
#     default_currency = models.CharField(max_length=10)
#     multi_currency_enabled = models.BooleanField(default=False)
#     multi_language_support = models.JSONField()
#     business_type = models.CharField(max_length=50, choices=[
#         ('manufacturing', 'Manufacturing'),
#         ('trading', 'Trading'),
#         ('service', 'Service'),
#     ])
#     data_locking_enabled = models.BooleanField(default=False)
#     lock_period_from = models.DateField(null=True, blank=True)
#     lock_period_to = models.DateField(null=True, blank=True)
#     default_email = models.EmailField()
#     default_phone = models.CharField(max_length=15)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)

class Branch(models.Model):
    branch_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    branch_name = models.CharField(max_length=255)
    parent_branch = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    default_currency = models.CharField(max_length=10)
    timezone = models.CharField(max_length=50)

class CurrencySetting(models.Model):
    currency_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    currency_name = models.CharField(max_length=100)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4)
    symbol = models.CharField(max_length=10)
    decimal_places = models.IntegerField()


# class AccountGroup(models.Model):
#     group_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     group_name = models.CharField(max_length=255)
#     cost_allocation_enabled = models.BooleanField(default=False)
#     cash_flow_affect = models.CharField(
#         max_length=50,
#         choices=[
#             ('operating', 'Operating'),
#             ('investing', 'Investing'),
#             ('financing', 'Financing'),
#             ('none', 'None')
#         ]
#     )

# class Ledger(models.Model):
#     ledger_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     ledger_name = models.CharField(max_length=255)
#     account_group = models.ForeignKey(AccountGroup, on_delete=models.CASCADE)
#     interest_calculation = models.BooleanField(default=False)
#     default_budget = models.DecimalField(max_digits=12, decimal_places=2)

# class LedgerDefault(models.Model):
#     ledger = models.OneToOneField(Ledger, on_delete=models.CASCADE, primary_key=True)
#     default_currency = models.CharField(max_length=10)
#     payment_terms = models.TextField()
#     tax_inclusive = models.BooleanField(default=False)
#     credit_limit = models.DecimalField(max_digits=12, decimal_places=2)

# class StockItem(models.Model):
#     item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     item_name = models.CharField(max_length=255)
#     batch_tracking_enabled = models.BooleanField(default=False)
#     serial_number_tracking = models.BooleanField(default=False)
#     manufacturing_date = models.DateField(null=True, blank=True)
#     unit_conversion_factor = models.DecimalField(max_digits=8, decimal_places=4)

# class PricingTier(models.Model):
#     tier_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     tier_name = models.CharField(max_length=100)
#     item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
#     price = models.DecimalField(max_digits=10, decimal_places=2)

# class ManufacturingUnit(models.Model):
#     unit_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     item = models.ForeignKey(StockItem, on_delete=models.CASCADE)
#     process_name = models.CharField(max_length=255)
#     output_quantity = models.DecimalField(max_digits=10, decimal_places=2)
#     input_material = models.JSONField()

# class GSTReturn(models.Model):

#     FILING_STATUS_CHOICES = [
#             ('pending', 'Pending'),
#             ('filed', 'Filed'),
#             ('rejected', 'Rejected')
#         ] 
     
#     return_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     company = models.ForeignKey(Company, on_delete=models.CASCADE)
#     return_period = models.DateField()
#     total_taxable_value = models.DecimalField(max_digits=15, decimal_places=2)
#     total_tax_paid = models.DecimalField(max_digits=15, decimal_places=2)
#     filing_status = models.CharField( max_length=50,choices=FILING_STATUS_CHOICES,)

# class Deductible(models.Model):
#     deductible_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     voucher_id = models.UUIDField()   
#     tax_deducted = models.DecimalField(max_digits=10, decimal_places=2)
#     deductible_type = models.CharField(max_length=100)

# class EmployeeBenefit(models.Model):
#     benefit_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     employee_id = models.UUIDField()  
#     benefit_name = models.CharField(max_length=255)
#     amount = models.DecimalField(max_digits=12, decimal_places=2)

# class EmployeeLoan(models.Model):
#     loan_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     employee_id = models.UUIDField()  
#     principal_amount = models.DecimalField(max_digits=15, decimal_places=2)
#     interest_rate = models.DecimalField(max_digits=5, decimal_places=2)
#     installments_due = models.IntegerField()
# class Project(models.Model):
#     project_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     project_name = models.CharField(max_length=255)
#     start_date = models.DateField()
#     end_date = models.DateField(null=True, blank=True)
#     budget = models.DecimalField(max_digits=15, decimal_places=2)

# class Asset(models.Model):
#     asset_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     asset_name = models.CharField(max_length=255)
#     purchase_date = models.DateField()
#     value = models.DecimalField(max_digits=15, decimal_places=2)
#     depreciation_rate = models.DecimalField(max_digits=5, decimal_places=2)

# class CustomerPortalSetting(models.Model):
#     portal_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     customer_id = models.UUIDField()  
#     features_enabled = models.JSONField()
#     last_login = models.DateTimeField(null=True, blank=True)

