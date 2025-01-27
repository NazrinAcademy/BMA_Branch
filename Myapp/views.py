from bson import ObjectId, Decimal128
from bson import ObjectId  
from decimal import Decimal
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import sync_to_async, async_to_sync
from django.http import JsonResponse
from .models import *
from datetime import datetime
import json
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
            if field not in data or not data[field]:
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        gst_record = await sync_to_async(AddGst.objects.create)(
            state=data['state'],
            register_type=data['register_type'],
            assessee_of_authority_tertiary=data['assessee_of_authority_tertiary'],
            gst_in_un=data['gst_in_un'],
            periodicity_of_gstr1=data['periodicity_of_gstr1'],
            gst_user_name=data['gst_user_name'],
            mode_filing=data['mode_filing'],
            e_invoicing_applicable=data['e_invoicing_applicable'],
            applicable_from=data.get('applicable_from'),  # Optional field
            invoice_bill_from_place=data.get('invoice_bill_from_place'),  # Optional field
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
            'gst_user_name': gst_record.gst_user_name.isoformat(),
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

@csrf_exempt
def add_stock_item(request):
    return async_to_sync(async_add_stock_item)(request)
async def async_add_stock_item(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)
        required_fields = [
            'name', 'StockGroup_Id', 'under', 'units', 'gst_applicability', 'set_alter_gst_details',
            'type_of_supply', 'quantity', 'rate_per', 'value'
        ]
        for field in required_fields:
            if data.get(field) is None:  
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        stock_item = await sync_to_async(StockItem.objects.create)(
            name=data['name'],
            StockGroup_Id=data['StockGroup_Id'],
            alias=data.get('alias'),
            under=data['under'],
            units=data['units'],
            gst_applicability=data['gst_applicability'],
            set_alter_gst_details=data['set_alter_gst_details'],
            type_of_supply=data['type_of_supply'],
            rate_of_duty=data.get('rate_of_duty'),
            quantity=data['quantity'],
            rate_per=data['rate_per'],
            value=data['value']
        )
        return JsonResponse({'message': 'Stock item added successfully'}, status=200)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

def convert_decimal(value):
    if isinstance(value, Decimal128):
        return float(value.to_decimal())  
    return value
def StockItemget(request):
    return async_to_sync(async_getStockItemById)(request)

async def async_getStockItemById(request):
    try:
        if request.method != "GET":
            return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

        object_id = request.GET.get('object_id')
        stockId = request.GET.get('stockId')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(object_id) and not ObjectId.is_valid(stockId) :
            return JsonResponse({'error': 'Invalid ObjectId format'}, status=400)

        try:
            stock_group = await sync_to_async(StockItem.objects.get)(StockGroup_Id=object_id)
            stock_item = await sync_to_async(StockItem.objects.get)(StockItem_Id=stockId)
        except stock_group.DoesNotExist and StockItem.DoesNotExist:
            return JsonResponse({'error': 'Stock item not found'}, status=404)

        stock_item_data = {
            'id': str(stock_item.StockItem_Id),
            'StockGroup_Id': str(stock_item.StockGroup_Id),
            'name': stock_item.name,
            'alias': stock_item.alias,
            'under': stock_item.under,
            'units': stock_item.units,
            'statutory_information': {
                'GST_applicability': stock_item.gst_applicability,
                'set_alter_GST_details': stock_item.set_alter_gst_details,
                'type_of_supply': stock_item.type_of_supply,
                'rate_of_duty': convert_decimal(stock_item.rate_of_duty),  # Convert Decimal128 to float
            },
            'opening_balance': {
                'quantity': stock_item.quantity,
                'rate_per': stock_item.rate_per,
                'value': stock_item.value,
            }
        }
        return JsonResponse(stock_item_data, status=200)
    except ValidationError:
        return JsonResponse({'error': 'Invalid data format'}, status=400)
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def update_stock_item(request):
    return async_to_sync(async_update_stock_item)(request)

async def async_update_stock_item(request):
    try:
        if request.method != "PUT":
            return JsonResponse({'error': 'Invalid request method. Use PUT for updates.'}, status=405)
        
        object_id = request.GET.get('object_id')
        if not object_id:
            return JsonResponse({'error': 'object_id query parameter is required'}, status=400)

        if not ObjectId.is_valid(object_id):
            return JsonResponse({'error': 'Invalid object_id format'}, status=400)

        try:
            stock_item = await sync_to_async(StockItem.objects.get)(StockGroup_Id=object_id)
        except StockItem.DoesNotExist:
            return JsonResponse({'error': 'Stock item not found for the provided object_id'}, status=404)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        updatable_fields = [
            'name', 'alias', 'under', 'units', 
            'gst_applicability', 'set_alter_gst_details', 'type_of_supply', 'rate_of_duty',
            'quantity', 'rate_per', 'value'
        ]
        updated_fields = {}

        for field in updatable_fields:
            if field in data:
                if field == 'rate_of_duty': 
                    try:
                        setattr(stock_item, field, Decimal(data[field]))
                    except (ValueError, TypeError):
                        return JsonResponse({'error': f'Invalid value for {field}. Must be a valid decimal number.'}, status=400)
                else:
                    setattr(stock_item, field, data[field])
                updated_fields[field] = data[field]

        await sync_to_async(stock_item.save)()

        return JsonResponse({
            'success': 'Stock item updated successfully',
            'updated_fields': updated_fields
        }, status=200)
    
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

@csrf_exempt
def delete_stock_item(request):
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
            stock_item = await sync_to_async(StockItem.objects.get)(StockGroup_Id=object_id)
        except StockItem.DoesNotExist:
            return JsonResponse({'error': 'Stock item not found for the provided object_id'}, status=404)
        
        try:
            await sync_to_async(stock_item.delete)()
            return JsonResponse({'success': 'Stock item deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting stock item: {str(e)}'}, status=500)
    
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

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
        except StockItem.DoesNotExist:
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
        required_fields = ['opening_stock', 'opening_stock_values','low_stock_qty','date','location']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

        stock_details = await sync_to_async(StockDetails.objects.create)(
            opening_stock=data['opening_stock'],
            opening_stock_values=data.get('opening_stock_values'),
            low_stock_qty=data.get('low_stock_qty'),
            date=data.get('date'),
            location=data.get('location'),
            )
        return JsonResponse({'message': 'Stock details added successfully', 
                            'id': stock_details.StockDetails_id},status=200)
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
            stock_details = await sync_to_async(StockDetails.objects.get)(StockDetails_id=object_id)
        except StockDetails.DoesNotExist:
            return JsonResponse({'error': 'StockGroupTaxDetails object not found for the provided object_id'}, status=404)

        response_data = {
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
            stock_group_tax_details = await sync_to_async(StockDetails.objects.get)(StockDetails_id=object_id)
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
            stock_details = await sync_to_async(StockDetails.objects.get)(StockDetails_id=object_id)
        except StockDetails.DoesNotExist:
            return JsonResponse({'error': 'StockGroupTaxDetails object not found for the provided object_id'}, status=404)

        try:
            await sync_to_async(stock_details.delete)()
            return JsonResponse({'success': 'StockGroupTaxDetails object deleted successfully'}, status=200)
        except Exception as e:
            return JsonResponse({'error': f'Error deleting StockGroupTaxDetails object: {str(e)}'}, status=500)
    
    except Exception as e:
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

logger = logging.getLogger(__name__)
@csrf_exempt
def add_product_details(request):
    return async_to_sync(async_add_product)(request)
async def async_add_product(request):
    try:
        if request.method != 'POST':
            return JsonResponse({'error': 'Invalid request format'}, status=405)
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON payload'}, status=400)

        required_fields = ['Customer_Id','product_name', 'category','subcategory','brand', 
                           'unit','bar_oq_code','description','img', 'product_code']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            product = await sync_to_async(ProductDetails.objects.create)(
                category=data['category'],
                Customer_Id=data['Customer_Id'],
                subcategory=data['subcategory'],
                unit=data['unit'],
                bar_oq_code=data['bar_oq_code'],
                description=data['description'],
                img=data['img'],
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
        logger.error(f"An unexpected error occurred: {str(e)}")
        return JsonResponse({'error': f'An unexpected error occurred: {str(e)}'}, status=500)

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
            'img': product.img.url,
            # 'img': product.img.url if product.img else None,
            'product_name': product.product_name,
            'product_code': product.product_code,
            'description': product.description,
        }
        return JsonResponse(product_data, status=200)
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

        required_fields = ['PurchasePrice', 'SalePrice', 'Min_Sale_Price', 'MRP', 'hsn_sac_code', 'discount',
                    'igst','igstprice','cgst','cgstprice','sgst','sgstprice','cess','cessprice','totalamount']
        for field in required_fields:
            if not data.get(field):
                return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
        try:
            price = await sync_to_async(PriceDetails.objects.create)(
                PurchasePrice=data['PurchasePrice'],
                SalePrice=data['SalePrice'],
                Min_Sale_Price=data['Min_Sale_Price'],
                MRP=data['MRP'],
                hsn_sac_code=data['hsn_sac_code'],
                discount=data['discount'],
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
                    'igst','igstprice','cgst','cgstprice','sgst','sgstprice','cess','cessprice','totalamount']
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
        gstdetail_id = request.GET.get('gstdetail_id')
        if not product_id and not gstdetail_id:
            return JsonResponse({'error': 'The product_id query and gstdetail_id parameter is required'}, status=400)

        if not ObjectId.is_valid(product_id) and not ObjectId.is_valid(gstdetail_id):
            return JsonResponse({'error':' Both Invalid ObjectId format'}, status=400)

        try:
            price = await sync_to_async(PriceGstDetails.objects.get)(product_Id=product_id,Gstdetails_Id=gstdetail_id)
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
        gstdetail_id = request.GET.get('gstdetail_id')
        if not product_id and not gstdetail_id:
            return JsonResponse({'error': 'The product_id query and gstdetail_idparameter is required'}, status=400)
        if not ObjectId.is_valid(product_id) and not ObjectId.is_valid(gstdetail_id):
            return JsonResponse({'error':' Both Invalid ObjectId format'}, status=400)
        try:
            price = await sync_to_async(PriceGstDetails.objects.get)(product_Id=product_id,Gstdetails_Id=gstdetail_id)
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
        gstdetail_id = request.GET.get('gstdetail_id')
        if not product_id and not gstdetail_id:
            return JsonResponse({'error': 'The product_id query and gstdetail_idparameter is required'}, status=400)
        if not ObjectId.is_valid(product_id) and not ObjectId.is_valid(gstdetail_id):
            return JsonResponse({'error':' Both Invalid ObjectId format'}, status=400)
        try:
            price = await sync_to_async(PriceGstDetails.objects.get)(product_Id=product_id,Gstdetails_Id=gstdetail_id)
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