from bson import ObjectId, Decimal128
from bson import ObjectId  
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import sync_to_async, async_to_sync
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
from django.conf import settings
from .models import *
from .rezorpay import *
from django.db import transaction
from django.db.models import Q
from django.utils import timezone 
from datetime import datetime, timedelta, date
import base64
import jwt
import json
import hmac
import hashlib
import razorpay
import logging

logger = logging.getLogger(__name__)
@csrf_exempt
def addGst(request):
    return async_to_sync(async_add_gst)(request)
async def async_add_gst(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method, only POST is allowed'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
        required_fields = [
            'state', 'register_type', 'assessee_of_authority_tertiary',
            'gst_in_un', 'periodicity_of_gstr1', 'gst_user_name',
            'mode_filing', 'e_invoicing_applicable', 'applicable_from',
            'invoice_bill_from_place', 'e_way_bill_applicable',
            'applicable_for_interest', 'another_GST_company']

        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            check= await sync_to_async(AddGst.objects.get)(gst_in_un=data['gst_in_un'])
            return JsonResponse({'error':f'gst_in_unt number already exist'},status=400)
        except AddGst.DoesNotExist:
            pass
        gst_record = await sync_to_async(AddGst.objects.create)(
            state=data['state'],
            register_type=data['register_type'],
            assessee_of_authority_tertiary=data['assessee_of_authority_tertiary'],
            gst_in_un=data['gst_in_un'],
            periodicity_of_gstr1=data['periodicity_of_gstr1'],
            gst_user_name=data['gst_user_name'],
            mode_filing=data['mode_filing'],
            e_invoicing_applicable=data['e_invoicing_applicable'],
            applicable_from=data.get('applicable_from'), 
            invoice_bill_from_place=data.get('invoice_bill_from_place'),
            e_way_bill_applicable=data['e_way_bill_applicable'],
            applicable_for_interest=data['applicable_for_interest'],
            another_GST_company=data['another_GST_company']
        )
        return JsonResponse({
            'message': 'GST record added successfully',
            'AddGst_Id': gst_record.AddGst_Id,
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def GstGet(request):
    return async_to_sync(async_Gst_Get)(request)
async def async_Gst_Get(request):
    try:
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        try:
            gst_record = await sync_to_async(AddGst.objects.get)(AddGst_Id=object_id)
        except AddGst.DoesNotExist:
            return JsonResponse({'error': 'GST details not found'}, status=404)
        Gstdata = {
            'id': gst_record.AddGst_Id,
            'state': gst_record.state,
            'register_type': gst_record.register_type,
            'assessee_of_authority_tertiary': gst_record.assessee_of_authority_tertiary,
            'gst_in_un': gst_record.gst_in_un,
            'periodicity_of_gstr1': gst_record.periodicity_of_gstr1,
            'gst_user_name': gst_record.gst_user_name,
            'mode_filing': gst_record.mode_filing.isoformat(),
            'e_invoicing_applicable': gst_record.e_invoicing_applicable,
            'applicable_from': gst_record.applicable_from.isoformat() if gst_record.applicable_from else None,
            'invoice_bill_from_place': gst_record.invoice_bill_from_place,
            'e_way_bill_applicable': gst_record.e_way_bill_applicable, 
            'applicable_for_interest': gst_record.applicable_for_interest,
            'another_GST_company': gst_record.another_GST_company,  
        }
        return JsonResponse(Gstdata, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_gst(request):
    return async_to_sync(async_update_gst)(request)
async def async_update_gst(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        try:
            object_id = str(ObjectId(object_id))  
        except Exception:
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)
        try:
            gst = await sync_to_async(AddGst.objects.get)(AddGst_Id=object_id)
        except AddGst.DoesNotExist:
            return JsonResponse({'error': 'GST details not found for the provided object_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = [
            'state', 'register_type', 'assessee_of_authority_tertiary', 'gst_in_un',
            'periodicity_of_gstr1', 'gst_user_name', 'mode_filing', 'e_invoicing_applicable',
            'applicable_from', 'invoice_bill_from_place', 'e_way_bill_applicable',
            'applicable_for_interest', 'another_GST_company'
        ]
        updated_fields = {}
        for field in updatable_fields:
            if field in data:
                setattr(gst, field, data[field])
                updated_fields[field] = data[field]
        await sync_to_async(gst.save)()
        return JsonResponse({
            'success': 'GST details updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_gst(request):
    return async_to_sync(async_delete_gst)(request)
async def async_delete_gst(request):
    try:
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        try:
            object_id = ObjectId(object_id) 
        except Exception:
            return JsonResponse({'error': 'Invalid objectId format'}, status=405)
        try:
            gst_record = await sync_to_async(AddGst.objects.get)(AddGst_Id=str(object_id))
        except AddGst.DoesNotExist:
            return JsonResponse({'error': 'GST details not found'}, status=404)
        if request.method == 'DELETE':
            try:
                await sync_to_async(gst_record.delete)()
                return JsonResponse({'success': 'GST details deleted successfully'}, status=200)
            except Exception as e:
                return JsonResponse({'error': f'Error deleting GST details: {str(e)}'}, status=500)
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def add_StockCategory(request):
    return async_to_sync(async_addStockCategory)(request)
async def async_addStockCategory(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
        required_fields = ['name', 'igst', 'cgst', 'sgst']
        for field in required_fields:
            if field not in data or not data[field]:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        stock_category = await sync_to_async(StockCategory.objects.create)(
            name=data['name'],
            igst=data['igst'],
            cgst=data['cgst'],
            sgst=data['sgst']
        )
        return JsonResponse({'message': 'Stock category added successfully', 'StockCategory_Id': str(stock_category.StockCategory_id), 
                             'Stock_category_Name':stock_category.name}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

def get_StockCategory(request):
    return async_to_sync(async_StockCategory_Get)(request)

async def async_StockCategory_Get(request):
    try:
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        
        try:
            stock_category = await sync_to_async(StockCategory.objects.get)(StockCategory_id=object_id)
        except StockCategory.DoesNotExist:
            return JsonResponse({'error': 'StockCategory not found'}, status=404)
        
        stock_category_data = {
            'id': str(stock_category.StockCategory_id),
            'sno': stock_category.sno,
            'name': stock_category.name,
            'igst': stock_category.igst,
            'cgst': stock_category.cgst,
            'sgst': stock_category.sgst,
        }
        return JsonResponse(stock_category_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_StockCategory(request):
    return async_to_sync(async_update_StockCategory)(request)
async def async_update_StockCategory(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        try:
            object_id = str(ObjectId(object_id))  
        except Exception:
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)
        try:
            Stock_Categorys = await sync_to_async(StockCategory.objects.get)(StockCategory_id=object_id)
        except StockCategory.DoesNotExist:
            return JsonResponse({'error': 'Stock group not found for the provided object_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
        
        updatable_fields = ['name', 'igst', 'cgst', 'sgst']
        updated_fields = {}
        for field in updatable_fields:
            if field in data:
                setattr(Stock_Categorys, field, data[field])
                updated_fields[field] = data[field]
        
        await sync_to_async(Stock_Categorys.save)()
        return JsonResponse({
            'success': 'Stock category updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_StockCategory(request):
    return async_to_sync(async_delete_StockCategory)(request)
async def async_delete_StockCategory(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        try:
            object_id = str(ObjectId(object_id)) 
        except Exception:
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)
        try:
            Stock_Categorys = await sync_to_async(StockCategory.objects.get)(StockCategory_id=object_id)
        except StockCategory.DoesNotExist:
            return JsonResponse({'error': 'Stock group not found for the provided object_id'}, status=404)
        try:
            await sync_to_async(Stock_Categorys.delete)()
            return JsonResponse({'success': 'Stock group deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting stock group: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

def convert_decimal(value):
    if isinstance(value, Decimal128):
        return float(value.to_decimal())  
    return value

@csrf_exempt
def add_unit_creation(request):
    return async_to_sync(async_add_unit_creation)(request)
async def async_add_unit_creation(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['unit', 'fullname', 'allow_decimal']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        try:
            new_unit = await sync_to_async(UnitCreation.objects.create)(
                unit=data['unit'],
                fullname=data['fullname'],
                allow_decimal=data['allow_decimal'],
            )
        except Exception as e:
            return JsonResponse({'error': f'Error creating UnitCreation: {str(e)}'}, status=500)

        return JsonResponse({'message': 'UnitCreation object added successfully'}, status=201)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def get_unit(request):
    return async_to_sync(async_get_unit_by_id)(request)

async def async_get_unit_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(object_id):
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)

        try:
            unit = await sync_to_async(UnitCreation.objects.get)(Unit_Id=object_id)
        except UnitCreation.DoesNotExist:
            return JsonResponse({'error': 'Unit not found'}, status=404)

        unit_data = {
            'id': str(unit.Unit_Id),
            'unit': unit.unit,
            'fullname': unit.fullname,
            'allow_decimal': unit.allow_decimal,
        }
        return JsonResponse(unit_data, status=200)
    except ValidationError:
        return JsonResponse({'error': 'Invalid data format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_unit(request):
    return async_to_sync(async_update_unit_creation)(request)

async def async_update_unit_creation(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(object_id):
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)

        try:
            unit_creation = await sync_to_async(UnitCreation.objects.get)(Unit_Id=object_id)
        except UnitCreation.DoesNotExist:
            return JsonResponse({'error': 'UnitCreation object not found for the provided object_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = ['unit', 'fullname', 'allow_decimal']
        updated_fields = {}
        for field in updatable_fields:
            if field in data:
                setattr(unit_creation, field, data[field]) 
                updated_fields[field] = data[field]
        await sync_to_async(unit_creation.save)()

        return JsonResponse({
            'success': 'UnitCreation object updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_unit(request):
    return async_to_sync(async_delete_stock_item)(request)
async def async_delete_stock_item(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        
        try:
            object_id = str(ObjectId(object_id))
        except Exception:
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)
        
        try:
            stock_item = await sync_to_async(UnitCreation.objects.get)(Unit_Id=object_id)
        except UnitCreation.DoesNotExist:
            return JsonResponse({'error': 'Stock item not found for the provided object_id'}, status=404)
        try:
            await sync_to_async(stock_item.delete)()
            return JsonResponse({'success': 'Stock item deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting stock item: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def add_StocksubCategory(request):
    return async_to_sync(async_addStocksubCategory)(request)
async def async_addStocksubCategory(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
        required_fields = ['subCategoryname', 'StockCategory_id','Categoryname','hsn_sac_code']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
            
        substock_category = await sync_to_async(StocksubCategory.objects.create)(
            StockCategory_id=data['StockCategory_id'],
            subCategoryname=data['subCategoryname'],
            Categoryname=data.get('Categoryname'),
            hsn_sac_code=data.get('hsn_sac_code'),
        )
        return JsonResponse({'message': 'Stock subcategory added successfully', 
                             'subCategory_Id': substock_category.subCategory_Id}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

def get_StocksubCategory(request):
    return async_to_sync(async_get_category_by_ids)(request)
async def async_get_category_by_ids(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        subCategory_Id = request.GET.get('subCategory_Id')
        StockCategory_id = request.GET.get('StockCategory_id')
        if not subCategory_Id or not StockCategory_id:
            return JsonResponse({'error': 'Both Category_Id and StockGroup_Id query parameters are required'}, status=400)

        if not ObjectId.is_valid(subCategory_Id) or not ObjectId.is_valid(StockCategory_id):
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)

        try:
            category = await sync_to_async(StocksubCategory.objects.get)(
                subCategory_Id=subCategory_Id,
                StockCategory_id=StockCategory_id)
        
        except StocksubCategory.DoesNotExist:
            return JsonResponse({'error': 'Stock category not found'}, status=404)
        category_data = {
            'subCategory_Id': str(category.subCategory_Id),
            'S.No':category.sno,
            'StockCategory_id': category.StockCategory_id,
            'subCategoryname': category.subCategoryname,
            'Categoryname': category.Categoryname,
            'hsn_sac_code': category.hsn_sac_code,
        }
        return JsonResponse(category_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_StocksubCategory(request):
    return async_to_sync(async_update_StocksubCategory)(request)
async def async_update_StocksubCategory(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        subCategory_Id = request.GET.get('subCategory_Id')
        StockCategory_id = request.GET.get('StockCategory_id')

        if not subCategory_Id or not StockCategory_id:
            return JsonResponse({'error': 'Both category_id and stock_group_id query parameters are required'}, status=400)

        if not ObjectId.is_valid(subCategory_Id) or not ObjectId.is_valid(StockCategory_id):
            return JsonResponse({'error': 'Invalid category_id or stock_group_id format'}, status=400)

        try:
            stock_subcategory = await sync_to_async(StocksubCategory.objects.get)(
                subCategory_Id=subCategory_Id,
                StockCategory_id=StockCategory_id
            )
        except StocksubCategory.DoesNotExist:
            return JsonResponse({'error': 'StockCategory not found for the provided category_id and stock_group_id'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = ['subCategoryname', 'StockCategory_id','Categoryname','hsn_sac_code']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(stock_subcategory, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(stock_subcategory.save)()

        return JsonResponse({
            'success': 'StocksubCategory object updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_subcategory(request):
    return async_to_sync(async_delete_subcategory)(request)
async def async_delete_subcategory(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        
        subCategory_Id = request.GET.get('subCategory_Id')
        StockCategory_id = request.GET.get('StockCategory_id')
        
        if not subCategory_Id or not StockCategory_id:
            return JsonResponse({'error': 'Both category_id and stock_group_id query parameters are required'}, status=400)

        try:
            subCategory_Id = str(ObjectId(subCategory_Id))
            StockCategory_id = str(ObjectId(StockCategory_id))
        except Exception:
            return JsonResponse({'error': 'Invalid object_id format for category_id or stock_group_id'}, status=400)
        try:
            stock_subcategory = await sync_to_async(StocksubCategory.objects.get)(
                subCategory_Id=subCategory_Id, StockCategory_id=StockCategory_id
            )
        except StockCategory.DoesNotExist:
            return JsonResponse({'error': 'Stock category not found for the provided category_id and stock_group_id'}, status=404)
        try:
            await sync_to_async(stock_subcategory.delete)()
            return JsonResponse({'success': 'Stock category deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting stock category: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def add_StockDetails(request):
    return async_to_sync(async_addStockDetails)(request)
async def async_addStockDetails(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
        required_fields = ['opening_stock', 'opening_stock_values','low_stock_qty','date','location','product_Id']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        stock_details = await sync_to_async(StockDetails.objects.create)(
            product_Id=data['product_Id'],
            opening_stock=data['opening_stock'],
            opening_stock_values=data.get('opening_stock_values'),
            low_stock_qty=data.get('low_stock_qty'),
            date=data.get('date'),
            location=data.get('location'),
            )
        return JsonResponse({'message': 'Stock details added successfully', 
                            'id': stock_details.StockDetails_id,'product_id':stock_details.product_Id},status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def get_stockDetails(request):
    return async_to_sync(async_getStockDetailsById)(request)
async def async_getStockDetailsById(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Invalid request method. Use GET for retrieval.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(object_id):
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)

        try:
            stock_details = await sync_to_async(StockDetails.objects.get)(product_Id=object_id)
        except StockDetails.DoesNotExist:
            return JsonResponse({'error': 'StockGroupTaxDetails object not found for the provided object_id'}, status=404)

        response_data = {
            'product_Id': str(stock_details.product_Id),
            'opening_stock': stock_details.opening_stock,
            'opening_stock_values': stock_details.opening_stock_values,
            'low_stock_qty': stock_details.low_stock_qty,
            'date': stock_details.date, 
            'location': stock_details.location, 
            'id': stock_details.StockDetails_id
        }
        return JsonResponse(response_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_stockDetails(request):
    return async_to_sync(async_updateStockDetailsById)(request)
async def async_updateStockDetailsById(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(object_id):
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)

        try:
            stock_group_tax_details = await sync_to_async(StockDetails.objects.get)(product_Id=object_id)
        except StockDetails.DoesNotExist:
            return JsonResponse({'error': 'StockGroupTaxDetails object not found for the provided object_id'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields =  ['opening_stock', 'opening_stock_values','low_stock_qty','date','location']
        updated_fields = {}
        for field in updatable_fields:
            if field in data:
                setattr(stock_group_tax_details, field, data[field])
                updated_fields[field] = data[field]
        await sync_to_async(stock_group_tax_details.save)()
        return JsonResponse({
            'success': 'StockGroupTaxDetails object updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_stockDetails(request):
    return async_to_sync(async_deleteStockDetailsById)(request)
async def async_deleteStockDetailsById(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(object_id):
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)
        try:
            stock_details = await sync_to_async(StockDetails.objects.get)(product_Id=object_id)
        except StockDetails.DoesNotExist:
            return JsonResponse({'error': 'StockGroupTaxDetails object not found for the provided object_id'}, status=404)

        try:
            await sync_to_async(stock_details.delete)()
            return JsonResponse({'success': 'StockGroupTaxDetails object deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting StockGroupTaxDetails object: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
import re
def clean_base64_image(base64_string):
    """ Remove spaces and invalid characters from Base64 """
    base64_string = base64_string.strip()
    base64_string = re.sub(r'[^A-Za-z0-9+/=]', '', base64_string)  
    return base64_string

@csrf_exempt
def add_product_details(request):
    return async_to_sync(async_add_product)(request)

async def async_add_product(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = [
            'Customer_Id', 'product_name', 'category', 'subcategory', 'brand',
            'unit', 'bar_oq_code', 'description', 'img', 'product_code'
        ]
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        imgbase = clean_base64_image(data.get('img', ''))
        if not imgbase:
            return JsonResponse({'error': 'Img field is empty'}, status=400)

        try:
            base64.b64decode(imgbase, validate=True)
        except Exception:
            return JsonResponse({'error': 'Invalid Base64 format'}, status=400)

        exists = await sync_to_async(ProductDetails.objects.filter(
            subcategory=data['subcategory'],
            product_code=data['product_code'],
            brand=data['brand']
        ).exists)()

        if exists:
            return JsonResponse({'error': 'Product already exists'}, status=400)

        try:
            product = await sync_to_async(ProductDetails.objects.create)(
                category=data['category'],
                Customer_Id=data['Customer_Id'],
                subcategory=data['subcategory'],
                unit=data['unit'],
                bar_oq_code=data['bar_oq_code'],
                description=data['description'],
                img=imgbase, 
                brand=data['brand'],
                product_name=data['product_name'],
                product_code=data['product_code']
            )
        except Exception as e:
            logger.error(f"Failed to create product: {str(e)}")
            return JsonResponse({'error': f'Failed to create product: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'Product added successfully',
            'product_id': str(product.product_Id)
        }, status=200)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)

@csrf_exempt   
def get_product(request):
    return async_to_sync(async_get_product_by_id)(request)
async def async_get_product_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)
        try:
            product = await sync_to_async(ProductDetails.objects.get)(product_Id=product_id)
        except ProductDetails.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)
        product_data = {
            'product_Id': str(product.product_Id),
            'Customer_Id': str(product.Customer_Id),
            'category': product.category,
            'subcategory': product.subcategory,
            'unit': product.unit,
            'bar_oq_code': product.bar_oq_code,
            'brand': product.brand,
            'img': product.img,
            'product_name': product.product_name,
            'product_code': product.product_code,
            'description': product.description,
        }
        return JsonResponse(product_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt   
def get_product_all(request):
    return async_to_sync(async_get_all_products)(request)
async def async_get_all_products(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        products = await sync_to_async(list)(ProductDetails.objects.all())
        product_list = [
            {
                'product_Id': str(product.product_Id),
                'Customer_Id': str(product.Customer_Id),
                'category': product.category,
                'subcategory': product.subcategory,
                'unit': product.unit,
                'bar_oq_code': product.bar_oq_code,
                'brand': product.brand,
                'img': product.img, 
                'product_name': product.product_name,
                'product_code': product.product_code,
                'description': product.description,
            }
            for product in products
        ]
        return JsonResponse({'products': product_list}, status=200, safe=False)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_product(request):
    return async_to_sync(async_update_product)(request)
async def async_update_product(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid product_id format'}, status=400)
        try:
            product = await sync_to_async(ProductDetails.objects.get)(product_Id=product_id)
        except ProductDetails.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
        updatable_fields = ['Customer_Id','product_name', 'category','subcategory','brand', 
                           'unit','bar_oq_code','description','img', 'product_code']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                if field == 'img':
                    imgbase= clean_base64_image(data['img'])
                    try:
                        base64.b64decode(imgbase, validate=True)
                    except Exception :
                        return JsonResponse({'error':f'Invalid base64 format'})
                    setattr(product, field, imgbase)
                else:
                    setattr(product, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(product.save)()
        return JsonResponse({
            'success': 'Product updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_product(request):
    return async_to_sync(async_delete_product)(request)
async def async_delete_product(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid product_id format'}, status=400)
        try:
            product = await sync_to_async(ProductDetails.objects.get)(product_Id=product_id)
        except ProductDetails.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        try:
            await sync_to_async(product.delete)()
            return JsonResponse({'success': 'Product deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting product: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def price_calculation(request):
    return async_to_sync(async_price_calculation)(request)

async def async_price_calculation(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['group', 'brand', 'product_name', 'product_code', 'SalePrice', 'IGST', 'discount']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            # Extract values from request data
            SalePrice = float(data['SalePrice'])
            IGST = float(data['IGST'])
            discount = float(data['discount'])

            if IGST < 0 or discount < 0:
                return JsonResponse({'error': 'IGST and discount cannot be negative'}, status=400)
            IGST_value = (SalePrice * IGST) / 100  
            CGST_value = IGST_value /2 
            SGST_value = IGST_value /2 
            totalamount = SalePrice + IGST_value     
            discount_value = (totalamount * discount) / 100  
            total = totalamount - discount_value   
        except Exception as e:
            logger.error(f"Failed to create product: {str(e)}")
            return JsonResponse({'error': f'Failed to create product: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'Product added successfully',
            'IGST_value': round(IGST_value, 2),
            # 'subtotal': round(total, 2),
            'CGST_value': round(CGST_value, 2),
            'SGST_value': round(SGST_value, 2),
            # 'discount_value': round(discount_value, 2),
            'total': round(total, 2)
        }, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def add_priceDetails(request):
    return async_to_sync(async_add_price)(request)
async def async_add_price(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['PurchasePrice', 'SalePrice', 'Min_Sale_Price', 'MRP', 'hsn_sac_code', 'discount','product_Id']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            price = await sync_to_async(PriceDetails.objects.create)(
                product_Id= data['product_Id'],
                PurchasePrice=data['PurchasePrice'],
                SalePrice=data['SalePrice'],
                Min_Sale_Price=data['Min_Sale_Price'],
                MRP=data['MRP'],
                hsn_sac_code=data['hsn_sac_code'],
                discount=data['discount'],
            )
        except Exception as e:
            logger.error(f"Failed to create product: {str(e)}")
            return JsonResponse({'error': f'Failed to create product: {str(e)}'}, status=500)
        return JsonResponse({
            'message': 'Product added successfully',
            'product_id': str(price.product_Id)
        }, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def get_priceDetails(request):
    return async_to_sync(async_get_price_by_id)(request)
async def async_get_price_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)

        try:
            price = await sync_to_async(PriceDetails.objects.get)(product_Id=product_id)
        except PriceDetails.DoesNotExist:
            return JsonResponse({'error': 'Product not found'}, status=404)

        price_data = {
            'product_Id': str(price.product_Id),
            'PurchasePrice': price.PurchasePrice,
            'SalePrice': price.SalePrice,
            'Min_Sale_Price': price.Min_Sale_Price,
            'MRP': price.MRP,
            'hsn_sac_code': price.hsn_sac_code,
            'discount': price.discount,
        }
        return JsonResponse(price_data, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_priceDetails(request):
    return async_to_sync(async_update_price)(request)
async def async_update_price(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid product_id format'}, status=400)
        try:
            price = await sync_to_async(PriceDetails.objects.get)(product_Id=product_id)
        except ProductDetails.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
        updatable_fields =  ['PurchasePrice', 'SalePrice', 'Min_Sale_Price', 'MRP', 'hsn_sac_code', 'discount'
                    'product_Id']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(price, field, data[field])
                updated_fields[field] = data[field]
        await sync_to_async(price.save)()
        return JsonResponse({
            'success': 'Price date updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_priceDetails(request):
    return async_to_sync(async_delete_price)(request)
async def async_delete_price(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid product_id format'}, status=400)
        try:
            price = await sync_to_async(PriceDetails.objects.get)(product_Id=product_id)
        except ProductDetails.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        try:
            await sync_to_async(price.delete)()
            return JsonResponse({'success': 'Product deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting product: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def add_priceGStDetails(request):
    return async_to_sync(async_add_price_Gst_details)(request)
async def async_add_price_Gst_details(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['product_Id','igst','igstprice','cgst','cgstprice','sgst','sgstprice',
                           'cess','cessprice','totalamount']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            price = await sync_to_async(PriceGstDetails.objects.create)(
                product_Id=data['product_Id'],
                igst=data['igst'],
                igstprice=data['igstprice'],
                cgst=data['cgst'],
                cgstprice=data['cgstprice'],
                sgst=data['sgst'],
                sgstprice=data['sgstprice'],
                cess=data['cess'],
                cessprice=data['cessprice'],
                totalamount=data['totalamount'],
            )
        except Exception as e:
            logger.error(f"Failed to create product: {str(e)}")
            return JsonResponse({'error': f'Failed to create product Gst details: {str(e)}'}, status=500)
        return JsonResponse({
            'message': 'Product gst details added successfully',
            'product_id': str(price.product_Id),
            'Gstdetails_Id': str(price.Gstdetails_Id),
        }, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def get_priceGstDetails(request):
    return async_to_sync(async_get_price_Gstdetails_by_id)(request)
async def async_get_price_Gstdetails_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id :
            return JsonResponse({'error': 'The product_id query and gstdetail_id parameter is required'}, status=400)

        if not ObjectId.is_valid(product_id) :
            return JsonResponse({'error':' Both Invalid ObjectId format'}, status=400)

        try:
            price = await sync_to_async(PriceGstDetails.objects.get)(product_Id=product_id)
        except PriceDetails.DoesNotExist:
            return JsonResponse({'error': 'gst not found'}, status=404)
        price_data = {
            'product_Id': str(price.product_Id),
            'gstdetail_id': str(price.Gstdetails_Id),
            'igst': price.igst,
            'igstprice': price.igstprice,
            'cgst': price.cgst,
            'cgstprice': price.cgstprice,
            'sgst': price.sgst,
            'sgstprice': price.sgstprice,
            'cess': price.cess,
            'cessprice': price.cessprice,
            'totalamount': price.totalamount,
        }
        return JsonResponse(price_data, status=200)
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_priceGstDetails(request):
    return async_to_sync(async_update_price)(request)
async def async_update_price(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query and gstdetail_idparameter is required'}, status=400)
        if not ObjectId.is_valid(product_id):
            return JsonResponse({'error':' Both Invalid ObjectId format'}, status=400)
        try:
            price = await sync_to_async(PriceGstDetails.objects.get)(product_Id=product_id)
        except PriceDetails.DoesNotExist:
            return JsonResponse({'error': 'gst not found'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)
        updatable_fields =  ['igst','igstprice','cgst','cgstprice','sgst','sgstprice','cess','cessprice','totalamount']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(price, field, data[field])
                updated_fields[field] = data[field]
        await sync_to_async(price.save)()
        return JsonResponse({
            'success': 'Price date updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_priceGstDetails(request):
    return async_to_sync(async_delete_price_gstdetails)(request)
async def async_delete_price_gstdetails(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id :
            return JsonResponse({'error': 'The product_id query and gstdetail_idparameter is required'}, status=400)
        if not ObjectId.is_valid(product_id) :
            return JsonResponse({'error':' Both Invalid ObjectId format'}, status=400)
        try:
            price = await sync_to_async(PriceGstDetails.objects.get)(product_Id=product_id)
        except PriceDetails.DoesNotExist:
            return JsonResponse({'error': 'gst not found'}, status=404)
        try:
            await sync_to_async(price.delete)()
            return JsonResponse({'success': 'Product deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting product: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
    
@csrf_exempt
def add_other_details(request):
    return async_to_sync(async_add_other_details)(request)

async def async_add_other_details(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method. Use POST to add new records.'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['product_id', 'sale_discount_percent', 'low_level_limit', 'select_general', 'serial_no']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            other_details = await sync_to_async(OtherDetails.objects.create)(
                product_id=data['product_id'],
                sale_discount_percent=data['sale_discount_percent'],
                low_level_limit=data['low_level_limit'],
                select_general=data['select_general'],
                serial_no=data['serial_no']
            )
        except Exception as e:
            return JsonResponse({'error': f'Failed to create record: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'Record added successfully',
            'id': other_details.OtherDetails_id 
        }, status=201)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
    
@csrf_exempt
def get_other_details(request):
    return async_to_sync(async_get_other_details_by_id)(request)

async def async_get_other_details_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        other_details_id = request.GET.get('object_id')
        product_id = request.GET.get('product_id')
        if not other_details_id or not product_id:
            return JsonResponse({'error': 'Both id and product_id query parameters are required'}, status=400)
        if not ObjectId.is_valid(product_id) and not ObjectId.is_valid(other_details_id):
            return JsonResponse({'error': 'Invalid ObjectId format for product_id'}, status=400)

        try:
            other_details = await sync_to_async(OtherDetails.objects.get)(product_id=product_id,OtherDetails_id=other_details_id)
        except OtherDetails.DoesNotExist:
            return JsonResponse({'error': 'OtherDetails not found for the provided product_id'}, status=404)

        other_details_data = {
            'product_id': other_details.product_id,
            'sale_discount_percent': convert_decimal(other_details.sale_discount_percent),
            'low_level_limit': other_details.low_level_limit,
            'select_general': other_details.select_general,
            'serial_no': other_details.serial_no,
        }
        return JsonResponse(other_details_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def update_other_details(request):
    return async_to_sync(async_update_other_details)(request)

async def async_update_other_details(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)

        other_details_id = request.GET.get('object_id')
        product_id = request.GET.get('product_id')
        if not other_details_id or not product_id:
            return JsonResponse({'error': 'Both id and product_id query parameters are required'}, status=400)

        if not ObjectId.is_valid(product_id) and not ObjectId.is_valid(other_details_id):
            return JsonResponse({'error': 'Invalid ObjectId format for product_id'}, status=400)

        try:
            other_details = await sync_to_async(OtherDetails.objects.get)(product_id=product_id,OtherDetails_id=other_details_id)
        except OtherDetails.DoesNotExist:
            return JsonResponse({'error': 'OtherDetails not found for the provided product_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = [
            'sale_discount_percent', 'low_level_limit', 'select_general', 'serial_no'
        ]
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                if field == 'sale_discount_percent':
                    try:
                        setattr(other_details, field, Decimal(data[field]))
                    except (ValueError, TypeError):
                        return JsonResponse({'error': f'Invalid value for {field}. Must be a valid decimal number.'}, status=400)
                else:
                    setattr(other_details, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(other_details.save)()
        return JsonResponse({
            'success': 'OtherDetails object updated successfully',
            'updated_fields': updated_fields
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_other_details(request):
    return async_to_sync(async_delete_other_details)(request)

async def async_delete_other_details(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        
        product_id = request.GET.get('product_id')
        other_details_id = request.GET.get('object_id')

        if not product_id or not other_details_id:
            return JsonResponse({'error': 'Both product_id and other_details_id query parameters are required'}, status=400)

        if not ObjectId.is_valid(product_id) or not ObjectId.is_valid(other_details_id):
            return JsonResponse({'error': 'Invalid product_id or other_details_id format'}, status=400)

        try:
            other_details = await sync_to_async(OtherDetails.objects.get)(product_id=product_id, OtherDetails_id=other_details_id)
        except OtherDetails.DoesNotExist:
            return JsonResponse({'error': 'OtherDetails entry not found for the provided product_id and other_details_id'}, status=404)

        try:
            await sync_to_async(other_details.delete)()
            return JsonResponse({'success': 'OtherDetails entry deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting OtherDetails entry: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def add_product_settings(request):
    return async_to_sync(async_add_product_settings)(request)
async def async_add_product_settings(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method. Use POST.'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['product_id', 'print_description', 'one_click_sale', 'enable_tracking', 'print_serial_no', 'not_for_sale']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        try:
            new_product_settings = await sync_to_async(ProductSettings.objects.create)(
                product_id=data['product_id'],
                print_description=data['print_description'],
                one_click_sale=data['one_click_sale'],
                enable_tracking=data['enable_tracking'],
                print_serial_no=data['print_serial_no'],
                not_for_sale=data['not_for_sale']
            )
        except Exception as e:
            return JsonResponse({'error': f'Error creating ProductSettings: {str(e)}'}, status=500)

        return JsonResponse({'message': 'ProductSettings object added successfully', 'setting_id': str(new_product_settings.setting_id)}, status=201)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def get_product_settings(request):
    return async_to_sync(async_get_product_settings_by_id)(request)

async def async_get_product_settings_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

        object_id = request.GET.get('object_id')
        product_id = request.GET.get('product_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(object_id) and not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)

        try:
            product_settings = await sync_to_async(ProductSettings.objects.get)(setting_id=object_id,product_id=product_id)
        except ProductSettings.DoesNotExist:
            return JsonResponse({'error': 'ProductSettings not found'}, status=404)

        product_settings_data = {
            'setting_id': str(product_settings.setting_id),
            'product_id': product_settings.product_id,
            'print_description': product_settings.print_description,
            'one_click_sale': product_settings.one_click_sale,
            'enable_tracking': product_settings.enable_tracking,
            'print_serial_no': product_settings.print_serial_no,
            'not_for_sale': product_settings.not_for_sale
        }
        return JsonResponse(product_settings_data, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def update_product_settings(request):
    return async_to_sync(async_update_product_settings)(request)
async def async_update_product_settings(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        
        setting_id = request.GET.get('object_id')
        product_id = request.GET.get('product_id')
        if not setting_id and not product_id:
            return JsonResponse({'error': 'setting_id and product_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(setting_id) and not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid setting_id format'}, status=400)

        try:
            product_settings = await sync_to_async(ProductSettings.objects.get)(setting_id=setting_id,product_id=product_id)
        except ProductSettings.DoesNotExist:
            return JsonResponse({'error': 'ProductSettings object not found for the provided setting_id'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = [
            'product_id', 'print_description', 'one_click_sale', 
            'enable_tracking', 'print_serial_no', 'not_for_sale'
        ]
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(product_settings, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(product_settings.save)()

        return JsonResponse({
            'success': 'ProductSettings object updated successfully',
            'updated_fields': updated_fields
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def delete_product_settings(request):
    return async_to_sync(async_delete_product_settings)(request)

async def async_delete_product_settings(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        
        object_id = request.GET.get('object_id')
        product_id = request.GET.get('product_id')
        if not object_id and not product_id:
            return JsonResponse({'error': 'object_id and product_id query parameter is required'}, status=400)
        
        if not ObjectId.is_valid(object_id) and not ObjectId.is_valid(product_id):
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)
        
        try:
            product_settings = await sync_to_async(ProductSettings.objects.get)(product_id=product_id,setting_id=object_id)
        except ProductSettings.DoesNotExist:
            return JsonResponse({'error': 'ProductSettings not found for the provided object_id'}, status=404)
        
        try:
            await sync_to_async(product_settings.delete)()
            return JsonResponse({'success': 'ProductSettings deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting ProductSettings: {str(e)}'}, status=500)
    
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def add_brand(request):
    return async_to_sync(async_add_brand)(request)
async def async_add_brand(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method. Use POST to add new records.'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['brand_name']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            product_brand = await sync_to_async(brand.objects.create)(brand_name=data['brand_name'])
        except Exception as e:
            return JsonResponse({'error': f'Failed to create record: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'ProductDescription added successfully',
            'product_id': product_brand.brand_id  
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def get_brand(request):
    return async_to_sync(async_get_brand)(request)
async def async_get_brand(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        object_id = request.GET.get('object_id')
        if  not object_id:
            return JsonResponse({'error': 'The product_id and objectid query parameter is required'}, status=400)
        try:
            product = await sync_to_async(brand.objects.get)(brand_id=object_id)
        except brand.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        product_data = {
            'brand_id': product.brand_id,
            'brand_name': product.brand_name,
        }
        return JsonResponse(product_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_brand(request):
    return async_to_sync(async_update_brand)(request)
async def async_update_brand(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        object_id = request.GET.get('object_id')
        if  not object_id:
            return JsonResponse({'error': 'The product_id and objectid query parameter is required'}, status=400)
        try:
            product_description = await sync_to_async(brand.objects.get)(brand_id=object_id)
        except brand.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = ['brand_name']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(product_description, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(product_description.save)()
        return JsonResponse({
            'success': 'brand updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_brand(request):
    return async_to_sync(async_delete_brand)(request)
async def async_delete_brand(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'The product_id and objectid query parameter is required'}, status=400)

        try:
            product_brand = await sync_to_async(brand.objects.get)(brand_id=object_id)
        except brand.DoesNotExist:
            return JsonResponse({'error': 'Product not found for the provided product_id'}, status=404)
        try:
            await sync_to_async(product_brand.delete)()
            return JsonResponse({'success': 'ProductDescription object deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting ProductDescription object: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def add_e_invoice_details(request):
    return async_to_sync(async_add_e_invoice_details)(request)

async def async_add_e_invoice_details(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['ack_no', 'ack_date', 'irn', 'bill_to_place', 'ship_to_place']
        for field in required_fields:
            if field not in data or not data[field]:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        e_invoice = await sync_to_async(EInvoiceDetails.objects.create)(
            ack_no=data['ack_no'],
            ack_date=data['ack_date'], 
            irn=data['irn'],
            bill_to_place=data['bill_to_place'],
            ship_to_place=data['ship_to_place']
        )

        return JsonResponse(
            {
                'message': 'E-Invoice details added successfully',
                'sale_id': str(e_invoice.sale_id),
                'ack_no': e_invoice.ack_no,
                'irn': e_invoice.irn
            },
            status=201
        )
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def get_e_invoice(request):
    return async_to_sync(async_get_e_invoice_by_id)(request)

async def async_get_e_invoice_by_id(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

        sale_id = request.GET.get('object_id')
        if not sale_id:
            return JsonResponse({'error': 'sale_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(sale_id):
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)

        try:
            e_invoice = await sync_to_async(EInvoiceDetails.objects.get)(sale_id=sale_id)
        except EInvoiceDetails.DoesNotExist:
            return JsonResponse({'error': 'E-Invoice not found'}, status=404)

        e_invoice_data = {
            'sale_id': str(e_invoice.sale_id),
            'ack_no': e_invoice.ack_no,
            'ack_date': str(e_invoice.ack_date) if e_invoice.ack_date else None,
            'irn': e_invoice.irn,
            'bill_to_place': e_invoice.bill_to_place,
            'ship_to_place': e_invoice.ship_to_place,
        }
        return JsonResponse(e_invoice_data, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def update_e_invoice(request):
    return async_to_sync(async_update_e_invoice_details)(request)

async def async_update_e_invoice_details(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)

        sale_id = request.GET.get('object_id')
        if not sale_id:
            return JsonResponse({'error': 'sale_id query parameter is required'}, status=400)

        try:
            sale_id = ObjectId(sale_id)
        except Exception:
            return JsonResponse({'error': 'Invalid sale_id format. Must be a valid ObjectId.'}, status=400)

        try:
            e_invoice = await sync_to_async(EInvoiceDetails.objects.get)(sale_id=sale_id)
        except EInvoiceDetails.DoesNotExist:
            return JsonResponse({'error': 'E-Invoice not found for the provided sale_id'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = ['ack_no', 'ack_date', 'irn', 'bill_to_place', 'ship_to_place']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(e_invoice, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(e_invoice.save)()

        return JsonResponse({
            'message': 'E-Invoice updated successfully',
            'updated_fields': updated_fields
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def delete_e_invoice(request):
    return async_to_sync(async_delete_e_invoice_details)(request)
async def async_delete_e_invoice_details(request):
    try:
        if request.method != "DELETE":
            return JsonResponse({'error': 'Invalid request method. Use DELETE for deletions.'}, status=405)

        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'The object_id query parameter is required.'}, status=400)

        try:
            object_id = ObjectId(object_id)  
        except Exception:
            return JsonResponse({'error': 'Invalid object_id format. Must be a valid ObjectId.'}, status=400)

        try:
            e_invoice = await sync_to_async(EInvoiceDetails.objects.get)(sale_id=object_id)
        except EInvoiceDetails.DoesNotExist:
            return JsonResponse({'error': 'E-Invoice details not found for the provided object_id.'}, status=404)

        try:
            await sync_to_async(e_invoice.delete)()
            return JsonResponse({'success': 'E-Invoice details deleted successfully.'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting E-Invoice details: {str(e)}'}, status=500)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def add_e_way_bill(request):
    return async_to_sync(async_add_eway_bill)(request)
async def async_add_eway_bill(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error':'Invalid request Methods'})
        try:
            data= json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error':f'Invalid Json Payload'})
        request_field=['eway_bill_no','date','dispatch_from','ship_to','transporter_name',
                       'transport_id','mode','doc_or_airway_no','vehicle_number','vehicle_date','vehicle_type']
        for feilds in request_field:
            if feilds  not in data or not data[feilds]:
                return JsonResponse({'error':f'Missng requirement feilds'})
        e_way_bill= await sync_to_async(EWayBill.objects.create)(
            eway_bill_no=data['eway_bill_no'],
            date=data['date'],
            dispatch_from=data['dispatch_from'],
            ship_to=data['ship_to'],
            transporter_name=data['transporter_name'],
            transport_id=data['transport_id'],
            mode=data['mode'],
            doc_or_airway_no=data['doc_or_airway_no'],
            vehicle_number=data['vehicle_number'],
            vehicle_date=data['vehicle_date'],
            vehicle_type=data['vehicle_type'],
        )
        return JsonResponse({'message':'Successufully','sale_id':e_way_bill.sale_id},status=200)
    except Exception as e:
        return JsonResponse({'error':f'an unexpected error:{str(e)}'},status=500)
@csrf_exempt
def get_e_way_bill(request):
    return async_to_sync(async_get_ewaybill)(request)
async def async_get_ewaybill(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error':f'Invalid request Methods'},status=405)
        sale_id=request.GET.get('object_id')
        if  not sale_id:
            return JsonResponse({'error':f'sale_id query parameter is required'}, status=400)
        if not ObjectId.is_valid(sale_id):
            return JsonResponse({'error':f'Invalid ObjectId format'},status=400)
        try:
            get_records= await sync_to_async(EWayBill.objects.get)(sale_id=sale_id)
        except EWayBill.DoesNotExist:
            return JsonResponse({'error':f'Data not found'},status=404)
        get_record_details={
            'sale_id':str(get_records.sale_id),
            'eway_bill_no': get_records.eway_bill_no,
            'date':get_records.date,
            'dispatch_from':get_records.dispatch_from,
            'ship_to':get_records.ship_to,
            'transporter_name':get_records.transporter_name,
            'transport_id':get_records.transport_id,
            'mode':get_records.mode,
            'doc_or_airway_no':get_records.doc_or_airway_no,
            'vehicle_number':get_records.vehicle_number,
            'vehicle_date':get_records.vehicle_date,
            'vehicle_type':get_records.vehicle_type,
        }
        return JsonResponse(get_record_details,status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error (str{e})'},status=500)
@csrf_exempt
def update_e_way_bill(request):
    return async_to_sync(async_update_ewaybill)(request)
async def async_update_ewaybill(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error':f'Invalid request format'},status=405)
        sale_id= request.GET.get('object_id')
        if not sale_id:
            return JsonResponse({'error':f'Missing query method values'},status=405)
        try:
            sale_id= ObjectId(sale_id)
        except Exception:
            return JsonResponse({'error':f'Invalid sale_id format. Must be a valid ObjectId '})
        try:
            update_record= await sync_to_async(EWayBill.objects.get)(sale_id=sale_id)
        except EWayBill.DoesNotExist:
            return JsonResponse({'error':f'data not found'},status=404)
        try: 
            data= json.loads(request.body)
        except json.JSONDecodeError:
            return  JsonResponse({'error':f'Invalid payload format'},status=400)
        request_field=['eway_bill_no','date','dispatch_from','ship_to','transporter_name',
                       'transport_id','mode','doc_or_airway_no','vehicle_number','vehicle_date','vehicle_type']
        update_feilds={}
        for feilds in request_field:
            if feilds in  data:
                setattr(update_record, feilds,data[feilds])
                update_feilds[feilds]=data[feilds]
        await sync_to_async(update_record.save)()
        return JsonResponse({'success':f'Update Successfully','update_dates':update_feilds},status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error (str{e})'},status=500)
@csrf_exempt
def delete_e_way_bill(request):
    return async_to_sync(async_delete_ewaybill)(request)
async def async_delete_ewaybill(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error':f'Invalid Request format'},status=405)
        sale_id=request.GET.get('object_id')
        if not sale_id:
            return JsonResponse({'error':f'Missing query value'},status=400)
        if not ObjectId.is_valid(sale_id):
            return JsonResponse({'error':f'Missing object_id format'},status=400)
        try:
            ewaybill= await sync_to_async(EWayBill.objects.get)(sale_id=sale_id)
        except EWayBill.DoesNotExist:
            return JsonResponse({'error':f'Data not found'},status=404)
        try:
            await sync_to_async(ewaybill.delete)()
            return JsonResponse({'success':f'Data delete succesfully'},status=200)
        except Exception as e:
            return JsonResponse({'error':f'Error deleting E Way bill (str{e})'},status=500)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error (str{e})'},status=500)

@csrf_exempt
def add_employee_details(request):
    return async_to_sync(async_add_employee)(request)
async def async_add_employee(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

        required_fields = ['name', 'gender', 'date_of_birth', 'email', 
                           'phone_number', 'role', 'salary', 'address']
        for field in required_fields:
            if field not in data or not data[field]:
                return JsonResponse({'error': f'Missing or empty required field: {field}'}, status=400)

        try:
            salary = float(data['salary'])
            if salary <= 0:
                return JsonResponse({'error': 'Salary must be a positive number.'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'Invalid salary format.'}, status=400)

        try:
            employee = await sync_to_async(Employee.objects.create)(
                name=data['name'],
                gender=data['gender'],
                date_of_birth=data['date_of_birth'],
                email=data['email'],
                phone_number=data['phone_number'],
                role=data['role'],
                salary=salary,
                address=data['address']
            )
        except Exception as e:
            logger.error(f"Failed to create employee: {str(e)}")
            return JsonResponse({'error': f'Failed to create employee: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'Employee added successfully.',
            'employee_id': str(employee.employee_id)
        }, status=201)
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def get_employee(request):
    return async_to_sync(async_get_employee_by_id)(request)
async def async_get_employee_by_id(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)
        
        employee_id = request.GET.get('object_id')
        if not employee_id:
            return JsonResponse({'error': 'employee_id query parameter is required.'}, status=400)
        
        try:
            employee = await sync_to_async(Employee.objects.get)(employee_id=employee_id)
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Employee not found.'}, status=404)
        
        employee_data = {
            'employee_id': employee.employee_id,
            'name': employee.name,
            'gender': employee.gender,
            'date_of_birth': employee.date_of_birth.isoformat(),
            'email': employee.email,
            'phone_number': employee.phone_number,
            'role': employee.role,
            'date_joined': employee.date_joined.isoformat(),
            'salary': str(employee.salary), 
            'address': employee.address,
        }
        return JsonResponse(employee_data, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_employee(request):
    return async_to_sync(async_update_employee)(request)
async def async_update_employee(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error': 'Invalid request method, only PUT is allowed'}, status=405)

        employee_id = request.GET.get('object_id')
        if not employee_id:
            return JsonResponse({'error': 'Missing employee_id query parameter'}, status=400)

        try:
            ObjectId(employee_id)
        except Exception:
            return JsonResponse({'error': 'Invalid employee_id format. Must be a valid ObjectId.'}, status=400)

        try:
            employee_record = await sync_to_async(Employee.objects.get)(employee_id=employee_id)
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Employee not found.'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

        updatable_fields = ['name', 'gender', 'date_of_birth', 'email', 'phone_number', 'role', 'salary', 'address']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(employee_record, field, data[field])
                updated_fields[field] = data[field]
        await sync_to_async(employee_record.save)()

        return JsonResponse({'success': 'Employee updated successfully.', 'updated_fields': updated_fields}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def delete_employee(request):
    return async_to_sync(async_delete_employee)(request)
async def async_delete_employee(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error': 'Invalid request method, only DELETE is allowed'}, status=405)
        employee_id = request.GET.get('object_id')
        if not employee_id:
            return JsonResponse({'error': 'Missing required query parameter: object_id'}, status=400)
        try:
            employee = await sync_to_async(Employee.objects.get)(employee_id=employee_id)
        except Employee.DoesNotExist:
            return JsonResponse({'error': 'Employee not found'}, status=404)
        try:
            await sync_to_async(employee.delete)()
            return JsonResponse({'success': f'Employee deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting employee: {str(e)}'}, status=500)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def get_report_details(request):
    return async_to_sync(async_get_report_details)(request)
async def async_get_report_details(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)
        product_id = request.GET.get('object_id')
        if not product_id:
            return JsonResponse({'error': 'The product_id query parameter is required'}, status=400)
        products = await sync_to_async(list, thread_sensitive=True)(ProductDetails.objects.filter(Customer_Id=product_id))
        if not products:
            return JsonResponse({'error': 'No products found for this Customer_Id'}, status=404)
        product_list = []
        for product in products:
            stock = await sync_to_async(StockDetails.objects.filter(product_Id=product.product_Id).first, thread_sensitive=True)()
            price = await sync_to_async(PriceDetails.objects.filter(product_Id=product.product_Id).first, thread_sensitive=True)()
            price_gst = await sync_to_async(PriceGstDetails.objects.filter(product_Id=product.product_Id).first, thread_sensitive=True)()

            product_list.append({
                "product_details": {
                    "product_Id": str(product.product_Id),
                    "Customer_Id": str(product.Customer_Id),
                    "product_name": product.product_name,
                    "category": product.category,
                    "subcategory": product.subcategory,
                    "brand": product.brand,
                    "unit": product.unit,
                    "product_code": product.product_code,
                    "description": product.description,
                    "img": product.img
                },
                "stock_details": {
                    "StockDetails_id": stock.StockDetails_id if stock else None,
                    "opening_stock": stock.opening_stock if stock else None,
                    "opening_stock_values": stock.opening_stock_values if stock else None,
                    "low_stock_qty": stock.low_stock_qty if stock else None,
                    "date": stock.date if stock else None,
                    "location": stock.location if stock else None
                } if stock else None,
                "price_details": {
                    "PurchasePrice": price.PurchasePrice if price else None,
                    "SalePrice": price.SalePrice if price else None,
                    "Min_Sale_Price": price.Min_Sale_Price if price else None,
                    "MRP": price.MRP if price else None,
                    "hsn_sac_code": price.hsn_sac_code if price else None,
                    "discount": price.discount if price else None
                } if price else None,
                "price_gst_details": {
                    "igst": price_gst.igst if price_gst else None,
                    "igstprice": price_gst.igstprice if price_gst else None,
                    "cgst": price_gst.cgst if price_gst else None,
                    "cgstprice": price_gst.cgstprice if price_gst else None,
                    "sgst": price_gst.sgst if price_gst else None,
                    "sgstprice": price_gst.sgstprice if price_gst else None,
                    "cess": price_gst.cess if price_gst else None,
                    "cessprice": price_gst.cessprice if price_gst else None,
                    "totalamount": price_gst.totalamount if price_gst else None
                } if price_gst else None
            })
        return JsonResponse({"products": product_list}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def add_admin(request):
    return async_to_sync(async_add_admin)(request)
@csrf_exempt
async def async_add_admin(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method, only POST is allowed'}, status=405)

        try:
            
            data = json.loads(request.body)
            print(f'request.body{request.body}')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = [
            'email', 'password_hash', 'full_name', 'hardware_signature'
        ]

        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        email_exists = await sync_to_async(Admin.objects.filter(email=data['email']).exists)()
        if email_exists:
            return JsonResponse({'error': 'Email already exists'}, status=400)

        hardware_signature_exists = await sync_to_async(Admin.objects.filter(hardware_signature=data['hardware_signature']).exists)()
        if hardware_signature_exists:
            return JsonResponse({'error': 'Hardware signature already exists'}, status=400)
        haspawrd= make_password(data['password_hash'])
        try:
            admin = await sync_to_async(Admin.objects.create)(
                email=data['email'],
                password_hash=haspawrd,
                full_name=data['full_name'],
                hardware_signature=data['hardware_signature']
            )
        except Exception as e:
            logger.error(f"Failed to create admin: {str(e)}")
            return JsonResponse({'error': f'Failed to create admin: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'Admin created successfully',
            'admin_id': admin.admin_id
        }, status=201)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
@csrf_exempt
def get_admin(request):
    return async_to_sync(async_get_admin_by_id)(request)
async def async_get_admin_by_id(request):
    try:
        # Check if the request method is GET
        if request.method != 'GET':
            return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)

        # Get the admin_id from query parameters
        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'admin_id query parameter is required.'}, status=400)

        # Fetch the admin record by admin_id
        try:
            admin = await sync_to_async(Admin.objects.get)(admin_id=admin_id)
        except Admin.DoesNotExist:
            return JsonResponse({'error': 'Admin not found.'}, status=404)

        # Prepare the admin data for response
        admin_data = {
            'admin_id': admin.admin_id,
            'email': admin.email,
            'full_name': admin.full_name,
            'created_at': admin.created_at.isoformat(),
            'last_login': admin.last_login.isoformat() if admin.last_login else None,
            'is_active': admin.is_active,
            'hardware_signature': admin.hardware_signature,
        }

        # Return the admin data
        return JsonResponse(admin_data, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_admin(request):
    return async_to_sync(async_update_admin)(request)
async def async_update_admin(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error': 'Invalid request method, only PUT is allowed'}, status=405)

        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'Missing admin_id query parameter'}, status=400)

        try:
            admin_record = await sync_to_async(Admin.objects.get)(admin_id=admin_id)
        except Admin.DoesNotExist:
            return JsonResponse({'error': 'Admin not found.'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

        updatable_fields = [
            'email', 'password_hash', 'full_name', 'is_active', 'hardware_signature'
        ]
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(admin_record, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(admin_record.save)()

        return JsonResponse({
            'success': 'Admin updated successfully.',
            'updated_fields': updated_fields
        }, status=200)
    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_admin(request):
    return async_to_sync(async_delete_admin)(request)
async def async_delete_admin(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error': 'Invalid request method, only DELETE is allowed'}, status=405)

        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'Missing required query parameter: admin_id'}, status=400)

        try:
            admin = await sync_to_async(Admin.objects.get)(admin_id=admin_id)
        except Admin.DoesNotExist:
            return JsonResponse({'error': 'Admin not found'}, status=404)

        try:
            await sync_to_async(admin.delete)()
            return JsonResponse({'success': 'Admin deleted successfully'}, status=200)
        except Exception as e:
            logger.error(f"Error deleting admin: {str(e)}")
            return JsonResponse({'error': f'Error deleting admin: {str(e)}'}, status=500)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def add_subscription_plan(request):
    return async_to_sync(async_add_subscription_plan)(request)
@csrf_exempt
async def async_add_subscription_plan(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method, only POST is allowed'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['admin_id', 'plan_name', 'duration_days', 'starting_days', 'price'] 

        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        try:
            duration_days = int(data['duration_days']) 
            starting_days_str = data['starting_days'] 
            starting_days = datetime.strptime(starting_days_str, '%d/%m/%Y').date()
        except ValueError:
            return JsonResponse({'error': 'Invalid duration_days (integer) or starting_days (DD/MM/YYYY) format'}, status=400)
        ending_days = starting_days + timedelta(days=duration_days) 
        try:
            subscription_plan = await sync_to_async(SubscriptionPlan.objects.create)(
                admin_id=data['admin_id'],
                plan_name=data['plan_name'],
                duration_days=duration_days,
                starting_days = starting_days,
                ending_days=ending_days,
                price=data['price'],
                description=data.get('description', ''),
                is_active=data.get('is_active', True)
            )
        except Exception as e:
            logger.error(f"Failed to create subscription plan: {str(e)}")
            return JsonResponse({'error': f'Failed to create subscription plan: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'Subscription plan created successfully',
            'plan_id': subscription_plan.plan_id,
            'admin_id': subscription_plan.admin_id,
        }, status=201)

    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
    
def get_subscription_plan(request):
    return async_to_sync(async_get_subscription_plan_by_id)(request)
async def async_get_subscription_plan_by_id(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)

        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'plan_id query parameter is required.'}, status=400)

        try:
            subscription_plan = await sync_to_async(SubscriptionPlan.objects.get)(admin_id=admin_id)
        except SubscriptionPlan.DoesNotExist:
            return JsonResponse({'error': 'Subscription Plan not found.'}, status=404)
        price_value = (
            float(subscription_plan.price.to_decimal()) 
            if isinstance(subscription_plan.price, Decimal128) 
            else float(subscription_plan.price)
        )
        subscription_plan_data = {
            'plan_id': subscription_plan.plan_id,
            'admin_id': subscription_plan.admin_id,
            'plan_name': subscription_plan.plan_name,
            'duration_days': subscription_plan.duration_days,
            'starting_days':subscription_plan.starting_days,
            'ending_days':subscription_plan.ending_days,
            'price': price_value,
            'description': subscription_plan.description,
            'is_active': subscription_plan.is_active,
        }

        return JsonResponse(subscription_plan_data, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
    
@csrf_exempt
def update_subscription_plan(request):
    return async_to_sync(async_update_subscription_plan)(request)

async def async_update_subscription_plan(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error': 'Invalid request method, only PUT is allowed'}, status=405)

        admin_id = request.GET.get('object_id')  # Use 'plan_id' as the query parameter name. More conventional.
        if not admin_id:
            return JsonResponse({'error': 'Missing admin_id query parameter'}, status=400)

        try:
            subscription_plan = await sync_to_async(SubscriptionPlan.objects.get)(admin_id=admin_id) #Use plan_id to get plan details
        except SubscriptionPlan.DoesNotExist:
            return JsonResponse({'error': 'Subscription plan not found.'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

        updatable_fields = ['admin_id', 'plan_name', 'duration_days', 'starting_days', 'price', 'description', 'is_active']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                if field == 'duration_days':
                    try:
                        duration_days = int(data['duration_days'])
                        subscription_plan.duration_days = duration_days
                        updated_fields['duration_days'] = duration_days
                    except ValueError:
                        return JsonResponse({'error': 'Invalid duration_days format (integer)'}, status=400)

                    if 'starting_days' in data:  # Recalculate ending_days if starting_days is also updated
                        try:
                            starting_days_str = data['starting_days']
                            starting_days = datetime.strptime(starting_days_str, '%d/%m/%Y').date()
                            subscription_plan.starting_days = starting_days
                            updated_fields['starting_days'] = starting_days_str #send to frontend as string
                            ending_days = starting_days + timedelta(days=duration_days)
                            subscription_plan.ending_days = ending_days
                            updated_fields['ending_days'] = ending_days.strftime('%Y-%m-%d') #send to frontend as string
                        except ValueError:
                            return JsonResponse({'error': 'Invalid starting_days format (DD/MM/YYYY)'}, status=400)
                    elif hasattr(subscription_plan, 'starting_days') and subscription_plan.starting_days is not None: # Recalculate ending_days if only duration_days is updated
                        ending_days = subscription_plan.starting_days + timedelta(days=duration_days)
                        subscription_plan.ending_days = ending_days
                        updated_fields['ending_days'] = ending_days.strftime('%Y-%m-%d') #send to frontend as string

                elif field == 'starting_days':
                    try:
                        starting_days_str = data['starting_days']
                        starting_days = datetime.strptime(starting_days_str, '%d/%m/%Y').date()
                        subscription_plan.starting_days = starting_days
                        updated_fields['starting_days'] = starting_days_str #send to frontend as string

                        if hasattr(subscription_plan, 'duration_days') and subscription_plan.duration_days is not None: # Recalculate ending_days if duration_days exists
                            ending_days = starting_days + timedelta(days=subscription_plan.duration_days)
                            subscription_plan.ending_days = ending_days
                            updated_fields['ending_days'] = ending_days.strftime('%Y-%m-%d') #send to frontend as string

                    except ValueError:
                        return JsonResponse({'error': 'Invalid starting_days format (DD/MM/YYYY)'}, status=400)

                elif field == 'price': #Price validation
                    try:
                        price = data['price']
                        subscription_plan.price = price
                        updated_fields['price'] = price
                    except ValueError:
                        return JsonResponse({'error': 'Invalid price format (decimal)'}, status=400)


                else:
                    setattr(subscription_plan, field, data[field])
                    updated_fields[field] = data[field]

        await sync_to_async(subscription_plan.save)()

        return JsonResponse({
            'success': 'Subscription plan updated successfully.',
            'updated_fields': updated_fields
        }, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def delete_subscription_plan(request):
    return async_to_sync(async_delete_subscription_plan)(request)

async def async_delete_subscription_plan(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error': 'Invalid request method, only DELETE is allowed'}, status=405)

        plan_id = request.GET.get('object_id')
        if not plan_id:
            return JsonResponse({'error': 'Missing plan_id query parameter'}, status=400)

        try:
            subscription_plan = await sync_to_async(SubscriptionPlan.objects.get)(admin_id=plan_id)
        except SubscriptionPlan.DoesNotExist:
            return JsonResponse({'error': 'Subscription plan not found.'}, status=404)

        await sync_to_async(subscription_plan.delete)()

        return JsonResponse({'success': 'Subscription plan deleted successfully.'}, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
SECRET_KEY = 'abcd1234'
@csrf_exempt
def add_license(request):
    return async_to_sync(async_add_license)(request)
async def async_add_license(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request method, only POST is allowed'}, status=405)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['admin_id', 'plan_id', 'license_key', 'expiry_date', 'hardware_signature']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        license_exists = await sync_to_async(License.objects.filter(license_key=data['license_key']).exists)()
        if license_exists:
            return JsonResponse({'error': 'License key already exists'}, status=400)

        try:
            expiry_days = int(data['expiry_date']) 
            expiry_date = datetime.now() + timedelta(days=expiry_days) 
            
            expiry_date = timezone.make_aware(expiry_date)
        except ValueError as e:
            logger.error(f"Invalid expiry_date format: {data['expiry_date']} - {str(e)}")
            return JsonResponse({'error': 'Invalid expiry_date format, must be a number'}, status=400)

        payload = {
            'license_key': data['license_key'],
            'expiry_date': expiry_date.isoformat(), }

        try:
            access_token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        except Exception as e:
            logger.error(f"Failed to create JWT token: {str(e)}")
            return JsonResponse({'error': f'Failed to create JWT token: {str(e)}'}, status=500)

        try:
            license = await sync_to_async(License.objects.create)(
                admin_id=data['admin_id'],
                plan_id=data['plan_id'],
                license_key=access_token, 
                expiry_date=expiry_date,
                hardware_signature=data['hardware_signature'],
                is_active=data.get('is_active', True)
            )
        except Exception as e:
            logger.error(f"Failed to create license: {str(e)}")  
            return JsonResponse({'error': f'Failed to create license: {str(e)}'}, status=500)

        return JsonResponse({
            'message': 'License created successfully',
            'license_id': license.license_id,
            'access_token': access_token, 
        }, status=201)
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=500)
@csrf_exempt
def get_license(request):
    return async_to_sync(async_get_license_by_admin_id)(request)

async def async_get_license_by_admin_id(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)

        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'admin_id query parameter is required.'}, status=400)

        licenses = await sync_to_async(list)(License.objects.filter(admin_id=admin_id))
        if not licenses:
            return JsonResponse({'error': 'No licenses found for this admin_id.'}, status=404)

        license_data_list = []
        for license_obj in licenses:
            try:
                decoded_payload = jwt.decode(license_obj.license_key, SECRET_KEY, algorithms=['HS256'])
                decoded_license_key = decoded_payload.get('license_key')
                decoded_expiry_date = decoded_payload.get('expiry_date')
            except jwt.ExpiredSignatureError:
                return JsonResponse({'error': 'JWT token has expired.'}, status=400)
            except jwt.InvalidTokenError:
                return JsonResponse({'error': 'Invalid JWT token.'}, status=400)

            stored_payload = jwt.decode(license_obj.license_key, SECRET_KEY, algorithms=['HS256'])
            stored_license_key = stored_payload.get('license_key')

            if decoded_license_key != stored_license_key:
                return JsonResponse({'error': 'License key does not match.'}, status=400)

            expiry_date = datetime.fromisoformat(decoded_expiry_date)
            if expiry_date < timezone.now():
                return JsonResponse({'error': 'License has expired.'}, status=400)

            license_data_list.append({
                'license_id': license_obj.license_id,
                'admin_id': license_obj.admin_id,
                'plan_id': license_obj.plan_id,
                'license_key': decoded_license_key,  
                'expiry_date': decoded_expiry_date,
                'is_active': license_obj.is_active,
                'hardware_signature': license_obj.hardware_signature,
                'created_at': license_obj.created_at.isoformat(),
                'last_validated': license_obj.last_validated.isoformat() if license_obj.last_validated else None
            })

        return JsonResponse({'message': 'Licenses retrieved successfully', 'data': license_data_list}, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def update_license(request):
    return async_to_sync(async_update_license)(request)

async def async_update_license(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error': 'Invalid request method, only PUT is allowed'}, status=405)

        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'Missing admin_id query parameter'}, status=400)
        try:
            admin_id = ObjectId(admin_id)
        except Exception as e:
            return JsonResponse({'error': f'Invalid ObjectId format: {str(e)}'}, status=400)

        try:
            license_record = await sync_to_async(License.objects.get)(admin_id=str(admin_id))
        except License.DoesNotExist:
            return JsonResponse({'error': 'License not found for this admin_id.'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

        updatable_fields = ['admin_id','plan_id', 'license_key', 'expiry_date', 'hardware_signature', 'is_active']
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                if field == 'expiry_date': 
                    try:
                        expiry_days = int(data['expiry_date']) 
                        expiry_date = datetime.now() + timedelta(days=expiry_days)
                        license_record.expiry_date = timezone.make_aware(expiry_date)
                    except ValueError:
                        return JsonResponse({'error': 'Invalid expiry_date format. Must be a number.'}, status=400)
                else:
                    setattr(license_record, field, data[field])
                updated_fields[field] = data[field]

        payload = {
            'license_key': license_record.license_key, 
            'expiry_date': license_record.expiry_date.isoformat(), 
        }

        try:
            new_license_key = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
            license_record.license_key = new_license_key 
        except Exception as e:
            logger.error(f"Failed to regenerate JWT token: {str(e)}")
            return JsonResponse({'error': f'Failed to regenerate JWT token: {str(e)}'}, status=500)

        await sync_to_async(license_record.save)()

        return JsonResponse({
            'success': 'License updated successfully.',
            'updated_fields': updated_fields,
            'new_license_key': new_license_key 
        }, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def delete_license(request):
    return async_to_sync(async_delete_license)(request)

async def async_delete_license(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error': 'Invalid request method, only DELETE is allowed'}, status=405)

        admin_id = request.GET.get('object_id')
        if not admin_id:
            return JsonResponse({'error': 'Missing admin_id query parameter'}, status=400)

        try:
            admin_id = ObjectId(admin_id)
        except Exception as e:
            return JsonResponse({'error': f'Invalid ObjectId format: {str(e)}'}, status=400)

        try:
            license_record = await sync_to_async(License.objects.get)(admin_id=str(admin_id))
        except License.DoesNotExist:
            return JsonResponse({'error': 'License not found for this admin_id.'}, status=404)

        await sync_to_async(license_record.delete)()

        return JsonResponse({'success': 'License deleted successfully.'}, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

# Razorpay credentials
RAZORPAY_KEY_ID = 'rzp_test_E4TFGlnH1iR5y8'
RAZORPAY_KEY_SECRET = '0UQJuvnQb2ojOwMfxpTasFnn'
RAZORPAY_WEBHOOK_SECRET = 'ftJwm@9j9pwG@3C'

# Initialize Razorpay client
client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@csrf_exempt
def razorpay_webhook(request):
    if request.method == 'POST':
        if 'razorpay_payment_id' in request.body.decode('utf-8'):
            # Handle Webhook (Payment Status)
            return razorpay_webhooks(request)
        else:
            # Handle Payment Creation
            return create_payment(request)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)
@csrf_exempt
def create_payment(request):
    try:
        data = json.loads(request.body)
        required_fields = ['admin_id', 'plan_id', 'amount', 'currency', 'transaction_id']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        
        generated_signature = hmac.new(
            RAZORPAY_WEBHOOK_SECRET.encode(),
            request.body,
            hashlib.sha256
        ).hexdigest()
        # ref=razorpay_webhook(generated_signature)
        # Convert amount to paise
        order_amount = int(float(data['amount']) * 100)
        order_currency = data['currency']
        order_receipt = data['transaction_id']

        # Create Razorpay order
        razorpay_order = client.order.create({
            'amount': order_amount,
            'currency': order_currency,
            'receipt': order_receipt,
            'payment_capture': 1  # Auto-capture
        })

        # Save payment in the database
        payment = Payment.objects.create(
            payment_id=razorpay_order['id'],
            admin_id=data['admin_id'],
            plan_id=data['plan_id'],
            amount=data['amount'],
            currency=data['currency'],
            payment_gateway='Razorpay',
            transaction_id=data['transaction_id'],
            status='created'
        )

        return JsonResponse({
            'message': 'Payment created successfully',
            'order_id': razorpay_order['id'],
            'key_id': RAZORPAY_KEY_ID,  # Send the key to frontend for payment
            'generated_signature': generated_signature
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def razorpay_webhooks(request):
    try:
        webhook_body = request.body  # Raw request body
        print(f'webhook_body: {webhook_body}')
        print(f"Received Headers: {dict(request.headers)}")

        webhook_signature = request.headers.get("X-Razorpay-Signature")  # Get signature from header
        print(f'webhook_signature: {webhook_signature}')
        
        # Validate webhook signature
        if not verify_signature(webhook_body, webhook_signature):
            return JsonResponse({'error': 'Invalid signature'}, status=400)

        # Parse the webhook event
        data = json.loads(webhook_body)
        payment_status = data.get('payload', {}).get('payment', {}).get('entity', {}).get('status')

        # If payment status is captured, update the payment record
        if payment_status == 'captured':
            payment_id = data['payload']['payment']['entity']['id']
            payment = Payment.objects.filter(payment_id=payment_id).first()
            if payment:
                payment.status = 'captured'
                payment.save()

        return JsonResponse({'message': 'Webhook processed successfully'}, status=200)

    except Exception as e:
        return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

def verify_signature(webhook_body, webhook_signature):
    expected_signature = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode(),
        webhook_body,
        hashlib.sha256
    ).hexdigest()
    print(f'signature generated key: {expected_signature}')
    return expected_signature == webhook_signature

@csrf_exempt
def create_notification(request):
    return async_to_sync(async_create_notification)(request)

async def async_create_notification(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method, only POST is allowed'}, status=405)

    try:
        data = json.loads(request.body)
        required_fields = ['admin_id', 'type', 'message']
        for field in required_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        admin_id, type, message = data['admin_id'], data['type'], data['message']

        try:
            admin = await sync_to_async(Admin.objects.get)(admin_id=admin_id) 
            user_email = admin.email  
        except Admin.DoesNotExist:
            return JsonResponse({'error': 'Admin not found'}, status=404)

        try:
            subscription_plan = await sync_to_async(SubscriptionPlan.objects.get)(admin_id=admin_id)
            ending_days = subscription_plan.ending_days  
        except SubscriptionPlan.DoesNotExist:
            return JsonResponse({'error': 'Subscription Plan not found'}, status=404)

        today = date.today()
        ending_days_date = ending_days.date()  
        time_difference = ending_days_date - today  

        email_subject = None
        email_body = None

        if time_difference == timedelta(days=7):
            email_subject = "Your subscription will expire in 7 days"
            email_body = f"Reminder: Your subscription will expire in 7 days. Please renew it soon."

        elif time_difference == timedelta(days=3):
            email_subject = "Your subscription will expire in 3 days!"
            email_body = f"Alert: Your subscription is expiring in 3 days. Renew now to avoid service interruption."

        elif time_difference == timedelta(days=0):
            email_subject = "Your subscription has expired today!"
            email_body = f"Your subscription has expired today. You have 48 hours to renew before your account is locked."

        elif time_difference == timedelta(days=-2):
            email_subject = "Your subscription has expired. Account locked!"
            email_body = f"Your subscription expired 48 hours ago, and your account is now locked. Renew to regain access."

        if email_subject and email_body:
            try:
                notification = await sync_to_async(Notification.objects.create)(
                    admin_id=admin_id, type=type, message=email_body
                )
                send_mail(
                    subject=email_subject,
                    message=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[user_email],
                    fail_silently=False,  
                )
                return JsonResponse({'message': 'Notification created and email sent'}, status=201)
            except Exception as e:
                return JsonResponse({'error': f'Error creating notification or sending email: {str(e)}'}, status=500)
        
        return JsonResponse({'message': 'No notification required today'}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def get_notification(request):
    return async_to_sync(async_get_notification)(request)

async def async_get_notification(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error': 'Invalid request method. Only GET is allowed.'}, status=405)

        notification_id = request.GET.get('object_id') 
        if not notification_id:
            return JsonResponse({'error': 'notification_id query parameter is required.'}, status=400)

        try:
            notification = await sync_to_async(Notification.objects.get)(admin_id=notification_id)
        except Notification.DoesNotExist:
            return JsonResponse({'error': 'Notification not found.'}, status=404)

        notification_data = {
            'notification_id': notification.notification_id,
            'admin_id': notification.admin_id,
            'type': notification.type,
            'message': notification.message,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat(),  # Serialize datetime object
        }

        return JsonResponse(notification_data, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def update_notification(request):
    return async_to_sync(async_update_notification)(request)

async def async_update_notification(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error': 'Invalid request method. Only PUT is allowed.'}, status=405)

        notification_id = request.GET.get('object_id')  # Get notification_id from query params
        if not notification_id:
            return JsonResponse({'error': 'notification_id query parameter is required.'}, status=400)

        try:
            notification = await sync_to_async(Notification.objects.get)(admin_id=notification_id)
        except Notification.DoesNotExist:
            return JsonResponse({'error': 'Notification not found.'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload.'}, status=400)

        updatable_fields = ['admin_id', 'type', 'message', 'is_read']  # Add is_read
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                setattr(notification, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(notification.save)()

        return JsonResponse({
            'message': 'Notification updated successfully.',
            'updated_fields': updated_fields
        }, status=200)

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)
@csrf_exempt
def delete_notification(request):
    return async_to_sync(async_delete_notification)(request)

async def async_delete_notification(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error': 'Invalid request method. Only DELETE is allowed.'}, status=405)

        object_id = request.GET.get('object_id') 
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required.'}, status=400)

        try:
            notification = await sync_to_async(Notification.objects.get)(admin_id=object_id)
        except Notification.DoesNotExist:
            return JsonResponse({'error': 'Notification not found.'}, status=404)

        await sync_to_async(notification.delete)() 
        return JsonResponse({'message': 'Notification deleted successfully.'}, status=204) 

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def Customer_add(request):
    return async_to_sync(async_add_customer)(request)
async  def async_add_customer(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error':f'Invalid request method POST only'},status=500)
        data= json.loads(request.body)
        print('datas from frond end {data}')
        request_fields =  ['User_id','customer_name','mobile_no','email','address','area','pincode',
                    'state','opening_balance','balance_amount','gst_number']
        for field in request_fields:
            if field not in data:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
            
        try:
            # check= await sync_to_async(Customer.objects.get)(mobile_no=data['mobile_no'])
            check_email = await  sync_to_async(Customer.objects.get)(
                Q(email = data['email'])) or Q(mobile_no= data['mobile_no'])
            return JsonResponse({'error':f'mobile_no or email number already exist'},status=400)
        except Customer.DoesNotExist:
            pass
            await sync_to_async(Customer.objects.create)(
                User_id= data['User_id'],
                customer_name= data['customer_name'],
                mobile_no= data['mobile_no'],
                email= data['email'],
                address= data['address'],
                area= data['area'],
                pincode= data['pincode'],
                state= data['state'],
                opening_balance= data['opening_balance'],
                balance_amount= data['balance_amount'],
                gst_number= data['gst_number'],
            )
        return JsonResponse({'sucess':f'successfully create'},status=200)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
    except Exception as e:
        return JsonResponse({'erorr':f'An un expected error:{e}'},status=500)


def Customer_get(request):
    return async_to_sync(async_get_customer)(request)
async def async_get_customer(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error':f'Invalid request method, only GET allowed'},status=400)
        user_id= request.GET.get('object_id')
        if not user_id:
            return JsonResponse({'error':f'user id requerment'},status=400)
        try:
            datas = await sync_to_async(Customer.objects.get)(User_id=user_id)
        except Customer.DoesNotExist:
            return JsonResponse({'error':f'User not found'},status=404)
        Customer_date={
            'Customer_id' :datas.Customer_id,
            'User_id' : datas.User_id,
            'customer_name' : datas.customer_name,
            'mobile_no' : datas.mobile_no,
            'email' : datas.email,
            'address' : datas.address,
            'area' : datas.area,
            'pincode' : datas.pincode,
            'state' : datas.state,
            'opening_balance' : convert_decimal(datas.opening_balance),
            'balance_amount' : convert_decimal(datas.balance_amount),
            'gst_number' : datas.gst_number, 
        }
        return JsonResponse(Customer_date,status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected erorr {e}'},status=500)
@csrf_exempt
def customer_update(request):
    return async_to_sync(async_customer_update)(request)
async def async_customer_update(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error':f'Invalid request method, only PUT allowed'},status=400)
        user_id = request.GET.get('object_id')
        if not user_id:
            return JsonResponse({'error':f'User_id resurement '},status=400)
        try:
            data = await sync_to_async(Customer.objects.get)(User_id= user_id)
        except Customer.DoesNotExist:
            return JsonResponse({'error':f'Data is not found'},status=404)
        try:
            Datas= json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error':f'Invalid payloads'},status=400)
        request_fields =  ['User_id','customer_name','mobile_no','email','address','area','pincode',
                    'state','opening_balance','balance_amount','gst_number']    
        for field in request_fields:
            if field not in Datas:
                return JsonResponse({'error':f'MIssing requirments fields'},status=400)
        update_fields={}
        for field in request_fields:
            if field in Datas:
                if field in ['opening_balance','balance_amount']:
                    try:
                        Datas[field] = Decimal(str(Datas[field]))
                    except Exception:
                        return JsonResponse({'error':f'Invalid decimal format'},status=400)
                setattr(data, field , Datas[field])
                update_fields[field] = convert_decimal(Datas[field])
        await sync_to_async(data.save)()
        
        return JsonResponse({'success':f'update successfully','update_fields':update_fields},status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error :{str(e)}'},status=500)

@csrf_exempt
def Customer_delete(request):
    return async_to_sync(async_customer_delete)(request)
async def async_customer_delete(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error':f'Invalid request methods , only delete allowed'},status=400)
        user_id = request.GET.get('object_id')
        if not user_id:
            return JsonResponse({'error':f'user id requirment '},status=400)
        try:
            data = await sync_to_async(Customer.objects.get)(User_id = user_id)
        except Customer.DoesNotExist:
            return JsonResponse({'error':f'Customer not found'},status=404)
        await sync_to_async(data.delete)()
        return JsonResponse({'success':f'Delete successfully'},status=200)
        
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error:{str(e)}'},status=500)
@csrf_exempt
def Supplier_add(request):
    return async_to_sync(async_add_Supplier)(request)
async def async_add_Supplier(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error':f'Invalid request format , only POST allowes'},status=400)
        data= json.loads(request.body)
        request_fields=['User_id','supplier_name','mobile_no','email','address','area','pin_code','state',
                        'opening_balance','balance_amount','gst_number']
        for field in request_fields:
            if field not in data:
                return JsonResponse({'error':f'Missing requirment fields'},status=400)
        try:
            check = await sync_to_async(Supplier.objects.filter)(
                Q(mobile_no=data['mobile_no']) or Q(email=data['email'])
            )
        except Supplier.DoesNotExist:
            return JsonResponse({'error':f'Email or Mobile number already Exists'},status= 400)
        await sync_to_async(Supplier.objects.create)(
            User_id = data['User_id'],
            supplier_name = data['supplier_name'],
            mobile_no = data['mobile_no'],
            email = data['email'],
            address = data['address'],
            area = data['area'],
            pincode = data['pin_code'],
            state = data['state'],
            opening_balance = convert_decimal(data['opening_balance']),
            balance_amount = convert_decimal(data['balance_amount']),
            gst_number = data['gst_number'],
        )
        return JsonResponse({'success':f'Succesfully create'},status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error:{str(e)}'},status=500)

def Supplier_get(request):
    return async_to_sync(async_supplier_get)(request)
async def async_supplier_get(request):
    try:
        if request.method != 'GET':
            return JsonResponse({'error':f'Invalid request method , only GET methods allowed'},status=400)
        user_id = request.GET.get('object_id')
        if not user_id:
            return JsonResponse({'error':f'User id requerment is empty'},status=400)
        try:
            get_data = await sync_to_async(Supplier.objects.get)(User_id=user_id)
        except Supplier.DoesNotExist:
            return JsonResponse({'error':f'data is not found'},status=404)
        supplier_data ={
            'supplier_id': get_data.supplier_id,
            'User_id': get_data.User_id,
            'supplier_name': get_data.supplier_name,
            'mobile_no': get_data.mobile_no,
            'email': get_data.email,
            'address': get_data.address,
            'area': get_data.area,
            'pincode': get_data.pincode,
            'state': get_data.state,
            'opening_balance': convert_decimal(get_data.opening_balance),
            'balance_amount': convert_decimal(get_data.balance_amount),
            'gst_number': get_data.gst_number,
        }
        return JsonResponse(supplier_data,status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error:{str(e)}'},status=500)
@csrf_exempt
def supplier_update(request):
    return async_to_sync(async_suppiler_update)(request)
async def async_suppiler_update(request):
    try:
        if request.method != 'PUT':
            return JsonResponse({'error':f'Invalid request methods, only PUT allowed'})
        user_id = request.GET.get('object_id')
        if not user_id:
            return JsonResponse({'error':f'user id requerment is empty'},status=400)
        try:
            suplier_data = await sync_to_async(Supplier.objects.get)(User_id= user_id)
        except Supplier.DoesNotExist:
            return JsonResponse({'error':f'data is not found'},status=404)
        data = json.loads(request.body)
        request_fields=['User_id','supplier_name','mobile_no','email','address','area','pin_code','state',
                        'opening_balance','balance_amount','gst_number']
        for field in request_fields:
            if field not in data:
                return JsonResponse({'error':f'MIssing requerment fields'},status=400)
        # print(f'values comes data {data}')
        update_feilds= {}
        for field in request_fields:
            if field in data:
                if field in ['opening_balance','balance_amount'] :
                    try:
                        data[field] = Decimal(str(data[field]))
                    except Exception:
                        return JsonResponse({'error':f'Invalid decimal format '},status=400)
                setattr(suplier_data, field, data[field])
                update_feilds[field] = convert_decimal(data[field])
        await sync_to_async(suplier_data.save)()
        return JsonResponse({'success':f'Update successsfully','update_datas':update_feilds},status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error: {str(e)}'},status=500)
@csrf_exempt
def supplier_delete(request):
    return async_to_sync(async_supplier_delete)(request)
async def async_supplier_delete(request):
    try:
        if request.method != 'DELETE':
            return JsonResponse({'error':f'Invalid request method, only DELETE allowed'},status=400)
        user_id = request.GET.get('object_id')
        if not user_id:
            return JsonResponse({'error':f'user id missing'},status=400)
        try:
            supplier_data =  await sync_to_async(Supplier.objects.get)(User_id= user_id)
        except Supplier.DoesNotExist:
            return JsonResponse({'error':f'data not found'},status=404)
        await sync_to_async(supplier_data.delete)()
        return JsonResponse({'success':f'Data is successfully delete'},status=200)
    except Exception as e:
        return JsonResponse({'error':f'An unexpected error:{str(e)}'},status=500)