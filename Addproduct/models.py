from django.db import models

# Table 1: Product Details
class Product(models.Model):
    group = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    product_name = models.CharField(max_length=255)
    product_code = models.CharField(max_length=100)

    def __str__(self):
        return self.product_name

# Table 2: Price Details
class PriceDetails(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='price_details')
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    min_sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Price details for {self.product.product_name}"

# Table 3: Stock and Unit Details
class StockAndUnitDetails(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='stock_and_unit_details')
    unit = models.CharField(max_length=100)
    opening_stock = models.IntegerField()
    opening_stock_value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Stock details for {self.product.product_name}"

# # Table 4: GST Details
# class GSTDetails(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='gst_details')
#     hsn_sac_code = models.CharField(max_length=100)
#     cess_percentage = models.DecimalField(max_digits=5, decimal_places=2)
#     cgst_percentage = models.DecimalField(max_digits=5, decimal_places=2)
#     sgst_percentage = models.DecimalField(max_digits=5, decimal_places=2)
#     igst_percentage = models.DecimalField(max_digits=5, decimal_places=2)

#     def __str__(self):
#         return f"GST details for {self.product.product_name}"

# Table 5: Other Details
class OtherDetails(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='other_details')
    sale_discount_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    low_level_limit = models.IntegerField()
    select_general = models.CharField(max_length=255)
    serial_no = models.CharField(max_length=100)

    def __str__(self):
        return f"Other details for {self.product.product_name}"

# # Table 6: Product Description
# class ProductDescription(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_description')
#     description = models.TextField()

#     def __str__(self):
#         return f"Description for {self.product.product_name}"

# Table 7: Product Settings
# class ProductSettings(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_settings')
#     print_description = models.BooleanField(default=False)
#     one_click_sale = models.BooleanField(default=False)
#     enable_tracking = models.BooleanField(default=False)
#     print_serial_no = models.BooleanField(default=False)
#     not_for_sale = models.BooleanField(default=False)

#     def __str__(self):
#         return f"Settings for {self.product.product_name}"
