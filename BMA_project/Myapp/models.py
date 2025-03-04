from django.db import models
from bson import ObjectId
from bson import ObjectId
from django.utils import timezone
from django.core.validators import RegexValidator

def generate_add_gst_id():
    return str(ObjectId())

class AddGst(models.Model):
    YES_NO_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]
    AddGst_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    state = models.CharField(max_length=50)
    register_type = models.CharField(max_length=50)
    assessee_of_authority_tertiary = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    gst_in_un = models.CharField(max_length=15, unique=True) 
    periodicity_of_gstr1 = models.CharField(max_length=50)
    gst_user_name = models.CharField(max_length=255)
    mode_filing = models.DateField()
    e_invoicing_applicable = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    applicable_from = models.DateField(null=True, blank=True)
    invoice_bill_from_place = models.CharField(max_length=50, null=True, blank=True)
    e_way_bill_applicable = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    applicable_for_interest = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    another_GST_company = models.CharField(max_length=3, choices=YES_NO_CHOICES)

    def __str__(self):
        return self.AddGst_Id

class StockCategory(models.Model):
    StockCategory_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    sno = models.IntegerField()    
    name = models.CharField(max_length=255) 
    igst = models.CharField(max_length=255) 
    cgst = models.CharField(max_length=255,default=False)  
    sgst = models.CharField(max_length=255,default=False)  
    def __str__(self):
        return self.name

class StocksubCategory(models.Model):
    subCategory_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    StockCategory_id = models.CharField(max_length=24) 
    sno= models.IntegerField(primary_key=False)
    subCategoryname = models.CharField(max_length=100)
    Categoryname = models.CharField(max_length=30)
    hsn_sac_code= models.IntegerField(null=True)
    def __str__(self):
        return self.subCategoryname

    
class UnitCreation(models.Model):
    Unit_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    sno= models.IntegerField(primary_key=False)
    unit = models.CharField(max_length=255)
    fullname = models.CharField(max_length=50)
    allow_decimal = models.BooleanField(max_length=255)

class brand(models.Model):
    brand_id= models.CharField(primary_key=True, max_length=24,default=generate_add_gst_id,editable=False)
    sno= models.IntegerField(primary_key=False)
    brand_name = models.CharField(max_length=100)
    
class StockDetails(models.Model):
    StockDetails_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    product_Id = models.CharField(max_length=24)
    opening_stock = models.IntegerField( null=True, blank=True)
    opening_stock_values = models.IntegerField(null=True, blank=True, default=None)
    low_stock_qty = models.IntegerField( null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True, default=None)

class ProductDetails(models.Model):
    product_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    Customer_Id = models.CharField(max_length=24)
    product_name = models.CharField(max_length=255)
    category = models.CharField(max_length=100) 
    subcategory = models.CharField(max_length=100) 
    brand = models.CharField(max_length=100)
    unit = models.CharField(max_length=100)
    bar_oq_code = models.CharField(max_length=100)
    product_code = models.CharField(max_length=50, unique=True) 
    description = models.TextField(verbose_name="Description") 
    img = models.URLField()
    def __str__(self):
        return f"{self.product_name} - {self.brand}"
    
class PriceDetails(models.Model):
    PriceDetails_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    product_Id = models.CharField(max_length=24)    
    PurchasePrice = models.IntegerField(null=True) 
    SalePrice = models.IntegerField(null=True)
    Min_Sale_Price = models.IntegerField(null=True)
    MRP = models.IntegerField(unique=True,null=True) 
    hsn_sac_code = models.IntegerField( unique=True,null=True) 
    discount = models.IntegerField( unique=True,null=True) 

    def __str__(self):
        return f"{self.product_name} - {self.brand}"
    
class PriceGstDetails(models.Model):
    Gstdetails_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    product_Id = models.CharField(max_length=24)
    igst = models.IntegerField( unique=True,null=True) 
    igstprice = models.IntegerField( unique=True,null=True) 
    cgst = models.IntegerField( unique=True,null=True) 
    cgstprice = models.IntegerField( unique=True,null=True) 
    sgst = models.IntegerField( unique=True,null=True) 
    sgstprice = models.IntegerField( unique=True,null=True) 
    cess = models.IntegerField( unique=True,null=True) 
    cessprice = models.IntegerField( unique=True,null=True) 
    totalamount = models.IntegerField( unique=True,null=True) 
    
class OtherDetails(models.Model):
    OtherDetails_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    product_id = models.CharField(max_length=24)
    sale_discount_percent = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Sale Discount %")
    low_level_limit = models.IntegerField(verbose_name="Low Level Limit")
    select_general = models.CharField(max_length=255, verbose_name="Select General")
    serial_no = models.CharField(max_length=100,unique=True, verbose_name="Serial No")
 
    def __str__(self):
        return f"Serial No: {self.serial_no}, Sale Discount: {self.sale_discount_percent}%"

class ProductSettings(models.Model):
    setting_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    product_id = models.CharField(max_length=24)
    print_description = models.BooleanField(default=False, verbose_name="Print Description")
    one_click_sale = models.BooleanField(default=False, verbose_name="One Click Sale")
    enable_tracking = models.BooleanField(default=False, verbose_name="Enable Tracking")
    print_serial_no = models.BooleanField(default=False, verbose_name="Print Serial No.")
    not_for_sale = models.BooleanField(default=False, verbose_name="Not for Sale")

    def __str__(self):
        return f"Product Settings - Print Description: {self.print_description}, One Click Sale: {self.one_click_sale}"

class EInvoiceDetails(models.Model):
    sale_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    ack_no = models.CharField(max_length=255, blank=True, null=True) 
    ack_date = models.DateField(blank=True, null=True) 
    irn = models.CharField(max_length=255, blank=True, null=True)  
    bill_to_place = models.CharField(max_length=255, blank=True, null=True) 
    ship_to_place = models.CharField(max_length=255, blank=True, null=True) 

class EWayBill(models.Model):
    sale_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    eway_bill_no = models.CharField(max_length=100)
    date = models.DateField(null=True, blank=True)
    dispatch_from = models.CharField(max_length=255, null=True, blank=True)
    ship_to = models.CharField(max_length=255, null=True, blank=True)
    transporter_name = models.CharField(max_length=255, null=True, blank=True)
    transport_id = models.CharField(max_length=255, null=True, blank=True)
    mode = models.CharField(max_length=50, null=True, blank=True)
    doc_or_airway_no = models.CharField(max_length=100, null=True, blank=True)
    vehicle_number = models.CharField(max_length=50, null=True, blank=True)
    vehicle_date = models.DateField(null=True, blank=True)
    vehicle_type = models.CharField(max_length=50, null=True, blank=True)

class Employee(models.Model):
    employee_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    name = models.CharField(max_length=50)
    gender = models.CharField(max_length=10, )
    date_of_birth = models.DateField()
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=10, unique=True)
    role = models.CharField(max_length=20)
    date_joined = models.DateField(auto_now_add=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.TextField()

class Admin(models.Model):
    admin_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255) 
    full_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    hardware_signature = models.CharField(max_length=512, unique=True) 

    def _str_(self):
        return self.email

class SubscriptionPlan(models.Model):
    plan_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    admin_id =  models.CharField(max_length=24)
    plan_name = models.CharField(max_length=50)
    duration_days = models.IntegerField() 
    starting_days = models.DateTimeField() 
    ending_days = models.DateTimeField( null=True) 
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)    
    def _str_(self):
        return self.plan_name

class License(models.Model):
    license_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    admin_id =  models.CharField(max_length=24)
    plan_id =  models.CharField(max_length=24)
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
    expiry_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    hardware_signature = models.CharField(max_length=512) 
    created_at = models.DateTimeField(auto_now_add=True)
    last_validated = models.DateTimeField(null=True, blank=True)

    def _str_(self):
        return f"License {self.license_key} for {self.user.email}"

class Payment(models.Model):
    payment_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    admin_id =  models.CharField(max_length=24)
    plan_id =  models.CharField(max_length=24)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    payment_gateway = models.CharField(max_length=50) 
    transaction_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=50)  
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Payment {self.transaction_id} by {self.user.email}"

class Notification(models.Model):
    notification_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    admin_id =  models.CharField(max_length=24)
    type = models.CharField(max_length=50) 
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def _str_(self):
        return f"Notification for {self.user.email}"

class Customer(models.Model):
    Customer_id = models.CharField(primary_key= True, max_length=24, default=generate_add_gst_id)
    User_id = models.CharField(max_length=24)
    customer_name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    area = models.CharField(max_length=15, blank=True, null=True)
    pincode = models.CharField(max_length=15, blank=True, null=True)
    state = models.CharField(max_length=15, blank=True, null=True)
    opening_balance = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    balance_amount = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    gst_number = models.CharField(max_length=15, blank=True, null=True)
    def __str__(self):
        return self.customer_name

class Supplier(models.Model):
    supplier_id = models.CharField(primary_key= True, max_length=24, default=generate_add_gst_id)
    User_id = models.CharField(max_length=24)
    supplier_name = models.CharField(max_length=255) 
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    area = models.CharField(max_length=100, blank=True, null=True) 
    pincode = models.CharField(max_length=10, blank=True, null=True) 
    state = models.CharField(max_length=50, blank=True, null=True) 
    opening_balance = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True) 
    balance_amount = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    gst_number = models.CharField(max_length=20, blank=True, null=True) 

    def __str__(self):
        return self.supplier_name

class accesskey(models.Model):
    access_id =  models.CharField(primary_key= True, max_length=24, default=generate_add_gst_id)
    access_key = models.CharField(max_length=24, unique=True, default=generate_add_gst_id)  
    name = models.CharField(max_length=100, null=True)
    email_id = models.EmailField(max_length=100)
    permissin = models.CharField(max_length=100, null=True)

class Sale(models.Model):
    WITH_TAX = 'With Tax'
    WITHOUT_TAX = 'Without Tax'
    SALE_TYPE_CHOICES = [
        (WITH_TAX, 'With Tax'),
        (WITHOUT_TAX, 'Without Tax'),
    ]

    # Customer details
    sale_id=  models.CharField(primary_key= True, max_length=24, default=generate_add_gst_id)
    customer_id = models.CharField(max_length=255)
    customer_name = models.CharField(max_length=255)
    mobile_no = models.CharField(max_length=15)
    gst_no = models.CharField(max_length=255, blank=True, null=True)

    # Invoice details
    invoice_no = models.CharField(max_length=50, unique=True)
    invoice_date = models.DateField()
    due_date = models.DateField()
    sale_type = models.CharField(max_length=20, choices=SALE_TYPE_CHOICES, default=WITH_TAX)

    # Product details (Stored as JSON)
    products = models.JSONField()  # Stores product details in JSON format

    # Amount details
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    received_amount = models.DecimalField(max_digits=10, decimal_places=2)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2)

    # Tax details
    total_before_tax = models.DecimalField(max_digits=10, decimal_places=2)
    cgst = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    sgst = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=10, decimal_places=2)

    # Payment details
    payment_type = models.CharField(max_length=50, choices=[('Cash', 'Cash'), ('Card', 'Card'), ('UPI', 'UPI')])
    payment_status = models.CharField(max_length=50, choices=[('Paid', 'Paid'), ('Pending', 'Pending')])

    # Address & Notes
    billing_address = models.TextField()
    shipping_address = models.TextField()
    sale_notes = models.TextField(blank=True, null=True)
    require_invoice = models.BooleanField(default=False)

    def __str__(self):
        return f"Invoice {self.invoice_no} - {self.customer_name}"
    
class GSTR1 (models.Model):
    GSTR1_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
# 1:
    gstin_uin_recipient = models.CharField(max_length=15, verbose_name="GSTIN/UIN of Recipient")  
    receiver_name = models.CharField(max_length=255, verbose_name="Receiver Name") 
    invoice_number = models.CharField(max_length=50, verbose_name="Invoice Number") 
    invoice_date = models.DateField( verbose_name="Invoice Date")  
    place_of_supply = models.CharField(max_length=100, verbose_name="Place of Supply") 
    invoice_value = models.DecimalField( max_digits=15,  decimal_places=2,  verbose_name="Invoice Value") 
    supply_type = models.CharField( max_length=50,  verbose_name="Supply Type") 
# 2:
    place_of_supply = models.CharField(max_length=100, verbose_name="Place of Supply") 
    invoice_number = models.CharField( max_length=50, unique=True,  verbose_name="Invoice Number") 
    invoice_date = models.DateField(verbose_name="Invoice Date") 
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")
    invoice_value = models.DecimalField( max_digits=15, decimal_places=2, verbose_name="Invoice Value")  
# 3:
    taxable_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Taxable Value")  
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")  
    rate = models.DecimalField(max_digits=5,  decimal_places=2, verbose_name="Rate (%)") 
    integrated_tax = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="Integrated Tax (₹)") 
    central_tax = models.DecimalField( max_digits=15,  decimal_places=2, default=0.00,  verbose_name="Central Tax (₹)") 
    state_ut_tax = models.DecimalField( max_digits=15,  decimal_places=2, default=0.00, verbose_name="State/UT Tax (₹)") 
    cess = models.DecimalField( max_digits=15,  decimal_places=2,  default=0.00,   verbose_name="CESS (₹)")  
# 4:
    gstin_uin_recipient = models.CharField(max_length=15, verbose_name="GSTIN/UIN of Recipient")  
    receiver_name = models.CharField( max_length=255,  verbose_name="Receiver Name") 
    note_number = models.CharField(max_length=50, unique=True, verbose_name="Debit/Credit Note Number") 
    note_date = models.DateField( verbose_name="Debit/Credit Note Date") 
    original_invoice_number = models.CharField(max_length=50, verbose_name="Original Invoice Number") 
    original_invoice_date = models.DateField( verbose_name="Original Invoice Date")
    note_type = models.CharField( max_length=20,  choices=[('Debit', 'Debit'), ('Credit', 'Credit')],  verbose_name="Note Type")
    note_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Note Value") 
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type") 
# 5:
    type = models.CharField(max_length=50, verbose_name="Type") 
    note_number = models.CharField(max_length=50, unique=True, verbose_name="Debit/Credit Note Number") 
    note_date = models.DateField(verbose_name="Debit/Credit Note Date") 
    original_invoice_number = models.CharField(max_length=50, verbose_name="Original Invoice Number")  
    original_invoice_date = models.DateField(verbose_name="Original Invoice Date") 
    note_type = models.CharField(max_length=20, choices=[('Debit', 'Debit'), ('Credit', 'Credit')], verbose_name="Note Type")
    note_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Note Value") 
    supply_type = models.CharField( max_length=50, verbose_name="Supply Type")
# 6:
    invoice_number = models.CharField(max_length=50, unique=True, verbose_name="Invoice Number")  
    invoice_date = models.DateField( verbose_name="Invoice Date")  
    port_code = models.CharField(max_length=10, verbose_name="Port Code") 
    shipping_bill_number = models.CharField(max_length=50, verbose_name="Shipping Bill/Export No")  
    shipping_bill_date = models.DateField(verbose_name="Shipping Bill/Export Date") 
    total_invoice_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Total Invoice Value")
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type") 
    gst_payment = models.CharField(max_length=20, choices=[('With Payment', 'With Payment'),('Without Payment', 'Without Payment')], verbose_name="GST Payment")
# 7:
    description = models.CharField(max_length=255, verbose_name="Description")  
    nil_rated_supplies = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="Nil Rated Supplies (₹)") 
    exempted_supplies = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="Exempted Supplies (₹)") 
    non_gst_supplies = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="Non-GST Supplies (₹)")
# 8:
    hsn_code = models.CharField(max_length=10, verbose_name="HSN Code") 
    description = models.CharField(max_length=255, verbose_name="Description") 
    uqc = models.CharField(max_length=20, verbose_name="UQC (Unit Quantity Code)")  
    total_quantity = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Total Quantity")  
    total_taxable_value = models.DecimalField( max_digits=15, decimal_places=2, verbose_name="Total Taxable Value (₹)")  
    rate = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Rate (%)") 
    integrated_tax = models.DecimalField( max_digits=15,  decimal_places=2, default=0.00, verbose_name="Integrated Tax (₹)") 
    central_tax = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="Central Tax (₹)") 
    state_ut_tax = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="State/UT Tax (₹)") 
    cess_tax = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="CESS Tax (₹)") 
# 9:
    nature_of_document = models.CharField(max_length=100, verbose_name="Nature of Document") 
    sr_no_from = models.IntegerField(verbose_name="Sr. No. From")  
    sr_no_to = models.IntegerField(verbose_name="Sr. No. To") 
    total_number = models.IntegerField(verbose_name="Total Number")  
    cancelled = models.IntegerField(default=0, verbose_name="Cancelled") 
    net_issue = models.IntegerField(verbose_name="Net Issue") 
