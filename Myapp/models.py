from django.db import models
from bson import ObjectId

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
    gst_in_un = models.CharField(max_length=15, unique=True)  # Ensure this field is unique
    periodicity_of_gstr1 = models.CharField(max_length=50)
    gst_user_name = models.DateField()
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
    # gst_details = models.TextField(blank=True, null=True)  

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

class StockItem(models.Model):
    StockItem_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    Category_Id = models.CharField(max_length=24)
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, blank=True, null=True)
    under = models.CharField(max_length=255)
    units = models.CharField(max_length=255)
    # Statutory Information
    gst_applicability = models.BooleanField(default=False)
    set_alter_gst_details = models.BooleanField(default=False)
    type_of_supply = models.CharField(max_length=255)
    rate_of_duty = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    # Opening Balance
    quantity = models.CharField(max_length=255)
    rate_per = models.CharField(max_length=255)
    value = models.IntegerField()
    
class UnitCreation(models.Model):
    Unit_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    sno= models.IntegerField(primary_key=False)
    unit = models.CharField(max_length=255)
    fullname = models.CharField(max_length=50)
    allow_decimal = models.BooleanField(max_length=255)
    # unit_quantity_code = models.IntegerField()
    # number_of_decimal_places = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

class brand(models.Model):
    brand_id= models.CharField(primary_key=True, max_length=24,default=generate_add_gst_id,editable=False)
    sno= models.IntegerField(primary_key=False)
    brand_name = models.CharField(max_length=100)
    
class StockDetails(models.Model):
    StockDetails_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
    opening_stock = models.IntegerField( null=True, blank=True)
    opening_stock_values = models.IntegerField(null=True, blank=True, default=None)
    low_stock_qty = models.IntegerField( null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True, default=None)
    # def __str__(self):
    #     return f"{self.tax_type or 'No Tax Type'} - {self.taxability or 'No Taxability'}"

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
    img=models.ImageField()
    def __str__(self):
        return f"{self.product_name} - {self.brand}"

class PriceDetails(models.Model):
    product_Id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
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

class GSTR1 (models.Model):
    GSTR1_id = models.CharField(primary_key=True, max_length=24, default=generate_add_gst_id, editable=False)
# 1:
    gstin_uin_recipient = models.CharField(max_length=15, verbose_name="GSTIN/UIN of Recipient")  
    receiver_name = models.CharField(max_length=255, verbose_name="Receiver Name")  # Name of the Receiver
    invoice_number = models.CharField(max_length=50, verbose_name="Invoice Number")  # Unique Invoice Identifier
    invoice_date = models.DateField( verbose_name="Invoice Date")  # Date of the Invoice
    place_of_supply = models.CharField(max_length=100, verbose_name="Place of Supply")  # Location where the supply is made
    invoice_value = models.DecimalField( max_digits=15,  decimal_places=2,  verbose_name="Invoice Value")  # Total Invoice Value including taxes
    supply_type = models.CharField( max_length=50,  verbose_name="Supply Type")  # Type of Supply (e.g., B2B, B2C)
# 2:
    place_of_supply = models.CharField(max_length=100, verbose_name="Place of Supply")  # Location where the supply is made
    invoice_number = models.CharField( max_length=50, unique=True,  verbose_name="Invoice Number")  # Unique identifier for the invoice
    invoice_date = models.DateField(verbose_name="Invoice Date")  # Date when the invoice was issued
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")  # Type of supply (e.g., Interstate, Intrastate)
    invoice_value = models.DecimalField( max_digits=15, decimal_places=2, verbose_name="Invoice Value")  # Total value of the invoice, including applicable taxes
# 3:
    taxable_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Taxable Value")  # Total taxable amount for the supply
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")  # Type of supply (e.g., Interstate, Intrastate)
    rate = models.DecimalField(max_digits=5,  decimal_places=2, verbose_name="Rate (%)")  # GST rate in percentage
    integrated_tax = models.DecimalField(max_digits=15, decimal_places=2, default=0.00, verbose_name="Integrated Tax (₹)")  # Integrated GST amount
    central_tax = models.DecimalField( max_digits=15,  decimal_places=2, default=0.00,  verbose_name="Central Tax (₹)")  # Central GST amount
    state_ut_tax = models.DecimalField( max_digits=15,  decimal_places=2, default=0.00, verbose_name="State/UT Tax (₹)")  # State/UT GST amount
    cess = models.DecimalField( max_digits=15,  decimal_places=2,  default=0.00,   verbose_name="CESS (₹)")  # Additional cess amount, if any
# 4:
    gstin_uin_recipient = models.CharField(max_length=15, verbose_name="GSTIN/UIN of Recipient")  # GST Identification Number of the recipient
    receiver_name = models.CharField( max_length=255,  verbose_name="Receiver Name")  # Name of the recipient
    note_number = models.CharField(max_length=50, unique=True, verbose_name="Debit/Credit Note Number")  # Unique identifier for the debit/credit note
    note_date = models.DateField( verbose_name="Debit/Credit Note Date")  # Date of the debit/credit note
    original_invoice_number = models.CharField(max_length=50, verbose_name="Original Invoice Number")  # Invoice number being referenced
    original_invoice_date = models.DateField( verbose_name="Original Invoice Date")  # Date of the referenced invoice
    note_type = models.CharField( max_length=20,  choices=[('Debit', 'Debit'), ('Credit', 'Credit')],  verbose_name="Note Type")  # Type of note: Debit or Credit
    note_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Note Value")  # Value of the debit/credit note
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")  # Type of supply (e.g., Interstate, Intrastate)
# 5:
    type = models.CharField(max_length=50, verbose_name="Type")  # Type of document (e.g., Financial, Adjustment, etc.)
    note_number = models.CharField(max_length=50, unique=True, verbose_name="Debit/Credit Note Number")  # Unique identifier for the debit/credit note
    note_date = models.DateField(verbose_name="Debit/Credit Note Date")  # Date of the debit/credit note
    original_invoice_number = models.CharField(max_length=50, verbose_name="Original Invoice Number")  # Invoice number being referenced
    original_invoice_date = models.DateField(verbose_name="Original Invoice Date")  # Date of the referenced invoice
    note_type = models.CharField(max_length=20, choices=[('Debit', 'Debit'), ('Credit', 'Credit')], verbose_name="Note Type")  # Specifies whether it's a debit or credit note
    note_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Note Value")  # Monetary value of the debit/credit note
    supply_type = models.CharField( max_length=50, verbose_name="Supply Type")  # Type of supply (e.g., Interstate, Intrastate)
# 6:
    invoice_number = models.CharField(max_length=50, unique=True, verbose_name="Invoice Number")  # Unique identifier for the invoice
    invoice_date = models.DateField( verbose_name="Invoice Date")  # Date of invoice issuance
    port_code = models.CharField(max_length=10, verbose_name="Port Code")  # Code of the port where export is processed
    shipping_bill_number = models.CharField(max_length=50, verbose_name="Shipping Bill/Export No")  # Shipping bill or export document number
    shipping_bill_date = models.DateField(verbose_name="Shipping Bill/Export Date")  # Date of the shipping/export document
    total_invoice_value = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Total Invoice Value")  # Total value of the invoice, including taxes
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")  # Type of supply (e.g., Export under bond, Export with payment of IGST)
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





