from django.db import models
from bson import ObjectId

class AddGst(models.Model):
    YES_NO_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
    ]
    AddGst_Id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    state = models.CharField(max_length=50)
    register_type = models.CharField(max_length=50)
    assessee_of_authority_tertiary = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    gst_in_un = models.CharField(max_length=15, unique=True) 
    periodicity_of_gstr1 = models.CharField(max_length=50)
    gst_user_name = models.DateField()
    mode_filing = models.DateField()
    e_invoicing_applicable = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    applicable_from = models.DateField(null=True, blank=True)
    invoice_bill_from_place = models.CharField(max_length=50, null=True, blank=True)
    e_way_bill_applicable =models.CharField(max_length=3,choices=YES_NO_CHOICES)
    applicable_for_interest = models.CharField(max_length=3, choices=YES_NO_CHOICES)
    another_GST_company = models.CharField(max_length=3,choices=YES_NO_CHOICES)

class StockGroup(models.Model):
    StockGroup_Id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    name = models.CharField(max_length=255)  # Name of the stock group
    under = models.CharField(max_length=255, default="Primary")  # Defaults to "Primary"
    quantities_added = models.BooleanField(default=False)  # Yes/No
    gst_details = models.TextField(blank=True, null=True)  # GST details as a string or JSON

    def __str__(self):
        return self.name

class StockCategory(models.Model):
    Category_Id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    StockGroup_Id = models.CharField(max_length=24) 
    name = models.CharField(max_length=255)
    alias = models.CharField(max_length=255, blank=True, null=True)
    under = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.name

class StockItem(models.Model):
    StockItem_Id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
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
    Unit_Id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    type = models.CharField(max_length=255)
    symbol = models.CharField(max_length=50)
    formal_name = models.CharField(max_length=255)
    unit_quantity_code = models.IntegerField()
    number_of_decimal_places = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

class StockGroupTaxDetails(models.Model):
    TaxDetails_id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    taxability = models.CharField(max_length=20, null=True, blank=True)
    applicable_from = models.DateField(null=True, blank=True)
    tax_type = models.CharField(max_length=255, null=True, blank=True)
    integrated_tax = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, default=None)
    cess = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, default=None)
    def __str__(self):
        return f"{self.tax_type or 'No Tax Type'} - {self.taxability or 'No Taxability'}"

class ProductDetails(models.Model):
    product_Id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    group = models.CharField(max_length=100) 
    brand = models.CharField(max_length=100)
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=50, unique=True) 
    def __str__(self):
        return f"{self.product_name} - {self.brand}"

class OtherDetails(models.Model):
    OtherDetails_id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    product_id = models.CharField(max_length=24)
    sale_discount_percent = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Sale Discount %")
    low_level_limit = models.IntegerField(verbose_name="Low Level Limit")
    select_general = models.CharField(max_length=255, verbose_name="Select General")
    serial_no = models.CharField(max_length=100,  unique=True, verbose_name="Serial No")

    def __str__(self):
        return f"Serial No: {self.serial_no}, Sale Discount: {self.sale_discount_percent}%"

class ProductSettings(models.Model):
    setting_id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    product_id = models.CharField(max_length=24)
    print_description = models.BooleanField(default=False, verbose_name="Print Description")
    one_click_sale = models.BooleanField(default=False, verbose_name="One Click Sale")
    enable_tracking = models.BooleanField(default=False, verbose_name="Enable Tracking")
    print_serial_no = models.BooleanField(default=False, verbose_name="Print Serial No.")
    not_for_sale = models.BooleanField(default=False, verbose_name="Not for Sale")

    def __str__(self):
        return f"Product Settings - Print Description: {self.print_description}, One Click Sale: {self.one_click_sale}"

class ProductDescription(models.Model):
    Description_id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
    product_id = models.CharField(max_length=24, unique=True, verbose_name="Product ID")
    description = models.TextField(verbose_name="Description")

    def __str__(self):
        return f"Product ID: {self.product_id}, Description: {self.description[:50]}" 
class GSTR1 (models.Model):
    GSTR1_id = models.CharField(primary_key=True, max_length=24, default=lambda: str(ObjectId()), editable=False)
# class GstInvoice(models.Model):
    gstin_uin_recipient = models.CharField(max_length=15, verbose_name="GSTIN/UIN of Recipient")  
    receiver_name = models.CharField(max_length=255, verbose_name="Receiver Name")  # Name of the Receiver
    invoice_number = models.CharField(max_length=50, verbose_name="Invoice Number")  # Unique Invoice Identifier
    invoice_date = models.DateField( verbose_name="Invoice Date")  # Date of the Invoice
    place_of_supply = models.CharField(max_length=100, verbose_name="Place of Supply")  # Location where the supply is made
    invoice_value = models.DecimalField( max_digits=15,  decimal_places=2,  verbose_name="Invoice Value")  # Total Invoice Value including taxes
    supply_type = models.CharField( max_length=50,  verbose_name="Supply Type")  # Type of Supply (e.g., B2B, B2C)
# class SupplyInvoice(models.Model):
    place_of_supply = models.CharField(max_length=100, verbose_name="Place of Supply")  # Location where the supply is made
    invoice_number = models.CharField( max_length=50, unique=True,  verbose_name="Invoice Number")  # Unique identifier for the invoice
    invoice_date = models.DateField(verbose_name="Invoice Date")  # Date when the invoice was issued
    supply_type = models.CharField(max_length=50, verbose_name="Supply Type")  # Type of supply (e.g., Interstate, Intrastate)
    invoice_value = models.DecimalField( max_digits=15, decimal_places=2, verbose_name="Invoice Value")  # Total value of the invoice, including applicable taxes
