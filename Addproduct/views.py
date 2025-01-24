# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# import json
# from .models import Product

# @csrf_exempt  
# def add_product(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)

#             product = Product(
#                 group=data.get('group'),
#                 brand=data.get('brand'),
#                 product_name=data.get('product_name'),
#                 product_code=data.get('product_code'),
#                 purchase_price=data.get('purchase_price'),
#                 sale_price=data.get('sale_price'),
#                 min_sale_price=data.get('min_sale_price'),
#                 mrp=data.get('mrp'),
#                 unit=data.get('unit'),
#                 opening_stock=data.get('opening_stock'),
#                 opening_stock_value=data.get('opening_stock_value'),
#                 hsn_sac_code=data.get('hsn_sac_code'),
#                 cess_percent=data.get('cess_percent'),
#                 cgst_percent=data.get('cgst_percent'),
#                 sgst_percent=data.get('sgst_percent'),
#                 igst_percent=data.get('igst_percent'),
#                 sale_discount_percent=data.get('sale_discount_percent'),
#                 low_level_limit=data.get('low_level_limit'),
#                 general_option=data.get('general_option'),
#                 serial_no=data.get('serial_no'),
#                 description=data.get('description'),
#                 print_description=data.get('print_description', False),
#                 one_click_sale=data.get('one_click_sale', False),
#                 enable_tracking=data.get('enable_tracking', False),
#                 print_serial_no=data.get('print_serial_no', False),
#                 not_for_sale=data.get('not_for_sale', False)
#             )

#             product.save()

#             return JsonResponse({"message": "Product added successfully."}, status=201)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=400)
    
#     return JsonResponse({"error": "Invalid request method."}, status=405)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product , PriceDetails , StockAndUnitDetails , OtherDetails
import json  

@csrf_exempt
def create_product(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        product = Product.objects.create(
            group=data['group'],
            brand=data['brand'],
            product_name=data['product_name'],
            product_code=data['product_code']
        )
        return JsonResponse({"message": "Product created", "id": product.id})
@csrf_exempt
def get_product(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        product_id = data.get('id')
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
                product_data = {
                    'group': product.group,
                    'brand': product.brand,
                    'product_name': product.product_name,
                    'product_code': product.product_code
                }
                return JsonResponse(product_data)
            except Product.DoesNotExist:
                return JsonResponse({"message": "Product not found"}, status=404)
        else:
            return JsonResponse({"message": "ID is required"}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method, POST required"}, status=405)


@csrf_exempt
def update_product(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        
        product_id = data.get('id')
        
        if not product_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        try:
            product = Product.objects.get(id=product_id)
            
            product.group = data.get('group', product.group)
            product.brand = data.get('brand', product.brand)
            product.product_name = data.get('product_name', product.product_name)
            product.product_code = data.get('product_code', product.product_code)
            
            product.save()
            
            return JsonResponse({"message": "Product updated successfully"})
        
        except Product.DoesNotExist:
            return JsonResponse({"message": "Product not found"}, status=404)



@csrf_exempt
def delete_product(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        product_id = data.get('id')
        if product_id:
            try:
                product = Product.objects.get(id=product_id)
                product.delete()
                return JsonResponse({"message": "Product deleted"})
            except Product.DoesNotExist:
                return JsonResponse({"message": "Product not found"}, status=404)
        else:
            return JsonResponse({"message": "ID is required"}, status=400)

# -----------------------------------------Price Details----------------------------------------------


@csrf_exempt
def create_price_details(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        product_id = data.get('product_id')
        
        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)
        
        try:
            product = Product.objects.get(id=product_id)
            
            price_details = PriceDetails.objects.create(
                product=product,
                purchase_price=data.get('purchase_price'),
                sale_price=data.get('sale_price'),
                min_sale_price=data.get('min_sale_price'),
                mrp=data.get('mrp')
            )
            
            return JsonResponse({"message": "Price details created successfully"})
        
        except Product.DoesNotExist:
            return JsonResponse({"message": "Product not found"}, status=404)


@csrf_exempt
def get_price_details(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        
        price_detail_id = data.get('id')
        
        if not price_detail_id:
            return JsonResponse({"message": "Price detail ID is required"}, status=400)
        
        try:
            price_details = PriceDetails.objects.get(id=price_detail_id)
            price_details_data = {
                "id": price_details.id,
                "product_id": price_details.product.id,
                "purchase_price": str(price_details.purchase_price),
                "sale_price": str(price_details.sale_price),
                "min_sale_price": str(price_details.min_sale_price),
                "mrp": str(price_details.mrp)
            }
            return JsonResponse(price_details_data)
        
        except PriceDetails.DoesNotExist:
            return JsonResponse({"message": "Price detail not found"}, status=404)




@csrf_exempt
def update_price_details(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        
        price_detail_id = data.get('id')
        
        if not price_detail_id:
            return JsonResponse({"message": "Price detail ID is required"}, status=400)
        
        try:
            price_details = PriceDetails.objects.get(id=price_detail_id)
            
            price_details.purchase_price = data.get('purchase_price', price_details.purchase_price)
            price_details.sale_price = data.get('sale_price', price_details.sale_price)
            price_details.min_sale_price = data.get('min_sale_price', price_details.min_sale_price)
            price_details.mrp = data.get('mrp', price_details.mrp)
            
            price_details.save()

            return JsonResponse({"message": "Price details updated successfully"})
        
        except PriceDetails.DoesNotExist:
            return JsonResponse({"message": "Price detail not found"}, status=404)

@csrf_exempt
def delete_price_details(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        
        price_detail_id = data.get('id')
        
        if not price_detail_id:
            return JsonResponse({"message": "Price detail ID is required"}, status=400)
        
        try:
            price_details = PriceDetails.objects.get(id=price_detail_id)
            price_details.delete()
            return JsonResponse({"message": "Price details deleted successfully"})
        
        except PriceDetails.DoesNotExist:
            return JsonResponse({"message": "Price detail not found"}, status=404)


# ----------------------get price details with product id and price details------------------------------




@csrf_exempt
def get_price_details_by_product(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        
        product_id = data.get('product_id')
        
        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)
        
        try:
            price_details = PriceDetails.objects.filter(product_id=product_id)
            
            if not price_details.exists():
                return JsonResponse({"message": "No price details found for the given product ID"}, status=404)
            
            response_data = [
                {
                    "id": detail.id,
                    "purchase_price": str(detail.purchase_price),
                    "sale_price": str(detail.sale_price),
                    "min_sale_price": str(detail.min_sale_price),
                    "mrp": str(detail.mrp)
                }
                for detail in price_details
            ]
            
            return JsonResponse({"price_details": response_data}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)


# ----------------delete details of price details with product id ----------------------------------


@csrf_exempt
def delete_price_details_by_product(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)

        product_id = data.get('product_id')

        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)

        try:
            price_details = PriceDetails.objects.filter(product_id=product_id)

            if not price_details.exists():
                return JsonResponse({"message": "No price details found for the given product ID"}, status=404)

            count, _ = price_details.delete()

            return JsonResponse({"message": f"Deleted {count} record(s) for product ID {product_id}"}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)


# ----------------------------------stock and unit quantities-------------------------------------------



@csrf_exempt
def create_stock_and_unit_details(request):
    if request.method == 'POST':

        data = json.loads(request.body)

        product_id = data.get('product_id')
        unit = data.get('unit')
        opening_stock = data.get('opening_stock')
        opening_stock_value = data.get('opening_stock_value')

        if not product_id or not unit or not opening_stock or not opening_stock_value:
            return JsonResponse({"message": "All fields are required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return JsonResponse({"message": "Product not found"}, status=404)

        stock_and_unit_details = StockAndUnitDetails(
            product=product,
            unit=unit,
            opening_stock=opening_stock,
            opening_stock_value=opening_stock_value
        )
        stock_and_unit_details.save()

        return JsonResponse({"message": "Stock and unit details created successfully"}, status=201)


@csrf_exempt
def get_stock_and_unit_details(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        
        stock_and_unit_id = data.get('id')
        
        if not stock_and_unit_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        try:
            stock_and_unit_details = StockAndUnitDetails.objects.get(id=stock_and_unit_id)
            
            response_data = {
                "product_id": stock_and_unit_details.product.id,
                "unit": stock_and_unit_details.unit,
                "opening_stock": stock_and_unit_details.opening_stock,
                "opening_stock_value": str(stock_and_unit_details.opening_stock_value),
            }
            
            return JsonResponse(response_data)
        
        except StockAndUnitDetails.DoesNotExist:
            return JsonResponse({"message": "Stock and unit details not found"}, status=404)

@csrf_exempt
def update_stock_and_unit_details(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        
        stock_and_unit_id = data.get('id')
        
        unit = data.get('unit')
        opening_stock = data.get('opening_stock')
        opening_stock_value = data.get('opening_stock_value')

        if not stock_and_unit_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        try:
            stock_and_unit_details = StockAndUnitDetails.objects.get(id=stock_and_unit_id)
            
            if unit:
                stock_and_unit_details.unit = unit
            if opening_stock is not None:
                stock_and_unit_details.opening_stock = opening_stock
            if opening_stock_value is not None:
                stock_and_unit_details.opening_stock_value = opening_stock_value

            stock_and_unit_details.save()
            
            return JsonResponse({"message": "Stock and unit details updated successfully"})
        
        except StockAndUnitDetails.DoesNotExist:
            return JsonResponse({"message": "Stock and unit details not found"}, status=404)


@csrf_exempt
def delete_stock_and_unit_details(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        
        stock_and_unit_id = data.get('id')
        
        if not stock_and_unit_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        try:
            stock_and_unit_details = StockAndUnitDetails.objects.get(id=stock_and_unit_id)
            stock_and_unit_details.delete()
            
            return JsonResponse({"message": "Stock and unit details deleted successfully"})
        
        except StockAndUnitDetails.DoesNotExist:
            return JsonResponse({"message": "Stock and unit details not found"}, status=404)


# --------------------------get stock and unit details using product id----------------------

@csrf_exempt
def get_stock_and_unit_details_by_product(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        
        product_id = data.get('product_id')
        
        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)
        
        try:
            stock_and_unit_details = StockAndUnitDetails.objects.filter(product_id=product_id)
            
            if not stock_and_unit_details.exists():
                return JsonResponse({"message": "No stock and unit details found for the given product ID"}, status=404)
            
            response_data = [
                {
                    "id": detail.id,
                    "unit": detail.unit,
                    "opening_stock": detail.opening_stock,
                    "opening_stock_value": str(detail.opening_stock_value)
                }
                for detail in stock_and_unit_details
            ]
            
            return JsonResponse({"stock_and_unit_details": response_data}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)

#------------------------delete stock and units using product id----------------------------
 


@csrf_exempt
def delete_stock_and_unit_details_by_product(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)

        product_id = data.get('product_id')

        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)

        try:
            stock_and_unit_details = StockAndUnitDetails.objects.filter(product_id=product_id)

            if not stock_and_unit_details.exists():
                return JsonResponse({"message": "No stock and unit details found for the given product ID"}, status=404)

            count, _ = stock_and_unit_details.delete()

            return JsonResponse({"message": f"Deleted {count} record(s) for product ID {product_id}"}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)


# -------------------------------Other Details------------------------------------------------



@csrf_exempt
def create_other_details(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        product_id = data.get('product_id')
        sale_discount_percentage = data.get('sale_discount_percentage')
        low_level_limit = data.get('low_level_limit')
        select_general = data.get('select_general')
        serial_no = data.get('serial_no')
        
        if not product_id or not sale_discount_percentage or not low_level_limit or not select_general or not serial_no:
            return JsonResponse({"message": "All fields are required"}, status=400)
        
        other_details = OtherDetails(
            product_id=product_id,
            sale_discount_percentage=sale_discount_percentage,
            low_level_limit=low_level_limit,
            select_general=select_general,
            serial_no=serial_no
        )
        
        other_details.save()
        
        return JsonResponse({"message": "Other details saved successfully"})


@csrf_exempt
def get_other_details(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        
        other_details_id = data.get('id')
        
        if not other_details_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        try:
            other_details = OtherDetails.objects.get(id=other_details_id)
            
            response_data = {
                "product_id": other_details.product.id,
                "sale_discount_percentage": str(other_details.sale_discount_percentage),
                "low_level_limit": other_details.low_level_limit,
                "select_general": other_details.select_general,
                "serial_no": other_details.serial_no
            }
            
            return JsonResponse(response_data)
        
        except OtherDetails.DoesNotExist:
            return JsonResponse({"message": "Other details not found"}, status=404)

@csrf_exempt
def update_other_details(request):
    if request.method == 'PUT':
        data = json.loads(request.body)
        
        other_details_id = data.get('id')
        
        if not other_details_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        sale_discount_percentage = data.get('sale_discount_percentage')
        low_level_limit = data.get('low_level_limit')
        select_general = data.get('select_general')
        serial_no = data.get('serial_no')
        
        try:
            other_details = OtherDetails.objects.get(id=other_details_id)
            
            if sale_discount_percentage is not None:
                other_details.sale_discount_percentage = sale_discount_percentage
            if low_level_limit is not None:
                other_details.low_level_limit = low_level_limit
            if select_general:
                other_details.select_general = select_general
            if serial_no:
                other_details.serial_no = serial_no

            other_details.save()

            return JsonResponse({"message": "Other details updated successfully"})

        except OtherDetails.DoesNotExist:
            return JsonResponse({"message": "Other details not found"}, status=404)

@csrf_exempt
def delete_other_details(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)
        
        other_details_id = data.get('id')
        
        if not other_details_id:
            return JsonResponse({"message": "ID is required"}, status=400)
        
        try:
            other_details = OtherDetails.objects.get(id=other_details_id)
            other_details.delete()
            
            return JsonResponse({"message": "Other details deleted successfully"})
        
        except OtherDetails.DoesNotExist:
            return JsonResponse({"message": "Other details not found"}, status=404)



# -----------------get other details with product id--------------------------------------


@csrf_exempt
def get_other_details_by_product(request):
    if request.method == 'GET':
        data = json.loads(request.body)
        
        product_id = data.get('product_id')
        
        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)
        
        try:
            other_details = OtherDetails.objects.filter(product_id=product_id)
            
            if not other_details.exists():
                return JsonResponse({"message": "No other details found for the given product ID"}, status=404)
            
            response_data = [
                {
                    "id": detail.id,
                    "sale_discount_percentage": str(detail.sale_discount_percentage),
                    "low_level_limit": detail.low_level_limit,
                    "select_general": detail.select_general,
                    "serial_no": detail.serial_no
                }
                for detail in other_details
            ]
            
            return JsonResponse({"other_details": response_data}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)


# ---------------------------------delete other details with product id---------------------


@csrf_exempt
def delete_other_details_by_product(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)

        product_id = data.get('product_id')

        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)

        try:
            other_details = OtherDetails.objects.filter(product_id=product_id)

            if not other_details.exists():
                return JsonResponse({"message": "No other details found for the given product ID"}, status=404)

            count, _ = other_details.delete()

            return JsonResponse({"message": f"Deleted {count} record(s) for product ID {product_id}"}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)

# --------------------get all details with product id--------------------------------------------
# views.py

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Product
from django.core.exceptions import ObjectDoesNotExist
import json

@csrf_exempt
def get_product_and_related_details(request):
    if request.method == 'GET':
        data = json.loads(request.body)

        product_id = data.get('product_id')

        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)

        try:
            product = Product.objects.get(id=product_id)

            price_details = product.price_details.all().values()
            stock_and_unit_details = product.stock_and_unit_details.all().values()
            other_details = product.other_details.all().values()

            response_data = {
                "product": {
                    "group": product.group,
                    "brand": product.brand,
                    "product_name": product.product_name,
                    "product_code": product.product_code
                },
                "price_details": list(price_details),
                "stock_and_unit_details": list(stock_and_unit_details),
                "other_details": list(other_details)
            }

            return JsonResponse(response_data, status=200)

        except ObjectDoesNotExist:
            return JsonResponse({"message": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)



# ----------------------delete all details with product id------------------------------------------


@csrf_exempt
def delete_product_and_related_details(request):
    if request.method == 'DELETE':
        data = json.loads(request.body)

        product_id = data.get('product_id')

        if not product_id:
            return JsonResponse({"message": "Product ID is required"}, status=400)

        try:
            product = Product.objects.filter(id=product_id)

            if not product.exists():
                return JsonResponse({"message": "Product not found"}, status=404)

            product.delete()

            return JsonResponse({"message": "Product and related details deleted successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"message": f"An error occurred: {str(e)}"}, status=500)
