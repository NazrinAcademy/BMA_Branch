from django.db import models
from datetime import date
import uuid
from django.core.validators import RegexValidator

class GST(models.Model):
    state = models.CharField(max_length=100)
    registration_type = models.CharField(max_length=100)
    assessee_of_other_territory = models.CharField(max_length=100)
    GSTIN_UIN = models.CharField(max_length=100)
    periodicity_of_GSTR1 = models.CharField(max_length=100)
    gst_user_name = models.CharField(max_length=100)
    mode_filing = models.CharField(max_length=100)
    e_invoicing_applicable = models.CharField(max_length=100)
    applicable_from_e_invoicing = models.DateField()
    invoice_bill_from_place = models.CharField(max_length=100)
    e_way_bill_applicable = models.CharField(max_length=100)
    applicable_from_e_way_bill = models.DateField()
    applicable_for_intrastate = models.CharField(max_length=100)

    def __str__(self):
        return f"GST Details: {self.state} - {self.GSTIN_UIN}"
    



class TaxDetails(models.Model):
    TAXABILITY_CHOICES = [
        ('Unknown', 'Unknown'),
        ('Exempt', 'Exempt'),
        ('Nil Rated', 'Nil Rated'),
        ('Taxable', 'Taxable'),
    ]

    taxability = models.CharField(max_length=20,choices=TAXABILITY_CHOICES,null=True,blank=True,default=None  )
    applicable_from = models.DateField(null=True,blank=True,default=None )
    tax_type = models.CharField(max_length=50,null=True,blank=True,default=None )
    integrated_tax = models.DecimalField(max_digits=5,decimal_places=2,null=True,blank=True,default=None  )
    cess = models.DecimalField(max_digits=5,decimal_places=2,null=True,blank=True,default=None)

    def __str__(self):
        return f"Stock Group Tax Details - {self.id}"    

class GSTR1(models.Model):

# B2BInvoice:
    gstin_uin_recipient = models.CharField(max_length=15,null=False)  
    receiver_name = models.CharField(max_length=255)  
    invoice_number = models.CharField(max_length=50)  
    invoice_date = models.DateField() 
    place_of_supply = models.CharField(max_length=255)  
    invoice_value = models.DecimalField(max_digits=10, decimal_places=2)  
    supply_type = models.CharField(max_length=50) 
# B2CLInvoice:
    place_of_supply_b2cl = models.CharField(max_length=255) 
    invoice_number_b2cl = models.CharField(max_length=50) 
    invoice_date_b2cl = models.DateField()  
    supply_type_b2cl = models.CharField(max_length=50)  
    invoice_value_b2cl = models.DecimalField(max_digits=10, decimal_places=2)  
#  B2CSInvoice:
    place_of_supply_b2cs = models.CharField(max_length=255) 
    taxable_value_b2cs = models.DecimalField(max_digits=10, decimal_places=2) 
    supply_type_b2cs = models.CharField(max_length=50) 
    rate_percentage_b2cs = models.DecimalField(max_digits=5, decimal_places=2) 
    integrated_tax_b2cs = models.DecimalField(max_digits=10, decimal_places=2)  
    central_tax_b2cs = models.DecimalField(max_digits=10, decimal_places=2) 
    state_ut_tax_b2cs = models.DecimalField(max_digits=10, decimal_places=2) 
    cess_b2cs = models.DecimalField(max_digits=10, decimal_places=2)  
# CDNRInvoice:
    gstin_uin_recipient_cdnr = models.CharField(max_length=15 ,null =False)  
    receiver_name_cdnr = models.CharField(max_length=255) 
    debit_credit_note_no_cdnr = models.CharField(max_length=50)  
    debit_credit_note_date_cdnr = models.DateField()  
    original_invoice_number_cdnr = models.CharField(max_length=50)
    original_invoice_date_cdnr = models.DateField()  
    note_type_cdnr = models.CharField(max_length=50)  
    note_value_cdnr = models.DecimalField(max_digits=10, decimal_places=2) 
#CDNURInvoice:
    note_type_cdnur = models.CharField(max_length=50) 
    debit_credit_note_no_cdnur = models.CharField(max_length=50) 
    debit_credit_note_date_cdnur = models.DateField()
    original_invoice_number_cdnur = models.CharField(max_length=50) 
    original_invoice_date_cdnur = models.DateField()  
    note_value_cdnur = models.DecimalField(max_digits=10, decimal_places=2) 
    supply_type_cdnur = models.CharField(max_length=50)  
#  EXPInvoice:
    invoice_number_exp = models.CharField(max_length=50)  
    invoice_date_exp = models.DateField()  
    port_code_exp = models.CharField(max_length=10)  
    shipping_bill_no_exp = models.CharField(max_length=50)  
    shipping_bill_date_exp = models.DateField() 
    total_invoice_value_exp = models.DecimalField(max_digits=10, decimal_places=2) 
    supply_type_exp = models.CharField(max_length=50) 
    gst_payment_exp = models.DecimalField(max_digits=10, decimal_places=2) 
#  NilExemptNonGSTSupplies:
    nil_rated = models.BooleanField() 
    exempted = models.BooleanField()  
    non_gst_supplies = models.BooleanField()  
#  HSNInvoice:
    hsn_code_hsn = models.CharField(max_length=12) 
    description_hsn = models.CharField(max_length=255)  
    uqc_hsn = models.CharField(max_length=10)  
    total_quantity_hsn = models.DecimalField(max_digits=10, decimal_places=2)  
    total_taxable_value_hsn = models.DecimalField(max_digits=10, decimal_places=2)  
    rate_percentage_hsn = models.DecimalField(max_digits=5, decimal_places=2) 
    integrated_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2) 
    central_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2)  
    state_ut_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2)  
    cess_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2) 
# TaxPeriodDocuments:
    nature_of_document = models.CharField(max_length=255)  
    sr_no_from = models.IntegerField()
    sr_no_to = models.IntegerField()  
    total_number = models.IntegerField()  
    cancelled = models.BooleanField()
    net_issue = models.IntegerField() 

# ----GSTR2---

class GSTR2(models.Model):
    # B2B Invoices (3,4A)
    gstin_uin_supplier_b2b = models.CharField(max_length=15)
    supplier_name_b2b = models.CharField(max_length=255)
    invoice_number_b2b = models.CharField(max_length=50)
    invoice_date_b2b = models.DateField()
    place_of_supply_b2b = models.CharField(max_length=255)
    supplier_invoice_no_b2b = models.CharField(max_length=50)
    invoice_value_b2b = models.DecimalField(max_digits=10, decimal_places=2)
    supply_type_b2b = models.CharField(max_length=50)
    
    # Credit/Debit Notes Regular (6c)
    gstin_uin_supplier_cdr = models.CharField(max_length=15)
    supplier_name_cdr = models.CharField(max_length=255)
    debit_credit_note_no_cdr = models.CharField(max_length=50)
    debit_credit_note_date_cdr = models.DateField()
    original_invoice_number_cdr = models.CharField(max_length=50)
    original_invoice_date_cdr = models.DateField()
    note_type_cdr = models.CharField(max_length=50)
    note_value_cdr = models.DecimalField(max_digits=10, decimal_places=2)
    supply_type_cdr = models.CharField(max_length=50)

    # B2BUR Invoice (4B)
    gstin_uin_supplier_b2bur = models.CharField(max_length=15)
    supplier_name_b2bur = models.CharField(max_length=255)
    invoice_number_b2bur = models.CharField(max_length=50)
    invoice_date_b2bur = models.DateField()
    place_of_supply_b2bur = models.CharField(max_length=255)
    supplier_invoice_no_b2bur = models.CharField(max_length=50)
    invoice_value_b2bur = models.DecimalField(max_digits=10, decimal_places=2)
    supply_type_b2bur = models.CharField(max_length=50)

    # Import of Services (4C)
    supplier_name_import_services = models.CharField(max_length=255)
    supplier_invoice_number_import_services = models.CharField(max_length=50)
    invoice_date_import_services = models.DateField()
    supplier_invoice_date_import_services = models.DateField()
    total_invoice_value_import_services = models.DecimalField(max_digits=10, decimal_places=2)

    # Import of Goods (5)
    supplier_name_import_goods = models.CharField(max_length=255)
    invoice_date_import_goods = models.DateField()
    bill_of_entry_no_import_goods = models.CharField(max_length=50)
    bill_of_entry_date_import_goods = models.DateField()
    port_code_import_goods = models.CharField(max_length=10)
    total_invoice_value_import_goods = models.DecimalField(max_digits=10, decimal_places=2)

    # Credit/Debit Notes Unregistered
    gstin_uin_supplier_cdunr = models.CharField(max_length=15)
    supplier_name_cdunr = models.CharField(max_length=255)
    debit_credit_note_no_cdunr = models.CharField(max_length=50)
    debit_credit_note_date_cdunr = models.DateField()
    original_invoice_number_cdunr = models.CharField(max_length=50)
    original_invoice_date_cdunr = models.DateField()
    note_type_cdunr = models.CharField(max_length=50)
    note_value_cdunr = models.DecimalField(max_digits=10, decimal_places=2)
    supply_type_cdunr = models.CharField(max_length=50)

    # Nil Rated Invoices (7)
    description_nil_rated = models.CharField(max_length=255)
    composition_taxable_person_nil_rated = models.BooleanField()
    nil_rated_supplies_nil_rated = models.DecimalField(max_digits=10, decimal_places=2)
    exempted_supplies_nil_rated = models.DecimalField(max_digits=10, decimal_places=2)
    non_gst_supplies_nil_rated = models.DecimalField(max_digits=10, decimal_places=2)

    # Summary for HSN (12)
    hsn_code_hsn = models.CharField(max_length=12)
    description_hsn = models.CharField(max_length=255)
    uqc_hsn = models.CharField(max_length=10)
    total_quantity_hsn = models.DecimalField(max_digits=10, decimal_places=2)
    total_taxable_value_hsn = models.DecimalField(max_digits=10, decimal_places=2)
    rate_percentage_hsn = models.DecimalField(max_digits=5, decimal_places=2)
    integrated_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2)
    central_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2)
    state_ut_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2)
    cess_tax_hsn = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"GSTR2 {self.gstin_uin_supplier_b2b} - {self.supplier_name_b2b}"


class EWayBill(models.Model):
    eway_bill_no = models.CharField(max_length=100)
    date = models.DateField()
    dispatch_from = models.CharField(max_length=255)
    ship_to = models.CharField(max_length=255)
    transporter_name = models.CharField(max_length=255, null=True, blank=True)
    new_transport_for_shipment = models.CharField(max_length=255, null=True, blank=True, default=None)
    transport_id = models.CharField(max_length=100)
    mode = models.CharField(max_length=50)
    doc_lading_rr_airway_no = models.CharField(max_length=255)
    vehicle_number = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=100)
    date_of_transport = models.DateField()

    def __str__(self):
        return self.eway_bill_no

class EInvoice(models.Model):
    ack_no = models.CharField(max_length=100)
    ack_date = models.DateField()
    irn = models.CharField(max_length=100)
    # Place of Party
    bill_to_place = models.CharField(max_length=255)
    ship_to_place = models.CharField(max_length=255)

    def __str__(self):
        return self.ack_no

class Customer(models.Model):
    # employee_id = models.CharField(primary_key=True, max_length=24,editable=False)
    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=20)
    date_joined = models.DateField(auto_now_add=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.TextField(max_length=100) 



class ProductDetails(models.Model):
    customer_id = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='product_details', null=True)
    product_name = models.CharField(max_length=255)
    category_name = models.CharField(max_length=255,default=None) 
    sub_category_name = models.CharField(max_length=255,default=None) 
    brand_name = models.CharField(max_length=255,default=None)   
    unit =   models.CharField(max_length=255,default=None) 
    product_code = models.CharField(max_length=100, unique=True)  
    bar_qr_code = models.CharField(max_length=255, blank=True, null=True) 
    description = models.TextField(blank=True, null=True)  
    image_url = models.URLField(max_length=255, null=True, blank=True)     


    def __str__(self):
        return self.product_name

class Category(models.Model):
    category_name = models.CharField(max_length=255, unique=True)
    cgst = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) 
    sgst = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  
    igst = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)  

    def __str__(self):
        return self.category_name


class SubCategory(models.Model):
    category_id = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    category_name= models.CharField(max_length=255,default=None)
    subcategory_name = models.CharField(max_length=255)
    hsn_sac_code = models.IntegerField() # removed

    def __str__(self):
        return self.subcategory_name


class Brand(models.Model):
    brand_name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.brand_name


class Unit(models.Model):
    unit = models.CharField(max_length=50, unique=True) 
    full_name = models.CharField(max_length=255)  
    allow_decimal = models.BooleanField(default=False)  

    def __str__(self):
        return self.unit

class PriceDetails(models.Model): 
    product = models.ForeignKey(ProductDetails, on_delete=models.CASCADE)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    min_sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=5, decimal_places=2)
    hsn_sac_code = models.CharField(max_length=100)  


    def __str__(self):
        return f"{self.purchase_price}"


class GSTDetails(models.Model):
    product = models.ForeignKey(ProductDetails, on_delete=models.CASCADE, related_name='gst_details')
    cgst_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    sgst_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    igst_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    cgst_value = models.DecimalField(max_digits=10, decimal_places=2)
    sgst_value = models.DecimalField(max_digits=10, decimal_places=2)
    igst_value = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} - GST Details"


class StockDetails(models.Model):
    product = models.ForeignKey(ProductDetails, on_delete=models.CASCADE, related_name='stock_details')
    opening_stock = models.PositiveIntegerField()
    opening_stock_value = models.DecimalField(max_digits=10, decimal_places=2)
    low_stock_qty = models.PositiveIntegerField()
    date = models.DateField(default=date.today)
    location = models.CharField(max_length=255)

    def __str__(self):
        return f"Stock Details for {self.product.product_name}"

class Admin(models.Model):
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)  # Store hashed passwords (e.g., bcrypt)
    full_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    hardware_signature = models.CharField(max_length=512, unique=True) 

class SubscriptionPlan(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='subscription_details')
    plan_name = models.CharField(max_length=50)
    duration_days = models.IntegerField() 
    created_at = models.DateTimeField(null=True) 
    expiry_date = models.DateTimeField(null=True) 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Subscription Details for {self.plan_name}"
    

class License(models.Model):
    admin = models.ForeignKey(Admin, on_delete=models.CASCADE, related_name='license_details')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE, related_name='license_details')
    license_key = models.CharField(
        max_length=255,
        unique=True,
        validators=[
            RegexValidator(
                regex='^[A-NP-Za-np-z0-9]+$',
                message="The license key cannot contain the characters '0' or 'o'."
            )
        ]
    )
    expiry_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)  
    hardware_signature = models.CharField(max_length=512) 
    created_at = models.DateTimeField(auto_now_add=True) 
    last_validated = models.DateTimeField(null=True, blank=True) 

    def __str__(self):
        return f"License {self.license_key} for {self.admin.email}"



class Payment(models.Model):
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE, related_name='payment_details')
    plan = models.ForeignKey('SubscriptionPlan', on_delete=models.CASCADE, related_name='payment_details')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    payment_gateway = models.CharField(max_length=50) 
    transaction_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id}"

class Notification(models.Model):
    admin = models.ForeignKey('Admin', on_delete=models.CASCADE, related_name='notification_details')
    type = models.CharField(max_length=50) 
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True) 

    def str(self):
        return f"Notification for {self.admin.email}"


class SupplierList(models.Model):
    supplier_name = models.CharField(max_length=50,null=True, blank=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    address = models.TextField(max_length=255)
    area = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    state = models.CharField(max_length=100)
    opening_balance = models.DecimalField(max_digits=10,decimal_places=2)
    gst_number = models.CharField(max_length=15 , unique=True)

    def str(self):
        return self.suppiler_name     
    
class CustomerList(models.Model):
    customer_name = models.CharField(max_length=50, null=True , blank = True)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)
    address = models.TextField(max_length=255)
    area = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=10)
    state = models.CharField(max_length=100)
    opening_balance = models.DecimalField(max_digits=10, decimal_places=2)
    gst_number = models.CharField(max_length=15 , unique=True)

    def str(self):
        return self.customer_name





class UserModel(models.Model):
    user_name = models.CharField(max_length=100,null=True)
    email = models.EmailField(unique=True ,null=True)
    access_key = models.CharField(max_length=255, blank=True, null=True)













































































































































































































































































































































































































