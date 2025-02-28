from asgiref.sync import async_to_sync , sync_to_async
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_datetime
from django.utils.timezone import now, timedelta
from django.utils.dateparse import parse_date 
from datetime import datetime , timedelta
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
from datetime import datetime 
from .models import *
import datetime
import razorpay
import hashlib
import hmac
import json
import re
import jwt
import pythoncom
import wmi
import requests


@csrf_exempt
def create_gst(request):
    return async_to_sync(async_create_gst)(request)

async def async_create_gst(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            required_fields = [
                "state", "registration_type", "assessee_of_other_territory",
                "GSTIN_UIN", "periodicity_of_GSTR1", "gst_user_name",
                "mode_filing", "e_invoicing_applicable", "applicable_from_e_invoicing",
                "invoice_bill_from_place", "e_way_bill_applicable",
                "applicable_from_e_way_bill", "applicable_for_intrastate"
            ]

            missing_fields = [field for field in required_fields if field not in data or data[field] == ""]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            GSTIN_UIN = data["GSTIN_UIN"]

            existing_gst = await sync_to_async(GST.objects.filter(GSTIN_UIN=GSTIN_UIN).exists)()
            if existing_gst:
                return JsonResponse({"error": "GSTIN_UIN already exists!"}, status=400)

            applicable_from_e_invoicing = datetime.strptime(data["applicable_from_e_invoicing"], "%Y-%m-%d").date() if data["applicable_from_e_invoicing"] else None
            applicable_from_e_way_bill = datetime.strptime(data["applicable_from_e_way_bill"], "%Y-%m-%d").date() if data["applicable_from_e_way_bill"] else None

            await sync_to_async(GST.objects.create)(
                state=data["state"],
                registration_type=data["registration_type"],
                assessee_of_other_territory=data["assessee_of_other_territory"],
                GSTIN_UIN=GSTIN_UIN,
                periodicity_of_GSTR1=data["periodicity_of_GSTR1"],
                gst_user_name=data["gst_user_name"],
                mode_filing=data["mode_filing"],
                e_invoicing_applicable=data["e_invoicing_applicable"],
                applicable_from_e_invoicing=applicable_from_e_invoicing,
                invoice_bill_from_place=data["invoice_bill_from_place"],
                e_way_bill_applicable=data["e_way_bill_applicable"],
                applicable_from_e_way_bill=applicable_from_e_way_bill,
                applicable_for_intrastate=data["applicable_for_intrastate"]
            )

            return JsonResponse({"message": "GST details added successfully!"}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# # -----------------------GET details--------------------------------
@csrf_exempt
def get_gst(request):
    return async_to_sync(async_get_gst)(request)

async def async_get_gst(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            gst_id = data.get('id', None)

            if gst_id is None:
                return JsonResponse({"error": "ID is required in the request body."}, status=400)

            gst = await sync_to_async(GST.objects.get)(id=gst_id)

            gst_data = {
                "id": gst.id,
                "state": gst.state,
                "registration_type": gst.registration_type,
                "assessee_of_other_territory": gst.assessee_of_other_territory,
                "GSTIN_UIN": gst.GSTIN_UIN,
                "periodicity_of_GSTR1": gst.periodicity_of_GSTR1,
                "gst_user_name": gst.gst_user_name,
                "mode_filing": gst.mode_filing,
                "e_invoicing_applicable": gst.e_invoicing_applicable,
                "applicable_from_e_invoicing": gst.applicable_from_e_invoicing,
                "invoice_bill_from_place": gst.invoice_bill_from_place,
                "e_way_bill_applicable": gst.e_way_bill_applicable,
                "applicable_from_e_way_bill": gst.applicable_from_e_way_bill,
                "applicable_for_intrastate": gst.applicable_for_intrastate
            }

            return JsonResponse({"data": gst_data}, status=200)

        except GST.DoesNotExist:
            return JsonResponse({"error": "GST record not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Only GET method is allowed."}, status=405)

# # --------------------------UPDATE GST DETAILS--------------------------------------
@csrf_exempt
def update_gst(request):
    return async_to_sync(async_update_gst)(request)

async def async_update_gst(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            gst_id = data.get('id', None)

            if gst_id is None:
                return JsonResponse({"error": "ID is required in the request body."}, status=400)

            gst = await sync_to_async(GST.objects.get)(id=gst_id)

            gst.state = data.get('state', gst.state)
            gst.registration_type = data.get('registration_type', gst.registration_type)
            gst.assessee_of_other_territory = data.get('assessee_of_other_territory', gst.assessee_of_other_territory)
            gst.GSTIN_UIN = data.get('GSTIN_UIN', gst.GSTIN_UIN)
            gst.periodicity_of_GSTR1 = data.get('periodicity_of_GSTR1', gst.periodicity_of_GSTR1)
            gst.gst_user_name = data.get('gst_user_name', gst.gst_user_name)
            gst.mode_filing = data.get('mode_filing', gst.mode_filing)
            gst.e_invoicing_applicable = data.get('e_invoicing_applicable', gst.e_invoicing_applicable)
            gst.applicable_from_e_invoicing = data.get('applicable_from_e_invoicing', gst.applicable_from_e_invoicing)
            gst.invoice_bill_from_place = data.get('invoice_bill_from_place', gst.invoice_bill_from_place)
            gst.e_way_bill_applicable = data.get('e_way_bill_applicable', gst.e_way_bill_applicable)
            gst.applicable_from_e_way_bill = data.get('applicable_from_e_way_bill', gst.applicable_from_e_way_bill)
            gst.applicable_for_intrastate = data.get('applicable_for_intrastate', gst.applicable_for_intrastate)

            await sync_to_async(gst.save)()

            return JsonResponse({"message": "GST details updated successfully."}, status=200)

        except GST.DoesNotExist:
            return JsonResponse({"error": "GST record not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Only PUT method is allowed."}, status=405)

# # ------------------------------DELETE GST DETAILS-----------------------------
@csrf_exempt
def delete_gst(request):
    return async_to_sync(async_delete_gst)(request)

async def async_delete_gst(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            gst_id = data.get('id', None)

            if gst_id is None:
                return JsonResponse({"error": "ID is required in the request body."}, status=400)

            gst = await sync_to_async(GST.objects.get)(id=gst_id)

            await sync_to_async(gst.delete)()

            return JsonResponse({"message": "GST record deleted successfully."}, status=200)

        except GST.DoesNotExist:
            return JsonResponse({"error": "GST record not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Only DELETE method is allowed."}, status=405)


# ----------------------------CREATE GSTR1 -------------------------

@csrf_exempt
def create_gstr1(request):
    return async_to_sync(async_create_gstr1)(request)

async def async_create_gstr1(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            gstr1_record = GSTR1(
                gstin_uin_recipient=data.get('gstin_uin_recipient'),
                receiver_name=data.get('receiver_name'),
                invoice_number=data.get('invoice_number'),
                invoice_date=data.get('invoice_date'),
                place_of_supply=data.get('place_of_supply'),
                invoice_value=data.get('invoice_value'),
                supply_type=data.get('supply_type'),
            )
            
            gstr1_record.place_of_supply_b2cl = data.get('place_of_supply_b2cl')
            gstr1_record.invoice_number_b2cl = data.get('invoice_number_b2cl')
            gstr1_record.invoice_date_b2cl = data.get('invoice_date_b2cl')
            gstr1_record.supply_type_b2cl = data.get('supply_type_b2cl')
            gstr1_record.invoice_value_b2cl = data.get('invoice_value_b2cl')
            
            gstr1_record.place_of_supply_b2cs = data.get('place_of_supply_b2cs')
            gstr1_record.taxable_value_b2cs = data.get('taxable_value_b2cs')
            gstr1_record.supply_type_b2cs = data.get('supply_type_b2cs')
            gstr1_record.rate_percentage_b2cs = data.get('rate_percentage_b2cs')
            gstr1_record.integrated_tax_b2cs = data.get('integrated_tax_b2cs')
            gstr1_record.central_tax_b2cs = data.get('central_tax_b2cs')
            gstr1_record.state_ut_tax_b2cs = data.get('state_ut_tax_b2cs')
            gstr1_record.cess_b2cs = data.get('cess_b2cs')
            
            gstr1_record.gstin_uin_recipient_cdnr = data.get('gstin_uin_recipient_cdnr')
            gstr1_record.receiver_name_cdnr = data.get('receiver_name_cdnr')
            gstr1_record.debit_credit_note_no_cdnr = data.get('debit_credit_note_no_cdnr')
            gstr1_record.debit_credit_note_date_cdnr = data.get('debit_credit_note_date_cdnr')
            gstr1_record.original_invoice_number_cdnr = data.get('original_invoice_number_cdnr')
            gstr1_record.original_invoice_date_cdnr = data.get('original_invoice_date_cdnr')
            gstr1_record.note_type_cdnr = data.get('note_type_cdnr')
            gstr1_record.note_value_cdnr = data.get('note_value_cdnr')
            
            gstr1_record.note_type_cdnur = data.get('note_type_cdnur')
            gstr1_record.debit_credit_note_no_cdnur = data.get('debit_credit_note_no_cdnur')
            gstr1_record.debit_credit_note_date_cdnur = data.get('debit_credit_note_date_cdnur')
            gstr1_record.original_invoice_number_cdnur = data.get('original_invoice_number_cdnur')
            gstr1_record.original_invoice_date_cdnur = data.get('original_invoice_date_cdnur')
            gstr1_record.note_value_cdnur = data.get('note_value_cdnur')
            gstr1_record.supply_type_cdnur = data.get('supply_type_cdnur')
            
            gstr1_record.invoice_number_exp = data.get('invoice_number_exp')
            gstr1_record.invoice_date_exp = data.get('invoice_date_exp')
            gstr1_record.port_code_exp = data.get('port_code_exp')
            gstr1_record.shipping_bill_no_exp = data.get('shipping_bill_no_exp')
            gstr1_record.shipping_bill_date_exp = data.get('shipping_bill_date_exp')
            gstr1_record.total_invoice_value_exp = data.get('total_invoice_value_exp')
            gstr1_record.supply_type_exp = data.get('supply_type_exp')
            gstr1_record.gst_payment_exp = data.get('gst_payment_exp')
            
            gstr1_record.nil_rated = data.get('nil_rated', False)
            gstr1_record.exempted = data.get('exempted', False)
            gstr1_record.non_gst_supplies = data.get('non_gst_supplies', False)
            
            gstr1_record.hsn_code_hsn = data.get('hsn_code_hsn')
            gstr1_record.description_hsn = data.get('description_hsn')
            gstr1_record.uqc_hsn = data.get('uqc_hsn')
            gstr1_record.total_quantity_hsn = data.get('total_quantity_hsn')
            gstr1_record.total_taxable_value_hsn = data.get('total_taxable_value_hsn')
            gstr1_record.rate_percentage_hsn = data.get('rate_percentage_hsn')
            gstr1_record.integrated_tax_hsn = data.get('integrated_tax_hsn')
            gstr1_record.central_tax_hsn = data.get('central_tax_hsn')
            gstr1_record.state_ut_tax_hsn = data.get('state_ut_tax_hsn')
            gstr1_record.cess_tax_hsn = data.get('cess_tax_hsn')
            
            gstr1_record.nature_of_document = data.get('nature_of_document')
            gstr1_record.sr_no_from = data.get('sr_no_from')
            gstr1_record.sr_no_to = data.get('sr_no_to')
            gstr1_record.total_number = data.get('total_number')
            gstr1_record.cancelled = data.get('cancelled', False)
            gstr1_record.net_issue = data.get('net_issue')

            await sync_to_async(gstr1_record.save)()
            
            return JsonResponse({"message": "GSTR1 details stored successfully!"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)

# --------------------------GET GSTR1----------------------------------------

@csrf_exempt
def get_gstr1(request):
    return async_to_sync(async_get_gstr1)(request)

async def async_get_gstr1(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body)
            record_id = data.get("id")

            if not record_id:
                return JsonResponse({"error": "ID not provided"}, status=400)

            try:
                gstr1_record = await sync_to_async(GSTR1.objects.get)(id=record_id)

                response_data = {
                    "gstin_uin_recipient": gstr1_record.gstin_uin_recipient,
                    "receiver_name": gstr1_record.receiver_name,
                    "invoice_number": gstr1_record.invoice_number,
                    "invoice_date": gstr1_record.invoice_date,
                    "place_of_supply": gstr1_record.place_of_supply,
                    "invoice_value": gstr1_record.invoice_value,
                    "supply_type": gstr1_record.supply_type,
                    # B2CLInvoice fields
                    "place_of_supply_b2cl": gstr1_record.place_of_supply_b2cl,
                    "invoice_number_b2cl": gstr1_record.invoice_number_b2cl,
                    "invoice_date_b2cl": gstr1_record.invoice_date_b2cl,
                    "supply_type_b2cl": gstr1_record.supply_type_b2cl,
                    "invoice_value_b2cl": gstr1_record.invoice_value_b2cl,
                    # B2CSInvoice fields
                    "place_of_supply_b2cs": gstr1_record.place_of_supply_b2cs,
                    "taxable_value_b2cs": gstr1_record.taxable_value_b2cs,
                    "supply_type_b2cs": gstr1_record.supply_type_b2cs,
                    "rate_percentage_b2cs": gstr1_record.rate_percentage_b2cs,
                    "integrated_tax_b2cs": gstr1_record.integrated_tax_b2cs,
                    "central_tax_b2cs": gstr1_record.central_tax_b2cs,
                    "state_ut_tax_b2cs": gstr1_record.state_ut_tax_b2cs,
                    "cess_b2cs": gstr1_record.cess_b2cs,
                    # CDNRInvoice fields
                    "gstin_uin_recipient_cdnr": gstr1_record.gstin_uin_recipient_cdnr,
                    "receiver_name_cdnr": gstr1_record.receiver_name_cdnr,
                    "debit_credit_note_no_cdnr": gstr1_record.debit_credit_note_no_cdnr,
                    "debit_credit_note_date_cdnr": gstr1_record.debit_credit_note_date_cdnr,
                    "original_invoice_number_cdnr": gstr1_record.original_invoice_number_cdnr,
                    "original_invoice_date_cdnr": gstr1_record.original_invoice_date_cdnr,
                    "note_type_cdnr": gstr1_record.note_type_cdnr,
                    "note_value_cdnr": gstr1_record.note_value_cdnr,
                    # CDNURInvoice fields
                    "note_type_cdnur": gstr1_record.note_type_cdnur,
                    "debit_credit_note_no_cdnur": gstr1_record.debit_credit_note_no_cdnur,
                    "debit_credit_note_date_cdnur": gstr1_record.debit_credit_note_date_cdnur,
                    "original_invoice_number_cdnur": gstr1_record.original_invoice_number_cdnur,
                    "original_invoice_date_cdnur": gstr1_record.original_invoice_date_cdnur,
                    "note_value_cdnur": gstr1_record.note_value_cdnur,
                    "supply_type_cdnur": gstr1_record.supply_type_cdnur,
                    # EXPInvoice fields
                    "invoice_number_exp": gstr1_record.invoice_number_exp,
                    "invoice_date_exp": gstr1_record.invoice_date_exp,
                    "port_code_exp": gstr1_record.port_code_exp,
                    "shipping_bill_no_exp": gstr1_record.shipping_bill_no_exp,
                    "shipping_bill_date_exp": gstr1_record.shipping_bill_date_exp,
                    "total_invoice_value_exp": gstr1_record.total_invoice_value_exp,
                    "supply_type_exp": gstr1_record.supply_type_exp,
                    "gst_payment_exp": gstr1_record.gst_payment_exp,
                    # NilExemptNonGSTSupplies fields
                    "nil_rated": gstr1_record.nil_rated,
                    "exempted": gstr1_record.exempted,
                    "non_gst_supplies": gstr1_record.non_gst_supplies,
                    # HSNInvoice fields
                    "hsn_code_hsn": gstr1_record.hsn_code_hsn,
                    "description_hsn": gstr1_record.description_hsn,
                    "uqc_hsn": gstr1_record.uqc_hsn,
                    "total_quantity_hsn": gstr1_record.total_quantity_hsn,
                    "total_taxable_value_hsn": gstr1_record.total_taxable_value_hsn,
                    "rate_percentage_hsn": gstr1_record.rate_percentage_hsn,
                    "integrated_tax_hsn": gstr1_record.integrated_tax_hsn,
                    "central_tax_hsn": gstr1_record.central_tax_hsn,
                    "state_ut_tax_hsn": gstr1_record.state_ut_tax_hsn,
                    "cess_tax_hsn": gstr1_record.cess_tax_hsn,
                    # TaxPeriodDocuments fields
                    "nature_of_document": gstr1_record.nature_of_document,
                    "sr_no_from": gstr1_record.sr_no_from,
                    "sr_no_to": gstr1_record.sr_no_to,
                    "total_number": gstr1_record.total_number,
                    "cancelled": gstr1_record.cancelled,
                    "net_issue": gstr1_record.net_issue,
                }

                return JsonResponse(response_data, status=200)

            except GSTR1.DoesNotExist:
                return JsonResponse({"error": "Record not found"}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data"}, status=400)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# -----------------------UPDATE GSTR1----------------------------------
@csrf_exempt
def update_gstr1(request):
    return async_to_sync(async_update_gstr1)(request)

async def async_update_gstr1(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            gstr1_id = data.get('gstr1_id')

            if not gstr1_id:
                return JsonResponse({"error": "ID is required."}, status=400)

            gstr1_record = await sync_to_async(GSTR1.objects.filter(id=gstr1_id).first)()

            if gstr1_record:
                gstr1_record.gstin_uin_recipient = data.get('gstin_uin_recipient', gstr1_record.gstin_uin_recipient)
                gstr1_record.receiver_name = data.get('receiver_name', gstr1_record.receiver_name)
                gstr1_record.invoice_number = data.get('invoice_number', gstr1_record.invoice_number)
                gstr1_record.invoice_date = data.get('invoice_date', gstr1_record.invoice_date)
                gstr1_record.place_of_supply = data.get('place_of_supply', gstr1_record.place_of_supply)
                gstr1_record.invoice_value = data.get('invoice_value', gstr1_record.invoice_value)
                gstr1_record.supply_type = data.get('supply_type', gstr1_record.supply_type)

                # B2CL Invoice data
                gstr1_record.place_of_supply_b2cl = data.get('place_of_supply_b2cl', gstr1_record.place_of_supply_b2cl)
                gstr1_record.invoice_number_b2cl = data.get('invoice_number_b2cl', gstr1_record.invoice_number_b2cl)
                gstr1_record.invoice_date_b2cl = data.get('invoice_date_b2cl', gstr1_record.invoice_date_b2cl)
                gstr1_record.supply_type_b2cl = data.get('supply_type_b2cl', gstr1_record.supply_type_b2cl)
                gstr1_record.invoice_value_b2cl = data.get('invoice_value_b2cl', gstr1_record.invoice_value_b2cl)

                # B2CS Invoice data
                gstr1_record.place_of_supply_b2cs = data.get('place_of_supply_b2cs', gstr1_record.place_of_supply_b2cs)
                gstr1_record.taxable_value_b2cs = data.get('taxable_value_b2cs', gstr1_record.taxable_value_b2cs)
                gstr1_record.supply_type_b2cs = data.get('supply_type_b2cs', gstr1_record.supply_type_b2cs)
                gstr1_record.rate_percentage_b2cs = data.get('rate_percentage_b2cs', gstr1_record.rate_percentage_b2cs)
                gstr1_record.integrated_tax_b2cs = data.get('integrated_tax_b2cs', gstr1_record.integrated_tax_b2cs)
                gstr1_record.central_tax_b2cs = data.get('central_tax_b2cs', gstr1_record.central_tax_b2cs)
                gstr1_record.state_ut_tax_b2cs = data.get('state_ut_tax_b2cs', gstr1_record.state_ut_tax_b2cs)
                gstr1_record.cess_b2cs = data.get('cess_b2cs', gstr1_record.cess_b2cs)

                # CDNR Invoice data
                gstr1_record.gstin_uin_recipient_cdnr = data.get('gstin_uin_recipient_cdnr', gstr1_record.gstin_uin_recipient_cdnr)
                gstr1_record.receiver_name_cdnr = data.get('receiver_name_cdnr', gstr1_record.receiver_name_cdnr)
                gstr1_record.debit_credit_note_no_cdnr = data.get('debit_credit_note_no_cdnr', gstr1_record.debit_credit_note_no_cdnr)
                gstr1_record.debit_credit_note_date_cdnr = data.get('debit_credit_note_date_cdnr', gstr1_record.debit_credit_note_date_cdnr)
                gstr1_record.original_invoice_number_cdnr = data.get('original_invoice_number_cdnr', gstr1_record.original_invoice_number_cdnr)
                gstr1_record.original_invoice_date_cdnr = data.get('original_invoice_date_cdnr', gstr1_record.original_invoice_date_cdnr)
                gstr1_record.note_type_cdnr = data.get('note_type_cdnr', gstr1_record.note_type_cdnr)
                gstr1_record.note_value_cdnr = data.get('note_value_cdnr', gstr1_record.note_value_cdnr)

                # CDNUR Invoice data
                gstr1_record.note_type_cdnur = data.get('note_type_cdnur', gstr1_record.note_type_cdnur)
                gstr1_record.debit_credit_note_no_cdnur = data.get('debit_credit_note_no_cdnur', gstr1_record.debit_credit_note_no_cdnur)
                gstr1_record.debit_credit_note_date_cdnur = data.get('debit_credit_note_date_cdnur', gstr1_record.debit_credit_note_date_cdnur)
                gstr1_record.original_invoice_number_cdnur = data.get('original_invoice_number_cdnur', gstr1_record.original_invoice_number_cdnur)
                gstr1_record.original_invoice_date_cdnur = data.get('original_invoice_date_cdnur', gstr1_record.original_invoice_date_cdnur)
                gstr1_record.note_value_cdnur = data.get('note_value_cdnur', gstr1_record.note_value_cdnur)
                gstr1_record.supply_type_cdnur = data.get('supply_type_cdnur', gstr1_record.supply_type_cdnur)

                # EXP Invoice data
                gstr1_record.invoice_number_exp = data.get('invoice_number_exp', gstr1_record.invoice_number_exp)
                gstr1_record.invoice_date_exp = data.get('invoice_date_exp', gstr1_record.invoice_date_exp)
                gstr1_record.port_code_exp = data.get('port_code_exp', gstr1_record.port_code_exp)
                gstr1_record.shipping_bill_no_exp = data.get('shipping_bill_no_exp', gstr1_record.shipping_bill_no_exp)
                gstr1_record.shipping_bill_date_exp = data.get('shipping_bill_date_exp', gstr1_record.shipping_bill_date_exp)
                gstr1_record.total_invoice_value_exp = data.get('total_invoice_value_exp', gstr1_record.total_invoice_value_exp)
                gstr1_record.supply_type_exp = data.get('supply_type_exp', gstr1_record.supply_type_exp)
                gstr1_record.gst_payment_exp = data.get('gst_payment_exp', gstr1_record.gst_payment_exp)

                # Nil/Exempt/Non-GST Supplies
                gstr1_record.nil_rated = data.get('nil_rated', gstr1_record.nil_rated)
                gstr1_record.exempted = data.get('exempted', gstr1_record.exempted)
                gstr1_record.non_gst_supplies = data.get('non_gst_supplies', gstr1_record.non_gst_supplies)

                # HSN Invoice data
                gstr1_record.hsn_code_hsn = data.get('hsn_code_hsn', gstr1_record.hsn_code_hsn)
                gstr1_record.description_hsn = data.get('description_hsn', gstr1_record.description_hsn)
                gstr1_record.uqc_hsn = data.get('uqc_hsn', gstr1_record.uqc_hsn)
                gstr1_record.total_quantity_hsn = data.get('total_quantity_hsn', gstr1_record.total_quantity_hsn)
                gstr1_record.total_taxable_value_hsn = data.get('total_taxable_value_hsn', gstr1_record.total_taxable_value_hsn)
                gstr1_record.rate_percentage_hsn = data.get('rate_percentage_hsn', gstr1_record.rate_percentage_hsn)
                gstr1_record.integrated_tax_hsn = data.get('integrated_tax_hsn', gstr1_record.integrated_tax_hsn)
                gstr1_record.central_tax_hsn = data.get('central_tax_hsn', gstr1_record.central_tax_hsn)
                gstr1_record.state_ut_tax_hsn = data.get('state_ut_tax_hsn', gstr1_record.state_ut_tax_hsn)
                gstr1_record.cess_tax_hsn = data.get('cess_tax_hsn', gstr1_record.cess_tax_hsn)
    
                # TaxPeriod Documents
                gstr1_record.nature_of_document = data.get('nature_of_document', gstr1_record.nature_of_document)
                gstr1_record.sr_no_from = data.get('sr_no_from', gstr1_record.sr_no_from)
                gstr1_record.sr_no_to = data.get('sr_no_to', gstr1_record.sr_no_to)
                gstr1_record.total_number = data.get('total_number', gstr1_record.total_number)
                gstr1_record.cancelled = data.get('cancelled', gstr1_record.cancelled)
                gstr1_record.net_issue = data.get('net_issue', gstr1_record.net_issue)
    
                await sync_to_async(gstr1_record.save)()

                return JsonResponse({"message": "GSTR1 record updated successfully."}, status=200)
            else:
                return JsonResponse({"error": "Record not found."}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Invalid HTTP method."}, status=405)

# ------------------------DELETE GSTR1 --------------------
@csrf_exempt
def delete_gstr1(request):
    return async_to_sync(async_delete_gstr1)(request)

async def async_delete_gstr1(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            gstr1_id = data.get("gstr1_id")

            if not gstr1_id:
                return JsonResponse({"error": "ID not provided."}, status=400)

            gstr1_record = await sync_to_async(GSTR1.objects.filter(id=gstr1_id).first)()
            if not gstr1_record:
                return JsonResponse({"error": "Record not found."}, status=404)

            await sync_to_async(gstr1_record.delete)()

            return JsonResponse({"message": f"Record with ID {gstr1_id} deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=400)


# -----------------------------CREATE   GSTR2  ----------------------------------------------

@csrf_exempt
def create_gstr2(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            gstr2 = GSTR2(
                # B2B Invoices
                gstin_uin_supplier_b2b=data.get('gstin_uin_supplier_b2b'),
                supplier_name_b2b=data.get('supplier_name_b2b'),
                invoice_number_b2b=data.get('invoice_number_b2b'),
                invoice_date_b2b=parse_date(data.get('invoice_date_b2b')),
                place_of_supply_b2b=data.get('place_of_supply_b2b'),
                supplier_invoice_no_b2b=data.get('supplier_invoice_no_b2b'),
                invoice_value_b2b=data.get('invoice_value_b2b'),
                supply_type_b2b=data.get('supply_type_b2b'),
                
                # Credit/Debit Notes Regular
                gstin_uin_supplier_cdr=data.get('gstin_uin_supplier_cdr'),
                supplier_name_cdr=data.get('supplier_name_cdr'),
                debit_credit_note_no_cdr=data.get('debit_credit_note_no_cdr'),
                debit_credit_note_date_cdr=parse_date(data.get('debit_credit_note_date_cdr')),
                original_invoice_number_cdr=data.get('original_invoice_number_cdr'),
                original_invoice_date_cdr=parse_date(data.get('original_invoice_date_cdr')),
                note_type_cdr=data.get('note_type_cdr'),
                note_value_cdr=data.get('note_value_cdr'),
                supply_type_cdr=data.get('supply_type_cdr'),
                
                # B2BUR Invoice
                gstin_uin_supplier_b2bur=data.get('gstin_uin_supplier_b2bur'),
                supplier_name_b2bur=data.get('supplier_name_b2bur'),
                invoice_number_b2bur=data.get('invoice_number_b2bur'),
                invoice_date_b2bur=parse_date(data.get('invoice_date_b2bur')),
                place_of_supply_b2bur=data.get('place_of_supply_b2bur'),
                supplier_invoice_no_b2bur=data.get('supplier_invoice_no_b2bur'),
                invoice_value_b2bur=data.get('invoice_value_b2bur'),
                supply_type_b2bur=data.get('supply_type_b2bur'),
                
                # Import of Services
                supplier_name_import_services=data.get('supplier_name_import_services'),
                supplier_invoice_number_import_services=data.get('supplier_invoice_number_import_services'),
                invoice_date_import_services=parse_date(data.get('invoice_date_import_services')),
                supplier_invoice_date_import_services=parse_date(data.get('supplier_invoice_date_import_services')),
                total_invoice_value_import_services=data.get('total_invoice_value_import_services'),
                
                # Import of Goods
                supplier_name_import_goods=data.get('supplier_name_import_goods'),
                invoice_date_import_goods=parse_date(data.get('invoice_date_import_goods')),
                bill_of_entry_no_import_goods=data.get('bill_of_entry_no_import_goods'),
                bill_of_entry_date_import_goods=parse_date(data.get('bill_of_entry_date_import_goods')),
                port_code_import_goods=data.get('port_code_import_goods'),
                total_invoice_value_import_goods=data.get('total_invoice_value_import_goods'),
                
                # Credit/Debit Notes Unregistered
                gstin_uin_supplier_cdunr=data.get('gstin_uin_supplier_cdunr'),
                supplier_name_cdunr=data.get('supplier_name_cdunr'),
                debit_credit_note_no_cdunr=data.get('debit_credit_note_no_cdunr'),
                debit_credit_note_date_cdunr=parse_date(data.get('debit_credit_note_date_cdunr')),
                original_invoice_number_cdunr=data.get('original_invoice_number_cdunr'),
                original_invoice_date_cdunr=parse_date(data.get('original_invoice_date_cdunr')),
                note_type_cdunr=data.get('note_type_cdunr'),
                note_value_cdunr=data.get('note_value_cdunr'),
                supply_type_cdunr=data.get('supply_type_cdunr'),
                
                # Nil Rated Invoices
                description_nil_rated=data.get('description_nil_rated'),
                composition_taxable_person_nil_rated=data.get('composition_taxable_person_nil_rated'),
                nil_rated_supplies_nil_rated=data.get('nil_rated_supplies_nil_rated'),
                exempted_supplies_nil_rated=data.get('exempted_supplies_nil_rated'),
                non_gst_supplies_nil_rated=data.get('non_gst_supplies_nil_rated'),
                
                # Summary for HSN
                hsn_code_hsn=data.get('hsn_code_hsn'),
                description_hsn=data.get('description_hsn'),
                uqc_hsn=data.get('uqc_hsn'),
                total_quantity_hsn=data.get('total_quantity_hsn'),
                total_taxable_value_hsn=data.get('total_taxable_value_hsn'),
                rate_percentage_hsn=data.get('rate_percentage_hsn'),
                integrated_tax_hsn=data.get('integrated_tax_hsn'),
                central_tax_hsn=data.get('central_tax_hsn'),
                state_ut_tax_hsn=data.get('state_ut_tax_hsn'),
                cess_tax_hsn=data.get('cess_tax_hsn'),
            )
            
            gstr2.save()  
            
            return JsonResponse({'message': 'Data saved successfully'}, status=201)
        
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# ---------------------------GET GSTR2 -------------------------------------

@csrf_exempt
def get_gstr2(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body)
            gstr2_id = data.get("gstr2_id")

            if not gstr2_id:
                return JsonResponse({"error": "ID is required."}, status=400)

            gstr2 = GSTR2.objects.get(id=gstr2_id)

            if gstr2:
                response_data = {
                    "gstin_uin_supplier_b2b": gstr2.gstin_uin_supplier_b2b,
                    "supplier_name_b2b": gstr2.supplier_name_b2b,
                    "invoice_number_b2b": gstr2.invoice_number_b2b,
                    "invoice_date_b2b": gstr2.invoice_date_b2b,
                    "place_of_supply_b2b": gstr2.place_of_supply_b2b,
                    "supplier_invoice_no_b2b": gstr2.supplier_invoice_no_b2b,
                    "invoice_value_b2b": str(gstr2.invoice_value_b2b),
                    "supply_type_b2b": gstr2.supply_type_b2b,
                    
                    "gstin_uin_supplier_cdr": gstr2.gstin_uin_supplier_cdr,
                    "supplier_name_cdr": gstr2.supplier_name_cdr,
                    "debit_credit_note_no_cdr": gstr2.debit_credit_note_no_cdr,
                    "debit_credit_note_date_cdr": gstr2.debit_credit_note_date_cdr,
                    "original_invoice_number_cdr": gstr2.original_invoice_number_cdr,
                    "original_invoice_date_cdr": gstr2.original_invoice_date_cdr,
                    "note_type_cdr": gstr2.note_type_cdr,
                    "note_value_cdr": str(gstr2.note_value_cdr),
                    "supply_type_cdr": gstr2.supply_type_cdr,
                    
                    "gstin_uin_supplier_b2bur": gstr2.gstin_uin_supplier_b2bur,
                    "supplier_name_b2bur": gstr2.supplier_name_b2bur,
                    "invoice_number_b2bur": gstr2.invoice_number_b2bur,
                    "invoice_date_b2bur": gstr2.invoice_date_b2bur,
                    "place_of_supply_b2bur": gstr2.place_of_supply_b2bur,
                    "supplier_invoice_no_b2bur": gstr2.supplier_invoice_no_b2bur,
                    "invoice_value_b2bur": str(gstr2.invoice_value_b2bur),
                    "supply_type_b2bur": gstr2.supply_type_b2bur,
                    
                    "supplier_name_import_services": gstr2.supplier_name_import_services,
                    "supplier_invoice_number_import_services": gstr2.supplier_invoice_number_import_services,
                    "invoice_date_import_services": gstr2.invoice_date_import_services,
                    "supplier_invoice_date_import_services": gstr2.supplier_invoice_date_import_services,
                    "total_invoice_value_import_services": str(gstr2.total_invoice_value_import_services),
                    
                    "supplier_name_import_goods": gstr2.supplier_name_import_goods,
                    "invoice_date_import_goods": gstr2.invoice_date_import_goods,
                    "bill_of_entry_no_import_goods": gstr2.bill_of_entry_no_import_goods,
                    "bill_of_entry_date_import_goods": gstr2.bill_of_entry_date_import_goods,
                    "port_code_import_goods": gstr2.port_code_import_goods,
                    "total_invoice_value_import_goods": str(gstr2.total_invoice_value_import_goods),
                    
                    "gstin_uin_supplier_cdunr": gstr2.gstin_uin_supplier_cdunr,
                    "supplier_name_cdunr": gstr2.supplier_name_cdunr,
                    "debit_credit_note_no_cdunr": gstr2.debit_credit_note_no_cdunr,
                    "debit_credit_note_date_cdunr": gstr2.debit_credit_note_date_cdunr,
                    "original_invoice_number_cdunr": gstr2.original_invoice_number_cdunr,
                    "original_invoice_date_cdunr": gstr2.original_invoice_date_cdunr,
                    "note_type_cdunr": gstr2.note_type_cdunr,
                    "note_value_cdunr": str(gstr2.note_value_cdunr),
                    "supply_type_cdunr": gstr2.supply_type_cdunr,
                    
                    "description_nil_rated": gstr2.description_nil_rated,
                    "composition_taxable_person_nil_rated": gstr2.composition_taxable_person_nil_rated,
                    "nil_rated_supplies_nil_rated": str(gstr2.nil_rated_supplies_nil_rated),
                    "exempted_supplies_nil_rated": str(gstr2.exempted_supplies_nil_rated),
                    "non_gst_supplies_nil_rated": str(gstr2.non_gst_supplies_nil_rated),
                    
                    "hsn_code_hsn": gstr2.hsn_code_hsn,
                    "description_hsn": gstr2.description_hsn,
                    "uqc_hsn": gstr2.uqc_hsn,
                    "total_quantity_hsn": str(gstr2.total_quantity_hsn),
                    "total_taxable_value_hsn": str(gstr2.total_taxable_value_hsn),
                    "rate_percentage_hsn": str(gstr2.rate_percentage_hsn),
                    "integrated_tax_hsn": str(gstr2.integrated_tax_hsn),
                    "central_tax_hsn": str(gstr2.central_tax_hsn),
                    "state_ut_tax_hsn": str(gstr2.state_ut_tax_hsn),
                    "cess_tax_hsn": str(gstr2.cess_tax_hsn),
                }

                return JsonResponse(response_data, safe=False)
            else:
                return JsonResponse({"error": "Record not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# ----------------------------UPDATE GSTR2----------------------------

@csrf_exempt

def update_gstr2(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            gstr2_id = data.get("gstr2_id")

            if not gstr2_id:
                return JsonResponse({"error": "ID is required."}, status=400)

            try:
                gstr2 = GSTR2.objects.get(id=gstr2_id)
            except GSTR2.DoesNotExist:
                return JsonResponse({"error": "Record not found."}, status=404)

            gstr2.gstin_uin_supplier_b2b = data.get("gstin_uin_supplier_b2b", gstr2.gstin_uin_supplier_b2b)
            gstr2.supplier_name_b2b = data.get("supplier_name_b2b", gstr2.supplier_name_b2b)
            gstr2.invoice_number_b2b = data.get("invoice_number_b2b", gstr2.invoice_number_b2b)
            gstr2.invoice_date_b2b = data.get("invoice_date_b2b", gstr2.invoice_date_b2b)
            gstr2.place_of_supply_b2b = data.get("place_of_supply_b2b", gstr2.place_of_supply_b2b)
            gstr2.supplier_invoice_no_b2b = data.get("supplier_invoice_no_b2b", gstr2.supplier_invoice_no_b2b)
            gstr2.invoice_value_b2b = data.get("invoice_value_b2b", gstr2.invoice_value_b2b)
            gstr2.supply_type_b2b = data.get("supply_type_b2b", gstr2.supply_type_b2b)

            gstr2.gstin_uin_supplier_cdr = data.get("gstin_uin_supplier_cdr", gstr2.gstin_uin_supplier_cdr)
            gstr2.supplier_name_cdr = data.get("supplier_name_cdr", gstr2.supplier_name_cdr)
            gstr2.debit_credit_note_no_cdr = data.get("debit_credit_note_no_cdr", gstr2.debit_credit_note_no_cdr)
            gstr2.debit_credit_note_date_cdr = data.get("debit_credit_note_date_cdr", gstr2.debit_credit_note_date_cdr)
            gstr2.original_invoice_number_cdr = data.get("original_invoice_number_cdr", gstr2.original_invoice_number_cdr)
            gstr2.original_invoice_date_cdr = data.get("original_invoice_date_cdr", gstr2.original_invoice_date_cdr)
            gstr2.note_type_cdr = data.get("note_type_cdr", gstr2.note_type_cdr)
            gstr2.note_value_cdr = data.get("note_value_cdr", gstr2.note_value_cdr)
            gstr2.supply_type_cdr = data.get("supply_type_cdr", gstr2.supply_type_cdr)

            gstr2.gstin_uin_supplier_b2bur = data.get("gstin_uin_supplier_b2bur", gstr2.gstin_uin_supplier_b2bur)
            gstr2.supplier_name_b2bur = data.get("supplier_name_b2bur", gstr2.supplier_name_b2bur)
            gstr2.invoice_number_b2bur = data.get("invoice_number_b2bur", gstr2.invoice_number_b2bur)
            gstr2.invoice_date_b2bur = data.get("invoice_date_b2bur", gstr2.invoice_date_b2bur)
            gstr2.place_of_supply_b2bur = data.get("place_of_supply_b2bur", gstr2.place_of_supply_b2bur)
            gstr2.supplier_invoice_no_b2bur = data.get("supplier_invoice_no_b2bur", gstr2.supplier_invoice_no_b2bur)
            gstr2.invoice_value_b2bur = data.get("invoice_value_b2bur", gstr2.invoice_value_b2bur)
            gstr2.supply_type_b2bur = data.get("supply_type_b2bur", gstr2.supply_type_b2bur)

            gstr2.supplier_name_import_services = data.get("supplier_name_import_services", gstr2.supplier_name_import_services)
            gstr2.supplier_invoice_number_import_services = data.get("supplier_invoice_number_import_services", gstr2.supplier_invoice_number_import_services)
            gstr2.invoice_date_import_services = data.get("invoice_date_import_services", gstr2.invoice_date_import_services)
            gstr2.supplier_invoice_date_import_services = data.get("supplier_invoice_date_import_services", gstr2.supplier_invoice_date_import_services)
            gstr2.total_invoice_value_import_services = data.get("total_invoice_value_import_services", gstr2.total_invoice_value_import_services)

            gstr2.supplier_name_import_goods = data.get("supplier_name_import_goods", gstr2.supplier_name_import_goods)
            gstr2.invoice_date_import_goods = data.get("invoice_date_import_goods", gstr2.invoice_date_import_goods)
            gstr2.bill_of_entry_no_import_goods = data.get("bill_of_entry_no_import_goods", gstr2.bill_of_entry_no_import_goods)
            gstr2.bill_of_entry_date_import_goods = data.get("bill_of_entry_date_import_goods", gstr2.bill_of_entry_date_import_goods)
            gstr2.port_code_import_goods = data.get("port_code_import_goods", gstr2.port_code_import_goods)
            gstr2.total_invoice_value_import_goods = data.get("total_invoice_value_import_goods", gstr2.total_invoice_value_import_goods)

            gstr2.gstin_uin_supplier_cdunr = data.get("gstin_uin_supplier_cdunr", gstr2.gstin_uin_supplier_cdunr)
            gstr2.supplier_name_cdunr = data.get("supplier_name_cdunr", gstr2.supplier_name_cdunr)
            gstr2.debit_credit_note_no_cdunr = data.get("debit_credit_note_no_cdunr", gstr2.debit_credit_note_no_cdunr)
            gstr2.debit_credit_note_date_cdunr = data.get("debit_credit_note_date_cdunr", gstr2.debit_credit_note_date_cdunr)
            gstr2.original_invoice_number_cdunr = data.get("original_invoice_number_cdunr", gstr2.original_invoice_number_cdunr)
            gstr2.original_invoice_date_cdunr = data.get("original_invoice_date_cdunr", gstr2.original_invoice_date_cdunr)
            gstr2.note_type_cdunr = data.get("note_type_cdunr", gstr2.note_type_cdunr)
            gstr2.note_value_cdunr = data.get("note_value_cdunr", gstr2.note_value_cdunr)
            gstr2.supply_type_cdunr = data.get("supply_type_cdunr", gstr2.supply_type_cdunr)

            gstr2.description_nil_rated = data.get("description_nil_rated", gstr2.description_nil_rated)
            gstr2.composition_taxable_person_nil_rated = data.get("composition_taxable_person_nil_rated", gstr2.composition_taxable_person_nil_rated)
            gstr2.nil_rated_supplies_nil_rated = data.get("nil_rated_supplies_nil_rated", gstr2.nil_rated_supplies_nil_rated)
            gstr2.exempted_supplies_nil_rated = data.get("exempted_supplies_nil_rated", gstr2.exempted_supplies_nil_rated)
            gstr2.non_gst_supplies_nil_rated = data.get("non_gst_supplies_nil_rated", gstr2.non_gst_supplies_nil_rated)

            gstr2.hsn_code_hsn = data.get("hsn_code_hsn", gstr2.hsn_code_hsn)
            gstr2.description_hsn = data.get("description_hsn", gstr2.description_hsn)
            gstr2.uqc_hsn = data.get("uqc_hsn", gstr2.uqc_hsn)
            gstr2.total_quantity_hsn = data.get("total_quantity_hsn", gstr2.total_quantity_hsn)
            gstr2.total_taxable_value_hsn = data.get("total_taxable_value_hsn", gstr2.total_taxable_value_hsn)
            gstr2.rate_percentage_hsn = data.get("rate_percentage_hsn", gstr2.rate_percentage_hsn)
            gstr2.integrated_tax_hsn = data.get("integrated_tax_hsn", gstr2.integrated_tax_hsn)
            gstr2.central_tax_hsn = data.get("central_tax_hsn", gstr2.central_tax_hsn)
            gstr2.state_ut_tax_hsn = data.get("state_ut_tax_hsn", gstr2.state_ut_tax_hsn)
            gstr2.cess_tax_hsn = data.get("cess_tax_hsn", gstr2.cess_tax_hsn)

            gstr2.save()

            return JsonResponse({"message": "Record updated successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# -----------------------------DELETE GSTR2----------------------------

@csrf_exempt
def delete_gstr2(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)

            gstr2_id = data.get("gstr2_id")

            if not gstr2_id:
                return JsonResponse({"error": "ID is required."}, status=400)

            try:
                gstr2 = GSTR2.objects.get(id=gstr2_id)
            except GSTR2.DoesNotExist:
                return JsonResponse({"error": "Record not found."}, status=404)

            gstr2.delete()

            return JsonResponse({"message": "Record deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only DELETE method is allowed."}, status=405)

# # --------------------------STOCK GROUP TAX DETAILS--------------------------------------------------

@csrf_exempt
def stock_group_tax_details(request):
    return async_to_sync(async_stock_group_tax_details)(request)

async def async_stock_group_tax_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode())
            taxability = data.get('taxability')
            applicable_from = data.get('applicable_from')
            tax_type = data.get('tax_type')
            integrated_tax = data.get('integrated_tax')
            cess = data.get('cess')

            valid_taxability = ['Unknown', 'Exempt', 'Nil Rated', 'Taxable']
            if taxability and taxability not in valid_taxability:
                return JsonResponse({'error': 'Invalid taxability value'}, status=400)

            applicable_from_date = None
            if taxability == 'Nil Rated':
                applicable_from_date = datetime.today().date()
            else:
                applicable_from_date = None

            stock_group_tax = await sync_to_async(TaxDetails.objects.create)(
                taxability=taxability,
                applicable_from=applicable_from_date,
                tax_type=tax_type,
                integrated_tax=integrated_tax,
                cess=cess
            )

            return JsonResponse({
                'message': 'Stock Group Tax Details stored successfully',
                'data': {
                    'id': stock_group_tax.id,
                    'taxability': stock_group_tax.taxability,
                    'applicable_from': stock_group_tax.applicable_from,
                    'tax_type': stock_group_tax.tax_type,
                    'integrated_tax': stock_group_tax.integrated_tax,
                    'cess': stock_group_tax.cess,
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# # -------------------------------GET TAX  DETAILS-------------------------

@csrf_exempt
def get_stock_group_tax_details(request):
    return async_to_sync(async_get_stock_group_tax_details)(request)

async def async_get_stock_group_tax_details(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))
            id = data.get('id')
            required_fields = [
                "taxability","applicable_from" ,"tax_type" ,"integrated_tax" ,"cess"
            ]

            missing_fields = [field for field in required_fields if field not in data or data[field] == ""]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)



            if not id:
                return JsonResponse({'error': 'ID is required'}, status=400)

            try:
                stock_group_tax = await sync_to_async(TaxDetails.objects.get)(id=id)
                return JsonResponse({
                    'message': 'Stock Group Tax Details retrieved successfully',
                    'data': {
                        'id': stock_group_tax.id,
                        'taxability': stock_group_tax.taxability,
                        'applicable_from': stock_group_tax.applicable_from,
                        'tax_type': stock_group_tax.tax_type,
                        'integrated_tax': stock_group_tax.integrated_tax,
                        'cess': stock_group_tax.cess,
                    }
                }, status=200)

            except TaxDetails.DoesNotExist:
                return JsonResponse({'error': 'Stock Group Tax Details not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ----------------------UPDATE STOCK GROUP TAX DETAILS -----------------------------------

@csrf_exempt
def update_stock_group_tax_details(request):
    return async_to_sync(async_update_stock_group_tax_details)(request)

async def async_update_stock_group_tax_details(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))
            id = data.get('id')
            taxability = data.get('taxability')
            tax_type = data.get('tax_type')
            integrated_tax = data.get('integrated_tax')
            cess = data.get('cess')

            if not id:
                return JsonResponse({'error': 'ID is required'}, status=400)

            try:
                stock_group_tax = await sync_to_async(TaxDetails.objects.get)(id=id)

                if taxability:
                    stock_group_tax.taxability = taxability

                if taxability == 'Nil Rated':
                    stock_group_tax.applicable_from = datetime.today().date()
                else:
                    stock_group_tax.applicable_from = None

                if tax_type:
                    stock_group_tax.tax_type = tax_type

                if integrated_tax is not None:
                    stock_group_tax.integrated_tax = integrated_tax

                if cess is not None:
                    stock_group_tax.cess = cess

                await sync_to_async(stock_group_tax.save)()

                return JsonResponse({
                    'message': 'Stock Group Tax Details updated successfully',
                    'data': {
                        'id': stock_group_tax.id,
                        'taxability': stock_group_tax.taxability,
                        'applicable_from': stock_group_tax.applicable_from,
                        'tax_type': stock_group_tax.tax_type,
                        'integrated_tax': stock_group_tax.integrated_tax,
                        'cess': stock_group_tax.cess,
                    }
                }, status=200)

            except TaxDetails.DoesNotExist:
                return JsonResponse({'error': 'Stock Group Tax Details not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ----------------------DELETE STOCK GROUP TAX DETAILS -----------------------------------

@csrf_exempt
def delete_stock_group_tax_details(request):
    return async_to_sync(async_delete_stock_group_tax_details)(request)

async def async_delete_stock_group_tax_details(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            id = data.get('id')

            if not id:
                return JsonResponse({'error': 'ID is required'}, status=400)

            try:
                stock_group_tax = await sync_to_async(TaxDetails.objects.get)(id=id)
                await sync_to_async(stock_group_tax.delete)()

                return JsonResponse({'message': 'Stock Group Tax Details deleted successfully'}, status=200)

            except TaxDetails.DoesNotExist:
                return JsonResponse({'error': 'Stock Group Tax Details not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

# ----------------------CREATE E-WAY BILL DETAILS-------------------------------
@csrf_exempt
def create_ewaybill(request):
    return async_to_sync(async_create_ewaybill)(request)

async def async_create_ewaybill(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            eway_bill_no = data.get('eway_bill_no')
            date = data.get('date')
            dispatch_from = data.get('dispatch_from')
            ship_to = data.get('ship_to')
            transporter_name = data.get('transporter_name')
            new_transport_for_shipment = data.get('new_transport_for_shipment')
            transport_id = data.get('transport_id')
            mode = data.get('mode')
            doc_lading_rr_airway_no = data.get('doc_lading_rr_airway_no')
            vehicle_number = data.get('vehicle_number')
            vehicle_type = data.get('vehicle_type')
            date_of_transport = data.get('date_of_transport')

            if transporter_name == "none":
                transporter_name = "none"  
                new_transport_for_shipment = None
            elif transporter_name == "new":
                if not new_transport_for_shipment:
                    return JsonResponse({
                        "message": "new_transport_for_shipment is required when transporter_name is 'new'."
                    }, status=400)

            required_fields = [
                "eway_bill_no","date" ,"dispatch_from" ,"ship_to" ,"transporter_name","new_transport_for_shipment","transport_id","mode","doc_lading_rr_airway_no","vehicle_number","vehicle_type","date_of_transport"
            ]

            missing_fields = [field for field in required_fields if field not in data or data[field] == ""]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            await sync_to_async(EWayBill.objects.create)(
                eway_bill_no=eway_bill_no,
                date=date,
                dispatch_from=dispatch_from,
                ship_to=ship_to,
                transporter_name=transporter_name,
                new_transport_for_shipment=new_transport_for_shipment,
                transport_id=transport_id,
                mode=mode,
                doc_lading_rr_airway_no=doc_lading_rr_airway_no,
                vehicle_number=vehicle_number,
                vehicle_type=vehicle_type,
                date_of_transport=date_of_transport,
            )

            return JsonResponse({
                "message": "EWayBill created successfully."
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)

# -------------------- GET E-WAY BILL ----------------------
@csrf_exempt
def get_ewaybill(request):
    return async_to_sync(async_get_ewaybill)(request)

async def async_get_ewaybill(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            
            ewaybill_id = data.get('id')
            
            if not ewaybill_id:
                return JsonResponse({"message": "ID is required."}, status=400)
            
            try:
                ewaybill = await sync_to_async(EWayBill.objects.get)(id=ewaybill_id)
            except EWayBill.DoesNotExist:
                return JsonResponse({"message": "EWayBill not found."}, status=404)
            
            return JsonResponse({
                "message": "EWayBill retrieved successfully.",
                "data": {
                    "id": ewaybill.id,
                    "eway_bill_no": ewaybill.eway_bill_no,
                    "date": ewaybill.date,
                    "dispatch_from": ewaybill.dispatch_from,
                    "ship_to": ewaybill.ship_to,
                    "transporter_name": ewaybill.transporter_name,
                    "new_transport_for_shipment": ewaybill.new_transport_for_shipment,
                    "transport_id": ewaybill.transport_id,
                    "mode": ewaybill.mode,
                    "doc_lading_rr_airway_no": ewaybill.doc_lading_rr_airway_no,
                    "vehicle_number": ewaybill.vehicle_number,
                    "vehicle_type": ewaybill.vehicle_type,
                    "date_of_transport": ewaybill.date_of_transport,
                }
            }, status=200)
        
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only GET method is allowed."}, status=405)

# -------------------- UPDATE E-WAY BILL ----------------------
@csrf_exempt
def update_ewaybill(request):
    return async_to_sync(async_update_ewaybill)(request)

async def async_update_ewaybill(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            ewaybill_id = data.get('id')

            if not ewaybill_id:
                return JsonResponse({"message": "ID is required to update an EWayBill."}, status=400)

            try:
                ewaybill = await sync_to_async(EWayBill.objects.get)(id=ewaybill_id)
            except EWayBill.DoesNotExist:
                return JsonResponse({"message": "EWayBill with the given ID does not exist."}, status=404)

            ewaybill.eway_bill_no = data.get('eway_bill_no', ewaybill.eway_bill_no)
            ewaybill.date = data.get('date', ewaybill.date)
            ewaybill.dispatch_from = data.get('dispatch_from', ewaybill.dispatch_from)
            ewaybill.ship_to = data.get('ship_to', ewaybill.ship_to)

            transporter_name = data.get('transporter_name', ewaybill.transporter_name)
            new_transport_for_shipment = data.get('new_transport_for_shipment', ewaybill.new_transport_for_shipment)

            if transporter_name == "none":
                ewaybill.transporter_name = None
                ewaybill.new_transport_for_shipment = None
            elif transporter_name == "new":
                ewaybill.transporter_name = transporter_name
                ewaybill.new_transport_for_shipment = new_transport_for_shipment
            else:
                ewaybill.transporter_name = transporter_name
                ewaybill.new_transport_for_shipment = None

            ewaybill.transport_id = data.get('transport_id', ewaybill.transport_id)
            ewaybill.mode = data.get('mode', ewaybill.mode)
            ewaybill.doc_lading_rr_airway_no = data.get('doc_lading_rr_airway_no', ewaybill.doc_lading_rr_airway_no)
            ewaybill.vehicle_number = data.get('vehicle_number', ewaybill.vehicle_number)
            ewaybill.vehicle_type = data.get('vehicle_type', ewaybill.vehicle_type)
            ewaybill.date_of_transport = data.get('date_of_transport', ewaybill.date_of_transport)

            await sync_to_async(ewaybill.save)()
            return JsonResponse({"message": "EWayBill updated successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only PUT method is allowed."}, status=405)

# -------------------- DELETE E-WAY BILL ----------------------
@csrf_exempt
def delete_ewaybill(request):
    return async_to_sync(async_delete_ewaybill)(request)

async def async_delete_ewaybill(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            ewaybill_id = data.get('id')

            if not ewaybill_id:
                return JsonResponse({"message": "ID is required to delete an EWayBill."}, status=400)

            try:
                ewaybill = await sync_to_async(EWayBill.objects.get)(id=ewaybill_id)
            except EWayBill.DoesNotExist:
                return JsonResponse({"message": "EWayBill with the given ID does not exist."}, status=404)

            await sync_to_async(ewaybill.delete)()
            return JsonResponse({"message": "EWayBill deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only DELETE method is allowed."}, status=405)

# ------------------------CREATE E-INVOICE----------------------------------

@csrf_exempt
def create_einvoice(request):
    return async_to_sync(async_create_einvoice)(request)

async def async_create_einvoice(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            ack_no = data.get('ack_no')
            ack_date = data.get('ack_date')
            irn = data.get('irn')
            bill_to_place = data.get('bill_to_place')
            ship_to_place = data.get('ship_to_place')

            required_fields = ['ack_no', 'ack_date', 'irn', 'bill_to_place', 'ship_to_place']
            for field in required_fields:
                if not data.get(field):
                    return JsonResponse({'error': f'Missing required field: {field}'}, status=400)

            await sync_to_async(EInvoice.objects.create)(ack_no=ack_no,
                                                         ack_date=ack_date,
                                                         irn=irn,
                                                         bill_to_place=bill_to_place,
                                                         ship_to_place=ship_to_place)

            return JsonResponse({"message": "e-Invoice created successfully."}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)

# ------------------------GET E-INVOICE DETAILS--------------------------------

@csrf_exempt
def get_einvoice(request):
    return async_to_sync(async_get_einvoice)(request)

async def async_get_einvoice(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            einvoice_id = data.get('id')

            if not einvoice_id:
                return JsonResponse({"message": "ID is required."}, status=400)

            einvoice = await sync_to_async(EInvoice.objects.get)(id=einvoice_id)
            einvoice_data = {
                "ack_no": einvoice.ack_no,
                "ack_date": einvoice.ack_date,
                "irn": einvoice.irn,
                "bill_to_place": einvoice.bill_to_place,
                "ship_to_place": einvoice.ship_to_place
            }

            return JsonResponse({"data": einvoice_data}, status=200)

        except EInvoice.DoesNotExist:
            return JsonResponse({"message": "e-Invoice not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only GET method is allowed."}, status=405)

# --------------------UPDATE E-INVOICE DETAILS---------------------------

@csrf_exempt
def update_einvoice(request):
    return async_to_sync(async_update_einvoice)(request)

async def async_update_einvoice(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            einvoice_id = data.get('id')
            ack_no = data.get('ack_no')
            ack_date = data.get('ack_date')
            irn = data.get('irn')
            bill_to_place = data.get('bill_to_place')
            ship_to_place = data.get('ship_to_place')

            if not einvoice_id:
                return JsonResponse({"message": "ID is required."}, status=400)

            if not ack_no or not ack_date or not irn or not bill_to_place or not ship_to_place:
                return JsonResponse({"message": "All fields are required."}, status=400)

            einvoice = await sync_to_async(EInvoice.objects.get)(id=einvoice_id)
            
            einvoice.ack_no = ack_no
            einvoice.ack_date = ack_date
            einvoice.irn = irn
            einvoice.bill_to_place = bill_to_place
            einvoice.ship_to_place = ship_to_place

            await sync_to_async(einvoice.save)()

            return JsonResponse({"message": "e-Invoice updated successfully."}, status=200)

        except EInvoice.DoesNotExist:
            return JsonResponse({"message": "e-Invoice not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only PUT method is allowed."}, status=405)

# ------------------------DELETE E-INVOICE DETAILS-----------------------------------

@csrf_exempt
def delete_einvoice(request):
    return async_to_sync(async_delete_einvoice)(request)

async def async_delete_einvoice(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            
            einvoice_id = data.get('id')

            if not einvoice_id:
                return JsonResponse({"message": "ID is required."}, status=400)

            einvoice = await sync_to_async(EInvoice.objects.get)(id=einvoice_id)
            await sync_to_async(einvoice.delete)()

            return JsonResponse({"message": "e-Invoice deleted successfully."}, status=200)

        except EInvoice.DoesNotExist:
            return JsonResponse({"message": "e-Invoice not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only DELETE method is allowed."}, status=405)

# ------------------------ NEW CATEGORY ------------------------------

@csrf_exempt
def create_category(request):
    return async_to_sync(async_create_category)(request)

async def async_create_category(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            required_fields = ['category_name', 'cgst', 'sgst', 'igst']
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            category_name = data.get('category_name')
            cgst = data.get('cgst', 0.00)
            sgst = data.get('sgst', 0.00)
            igst = data.get('igst', 0.00)

            await sync_to_async(Category.objects.create)(
                category_name=category_name,
                cgst=cgst,
                sgst=sgst,
                igst=igst
            )

            return JsonResponse({
                "message": f"Category '{category_name}' created successfully."
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# ------------------------------ GET CATEGORY ----------------------------

@csrf_exempt  
def get_category(request):
    return async_to_sync(async_get_category)(request)

async def async_get_category(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))
            category_id = data.get('id')

            if not category_id:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category = await sync_to_async(Category.objects.filter(id=category_id).first)()

            if not category:
                return JsonResponse({"error": "Category not found."}, status=404)

            return JsonResponse({
                "id": category.id,
                "category_name": category.category_name,
                "cgst": category.cgst,
                "sgst": category.sgst,
                "igst": category.igst
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# ------------------------------ UPDATE CATEGORY -------------------------

@csrf_exempt 
def update_category(request):
    return async_to_sync(async_update_category)(request)

async def async_update_category(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))
            category_id = data.get('id')
            category_name = data.get('category_name')
            cgst = data.get('cgst')
            sgst = data.get('sgst')
            igst = data.get('igst')

            if not category_id:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category = await sync_to_async(Category.objects.filter(id=category_id).first)()

            if not category:
                return JsonResponse({"error": "Category not found."}, status=404)

            if category_name:
                category.category_name = category_name
            if cgst is not None:
                category.cgst = cgst
            if sgst is not None:
                category.sgst = sgst
            if igst is not None:
                category.igst = igst

            await sync_to_async(category.save)()

            return JsonResponse({
                "message": f"Category '{category.category_name}' updated successfully.",
                "id": category.id,
                "category_name": category.category_name,
                "cgst": category.cgst,
                "sgst": category.sgst,
                "igst": category.igst
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# ------------------------------ DELETE CATEGORY ----------------------------

@csrf_exempt
def delete_category(request):
    return async_to_sync(async_delete_category)(request)

async def async_delete_category(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            category_id = data.get('id')

            if not category_id:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category = await sync_to_async(Category.objects.filter(id=category_id).first)()

            if not category:
                return JsonResponse({"error": "Category not found."}, status=404)

            await sync_to_async(category.delete)()

            return JsonResponse({
                "message": f"Category with ID {category_id} has been deleted successfully."
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# ----------------- CREATE SUB CATEGORY --------------------
@csrf_exempt
def create_subcategory(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            return async_to_sync(async_create_subcategory)(data)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use POST."}, status=405)

async def async_create_subcategory(data):
    
    required_fields = ['category_id', 'category_name', 'subcategory_name', 'hsn_sac_code']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400) 
    
    category_id = data.get('category_id')  
    category_name = data.get('category_name')  
    subcategory_name = data.get('subcategory_name') 
    hsn_sac_code = data.get('hsn_sac_code')  

    try:
        category = await sync_to_async(Category.objects.get)(id=category_id)

        await sync_to_async(SubCategory.objects.create)(
            category_id=category,
            category_name=category_name,
            subcategory_name=subcategory_name,
            hsn_sac_code=hsn_sac_code
        )

        return JsonResponse({"message": "SubCategory created successfully!"}, status=201)

    except Category.DoesNotExist:
        return JsonResponse({"message": "Category not found!"}, status=404)
    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=400)


# -----------------GET SUB CATEGORY-----------------------

@csrf_exempt
def get_subcategory(request):
    if request.method == "GET":
        data = json.loads(request.body.decode("utf-8"))
        subcategory_id = data.get("subcategory_id")
        
        try:
            return async_to_sync(async_get_subcategory)(subcategory_id)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use POST."}, status=405)

async def async_get_subcategory(subcategory_id):
    try:
        subcategory = await sync_to_async(SubCategory.objects.get)(id=subcategory_id)

        response_data = {
            "subcategory_id": subcategory.id,
            "category_id":subcategory.category_id_id,
            "subcategory_name": subcategory.subcategory_name,
            "hsn_sac_code": subcategory.hsn_sac_code,
            "category_name": subcategory.category_name 
        }
        return JsonResponse(response_data)
    except SubCategory.DoesNotExist:
        return JsonResponse({"message": "Subcategory not found"})


# ---------------UPDATE SUB CATEGORY----------------------

@csrf_exempt
def update_subcategory(request):
    if request.method == "PUT":
        data = json.loads(request.body.decode("utf-8"))

        subcategory_id = data.get("subcategory_id")
        subcategory_name = data.get("subcategory_name")
        hsn_sac_code = data.get("hsn_sac_code")
        category_id = data.get("category_id")
        category_name = data.get("category_name")  

        try:
            return async_to_sync(async_update_subcategory)(
                subcategory_id, subcategory_name, hsn_sac_code, category_id, category_name
            )
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use PUT."}, status=405)


async def async_update_subcategory(subcategory_id, subcategory_name, hsn_sac_code, category_id, category_name):
    try:
        subcategory = await sync_to_async(SubCategory.objects.get)(id=subcategory_id)

        category = await sync_to_async(Category.objects.get)(id=category_id)

        subcategory.subcategory_name = subcategory_name
        subcategory.hsn_sac_code = hsn_sac_code
        subcategory.category_name = category_name  
        subcategory.category_id = category  

        await sync_to_async(subcategory.save)()

        response_data = {
            "message": "SubCategory updated successfully",
            "subcategory_id": subcategory.id,
            "subcategory_name": subcategory.subcategory_name,
            "hsn_sac_code": subcategory.hsn_sac_code,
            "category_id": subcategory.category_id.id,  
            "category_name": subcategory.category_name,  
        }

        return JsonResponse(response_data)

    except SubCategory.DoesNotExist:
        return JsonResponse({"message": "SubCategory not found"}, status=404)

    except Category.DoesNotExist:
        return JsonResponse({"message": "Category not found"}, status=404)


# ---------------DELETE SUB CATEGORY----------------------

@csrf_exempt
def delete_subcategory(request):
    return async_to_sync(async_delete_subcategory)(request)

async def async_delete_subcategory(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            subcategory_id = data.get('id')

            subcategory = await sync_to_async(SubCategory.objects.filter(id=subcategory_id).first)()

            if not subcategory:
                return JsonResponse({"error": "SubCategory not found."}, status=404)

            await sync_to_async(subcategory.delete)()

            return JsonResponse({
                "message": f"SubCategory with ID {subcategory_id} deleted successfully."
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# -----------------CREATE BRAND-------------------------

@csrf_exempt
def create_brand(request):
    if request.method == 'POST':
        return async_to_sync(async_create_brand)(request)

async def async_create_brand(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        required_fields = ['brand_name']
        missing_fields = [field for field in required_fields if field not in data or not data[field].strip()]
        
        if missing_fields:
            return JsonResponse(
                {"error": f"Missing or empty field(s): {', '.join(missing_fields)}."},
                status=400
            )

        brand_name = data['brand_name']

        if await sync_to_async(Brand.objects.filter(brand_name=brand_name).exists)():
            return JsonResponse({"error": "Brand already exists."}, status=400)

        brand = await sync_to_async(Brand.objects.create)(brand_name=brand_name)

        return JsonResponse({
            "message": "Brand created successfully.",
            "id": brand.id,
            "brand_name": brand.brand_name
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ------------------------GET BRAND--------------------------------

@csrf_exempt
def get_brand(request):
    if request.method == 'GET':
        return async_to_sync(async_get_brand)(request)

async def async_get_brand(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        if 'id' not in data:
            return JsonResponse({"error": "ID is required."}, status=400)

        brand_id = data['id']
        brand = await sync_to_async(Brand.objects.filter(id=brand_id).first)()

        if not brand:
            return JsonResponse({"error": "Brand not found."}, status=404)

        return JsonResponse({
            "id": brand.id,
            "brand_name": brand.brand_name
        }, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# ------------------------UPDATE BRAND--------------------------------

@csrf_exempt
def update_brand(request):
    if request.method == 'PUT':
        return async_to_sync(async_update_brand)(request)

async def async_update_brand(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        if 'id' not in data or 'brand_name' not in data:
            return JsonResponse({"error": "ID and brand_name are required."}, status=400)

        brand_id = data['id']
        brand_name = data['brand_name']

        brand = await sync_to_async(Brand.objects.filter(id=brand_id).first)()

        if not brand:
            return JsonResponse({"error": "Brand not found."}, status=404)

        brand.brand_name = brand_name
        await sync_to_async(brand.save)()

        return JsonResponse({
            "message": "Brand updated successfully.",
            "id": brand.id,
            "brand_name": brand.brand_name
        }, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# ------------------------DELETE BRAND--------------------------------

@csrf_exempt
def delete_brand(request):
    if request.method == 'DELETE':
        return async_to_sync(async_delete_brand)(request)

async def async_delete_brand(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        if 'id' not in data:
            return JsonResponse({"error": "ID is required."}, status=400)

        brand_id = data['id']
        brand = await sync_to_async(Brand.objects.filter(id=brand_id).first)()

        if not brand:
            return JsonResponse({"error": "Brand not found."}, status=404)

        await sync_to_async(brand.delete)()

        return JsonResponse({"message": f"Brand with ID {brand_id} deleted successfully."}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# ------------------------CREATE UNIT--------------------------------

@csrf_exempt
def create_unit(request):
    if request.method == 'POST':
        return async_to_sync(async_create_unit)(request)

async def async_create_unit(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        required_fields = ['unit', 'full_name', 'allow_decimal']

        for field in required_fields:
            if field not in data:
                return JsonResponse({"error": f"{field} is required."}, status=400)

        unit = data['unit']
        full_name = data['full_name']
        allow_decimal = data['allow_decimal']

        if await sync_to_async(Unit.objects.filter(unit=unit).exists)():
            return JsonResponse({"error": "Unit already exists."}, status=400)

        new_unit = await sync_to_async(Unit.objects.create)(
            unit=unit,
            full_name=full_name,
            allow_decimal=allow_decimal
        )

        return JsonResponse({
            "message": "Unit created successfully.",
            "id": new_unit.id,
            "unit": new_unit.unit,
            "full_name": new_unit.full_name,
            "allow_decimal": new_unit.allow_decimal
        }, status=201)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# ------------------------GET UNIT--------------------------------

@csrf_exempt
def get_unit(request):
    if request.method == 'GET':
        return async_to_sync(async_get_unit)(request)
    else:
        return JsonResponse({"message": "Only GET method is allowed."}, status=405)

async def async_get_unit(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        if 'id' not in data:
            return JsonResponse({"error": "ID is required."}, status=400)

        unit_id = data['id']
        unit = await sync_to_async(Unit.objects.filter(id=unit_id).first)()

        if not unit:
            return JsonResponse({"error": "Unit not found."}, status=404)

        return JsonResponse({
            "id": unit.id,
            "unit": unit.unit,
            "full_name": unit.full_name,
            "allow_decimal": unit.allow_decimal
        }, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# ------------------------UPDATE UNIT--------------------------------

@csrf_exempt
def update_unit(request):
    if request.method == 'PUT':
        return async_to_sync(async_update_unit)(request)

async def async_update_unit(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        if 'id' not in data:
            return JsonResponse({"error": "ID is required."}, status=400)

        unit_id = data['id']
        unit = await sync_to_async(Unit.objects.filter(id=unit_id).first)()

        if not unit:
            return JsonResponse({"error": "Unit not found."}, status=404)

        if 'unit' in data:
            unit.unit = data['unit']
        if 'full_name' in data:
            unit.full_name = data['full_name']
        if 'allow_decimal' in data:
            unit.allow_decimal = data['allow_decimal']

        await sync_to_async(unit.save)()

        return JsonResponse({
            "message": "Unit updated successfully.",
            "id": unit.id,
            "unit": unit.unit,
            "full_name": unit.full_name,
            "allow_decimal": unit.allow_decimal
        }, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
# ------------------------DELETE UNIT--------------------------------
@csrf_exempt
def delete_unit(request):
    if request.method == 'DELETE':
        return async_to_sync(async_delete_unit)(request)

async def async_delete_unit(request):
    try:
        data = json.loads(request.body.decode('utf-8'))

        if 'id' not in data:
            return JsonResponse({"error": "ID is required."}, status=400)

        unit_id = data['id']
        unit = await sync_to_async(Unit.objects.filter(id=unit_id).first)()

        if not unit:
            return JsonResponse({"error": "Unit not found."}, status=404)

        await sync_to_async(unit.delete)()

        return JsonResponse({"message": f"Unit with ID {unit_id} deleted successfully."}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ----------------------- CREATE PRODUCT DETAILS----------------
import cloudinary.uploader

@csrf_exempt
def create_product(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_create_product)(data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

async def async_create_product(data):
    try:
        required_fields = ['customer_id', 'product_name', 'category_name', 'sub_category_name', 'brand_name', 'unit', 'product_code']
        missing_fields = [field for field in required_fields if field not in data]

        if missing_fields:
            return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

        existing_product = await sync_to_async(lambda: ProductDetails.objects.filter(sub_category_name=data['sub_category_name'], brand_name=data['brand_name'], product_code=data['product_code']).exists())()

        if existing_product:
            return JsonResponse({"error": "Subcategory, Brand, and Product Code combination already exists"}, status=400)

        try:
            customer = await sync_to_async(Customer.objects.get)(id=data['customer_id'])
        except Customer.DoesNotExist:
            return JsonResponse({"error": "Invalid customer ID"}, status=400)

        # Upload Image to Cloudinary
        base64_img = data.get("image_url", "")
        cloudinary_url = ""
        if base64_img:
            upload_result = cloudinary.uploader.upload("data:image/png;base64," + base64_img)
            cloudinary_url = upload_result["secure_url"]

        product = await sync_to_async(ProductDetails.objects.create)(
            customer_id=customer, 
            product_name=data['product_name'],
            category_name=data['category_name'],
            sub_category_name=data['sub_category_name'],
            brand_name=data['brand_name'],
            unit=data['unit'],
            product_code=data['product_code'],
            bar_qr_code=data.get('bar_qr_code', ''),
            description=data.get('description', ''),
            image_url=cloudinary_url
        )

        return JsonResponse({"message": "Product details added successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



# --------------------GET PRODUCT ------------------------
@csrf_exempt
def get_product(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_get_product)(data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

async def async_get_product(data):
    try:
        product_id = data.get("product_id")
        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)

        product = await sync_to_async(lambda: ProductDetails.objects.filter(id=product_id).first())()

        if not product:
            return JsonResponse({"error": "Product not found"}, status=404)

        product_data = {
            "product_id": product.id,
            "customer_id": product.customer_id_id,
            "product_name": product.product_name,
            "category_name": product.category_name,
            "sub_category_name": product.sub_category_name,
            "brand_name": product.brand_name,
            "unit": product.unit,
            "product_code": product.product_code,
            "bar_qr_code": product.bar_qr_code,
            "description": product.description,
            "image_url":product.image_url
        }

        return JsonResponse({"product_details": product_data}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# ----------------------------------UPDATE PRODUCT------------------------
@csrf_exempt
def update_product(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_update_product)(data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

async def async_update_product(data):
    try:
        product_id = data.get("product_id")
        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)

        product = await sync_to_async(ProductDetails.objects.get)(id=product_id)

        product.product_name = data.get("product_name", product.product_name)
        product.category_name = data.get("category_name", product.category_name)
        product.sub_category_name = data.get("sub_category_name", product.sub_category_name)
        product.brand_name = data.get("brand_name", product.brand_name)
        product.unit = data.get("unit", product.unit)
        product.product_code = data.get("product_code", product.product_code)
        product.bar_qr_code = data.get("bar_qr_code", product.bar_qr_code)
        product.description = data.get("description", product.description)

        base64_img = data.get("image_url", "")
        if base64_img:
            upload_result = cloudinary.uploader.upload("data:image/png;base64," + base64_img)
            product.image_url = upload_result["secure_url"]

        await sync_to_async(product.save)()

        response_data = {
            "message": "Product details updated successfully",
            "product_id": product.id,
            "customer_id": product.customer_id_id,
            "product_name": product.product_name,
            "category_name": product.category_name,
            "sub_category_name": product.sub_category_name,
            "brand_name": product.brand_name,
            "unit": product.unit,
            "product_code": product.product_code,
            "bar_qr_code": product.bar_qr_code,
            "description": product.description,
            "image_url": product.image_url,
        }

        return JsonResponse(response_data, status=200)

    except ProductDetails.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)



# -----------------------DELETE PRODUCT DETAILS-------------------------------
@csrf_exempt
def delete_product(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_delete_product)(data)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

async def async_delete_product(data):
    try:
        product_id = data.get("product_id")
        if not product_id:
            return JsonResponse({"error": "Product ID is required"}, status=400)

        product = await sync_to_async(lambda: ProductDetails.objects.filter(id=product_id).first())()

        if not product:
            return JsonResponse({"error": "Product not found"}, status=404)

        await sync_to_async(product.delete)()

        return JsonResponse({"message": "Product deleted successfully"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ---------------- CREATE PRICE DETAILS ----------------------------

@csrf_exempt
def create_price_details(request):
    return async_to_sync(async_create_price_details)(request)

async def async_create_price_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            product_id = data.get('product_id')
            purchase_price = data.get('purchase_price')
            sale_price = data.get('sale_price')
            min_sale_price = data.get('min_sale_price')
            mrp = data.get('mrp')
            discount = data.get('discount')
            hsn_sac_code = data.get('hsn_sac_code')

            required_fields = ['product_id', 'purchase_price', 'sale_price', 'min_sale_price' ,'mrp', 'discount' ,'hsn_sac_code']
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            try:
                product = await sync_to_async(ProductDetails.objects.get)(id=product_id)

                price_details = PriceDetails(
                    product=product,
                    purchase_price=purchase_price,
                    sale_price=sale_price,
                    min_sale_price=min_sale_price,
                    mrp=mrp,
                    discount=discount,
                    hsn_sac_code=hsn_sac_code
                )
                
                await sync_to_async(price_details.save)()

                return JsonResponse({"message": "Price details created successfully!"}, status=201)

            except ProductDetails.DoesNotExist:
                return JsonResponse({"error": "Product not found."}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)



# ---------------- GET PRICE DETAILS ----------------------------

@csrf_exempt
def get_price_details(request):
    return async_to_sync(async_get_price_details)(request)

async def async_get_price_details(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            price_details_id = data.get('price_details_id')

            if not price_details_id:
                return JsonResponse({"error": "price_details_id is required."}, status=400)

            try:
                price_details = await sync_to_async(PriceDetails.objects.get)(id=price_details_id)

                response_data = {
                    "product_id": price_details.product_id,
                    "purchase_price": str(price_details.purchase_price),
                    "sale_price": str(price_details.sale_price),
                    "min_sale_price": str(price_details.min_sale_price),
                    "mrp": str(price_details.mrp),
                    "discount": str(price_details.discount),
                    "hsn_sac_code": price_details.hsn_sac_code
                }

                return JsonResponse(response_data, status=200)

            except PriceDetails.DoesNotExist:
                return JsonResponse({"error": "PriceDetails not found."}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)

# ---------------- UPDATE PRICE DETAILS ----------------------------

@csrf_exempt
def update_price_details(request):
    return async_to_sync(async_update_price_details)(request)

async def async_update_price_details(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            price_details_id = data.get('price_details_id')

            if not price_details_id:
                return JsonResponse({"error": "price_details_id is required."}, status=400)

            try:
                price_details = await sync_to_async(PriceDetails.objects.get)(id=price_details_id)
            except PriceDetails.DoesNotExist:
                return JsonResponse({"error": "PriceDetails not found."}, status=404)

            purchase_price = data.get('purchase_price', price_details.purchase_price)
            sale_price = data.get('sale_price', price_details.sale_price)
            min_sale_price = data.get('min_sale_price', price_details.min_sale_price)
            mrp = data.get('mrp', price_details.mrp)
            discount = data.get('discount', price_details.discount)
            hsn_sac_code = data.get('hsn_sac_code', price_details.hsn_sac_code)

            price_details.purchase_price = purchase_price
            price_details.sale_price = sale_price
            price_details.min_sale_price = min_sale_price
            price_details.mrp = mrp
            price_details.discount = discount
            price_details.hsn_sac_code = hsn_sac_code

            await sync_to_async(price_details.save)()

            return JsonResponse({"message": "Price details updated successfully!"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)

# ---------------- DELETE PRICE DETAILS ----------------------------

@csrf_exempt
def delete_price_details(request):
    return async_to_sync(async_delete_price_details)(request)

async def async_delete_price_details(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            price_details_id = data.get('price_details_id')

            if not price_details_id:
                return JsonResponse({"error": "price_details_id is required."}, status=400)

            try:
                price_details = await sync_to_async(PriceDetails.objects.get)(id=price_details_id)
            except PriceDetails.DoesNotExist:
                return JsonResponse({"error": "PriceDetails not found."}, status=404)

            await sync_to_async(price_details.delete)()

            return JsonResponse({"message": "Price details deleted successfully!"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)
# --------------------------------------

@csrf_exempt
def calculate_tax_and_total(request):
    return async_to_sync(async_calculate_tax_and_total)(request)

async def async_calculate_tax_and_total(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)

            sale_price = float(data.get('sale_price', 0))
            discount = float(data.get('discount', 0))
            cgst_percentage = float(data.get('cgst_percentage', 0))
            sgst_percentage = float(data.get('sgst_percentage', 0))
            igst_percentage = float(data.get('igst_percentage', 0))

            if sale_price <= 0 or (cgst_percentage < 0 or sgst_percentage < 0 or igst_percentage < 0):
                return JsonResponse({"error": "Invalid input values. Sale price and tax percentages must be positive."}, status=400)

            cgst_value = (cgst_percentage / 100) * sale_price
            sgst_value = (sgst_percentage / 100) * sale_price
            igst_value = (igst_percentage / 100) * sale_price

            if discount > 0:
                discount_amount = (discount / 100) * sale_price
                sale_price_after_discount = sale_price - discount_amount
            else:
                sale_price_after_discount = sale_price

            total_amount = sale_price_after_discount + igst_value + cgst_value + sgst_value

            response_data = {
                "cgst_value": round(cgst_value, 2),
                "sgst_value": round(sgst_value, 2),
                "igst_value": round(igst_value, 2),
                "total_amount": round(total_amount, 2)
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=405)


# ----------------------STORE GST DETAILS ------------------------------
@csrf_exempt
def create_price_gst_details(request):
        return async_to_sync(async_create_price_gst_details)(request)

async def async_create_price_gst_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body) 

            required_fields = [
                'product_id', 'cgst_value', 'sgst_value', 'igst_value', 
                'total_amount', 'cgst_percentage', 'sgst_percentage', 'igst_percentage'
            ]
            
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({'error': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)
            
            product_id = data.get('product_id')
    
            if not product_id:
                return JsonResponse({'error': 'Product ID is required.'}, status=400)
    
            try:
                product = await sync_to_async(ProductDetails.objects.get)(id=product_id)
    
                gst_details = GSTDetails(
                    product = product,                   
                    cgst_value=data.get('cgst_value'),
                    sgst_value=data.get('sgst_value'),
                    igst_value=data.get('igst_value'),
                    total_amount=data.get('total_amount'),
                    cgst_percentage=data.get('cgst_percentage'),
                    sgst_percentage=data.get('sgst_percentage'),
                    igst_percentage=data.get('igst_percentage'),
                )
    
                await sync_to_async(gst_details.save)()
    
                return JsonResponse({'message': 'GST details stored successfully.'}, status=201)
    
            except ProductDetails.DoesNotExist:
                return JsonResponse({'error': 'Product not found.'}, status=404)
    
        except Exception as e:
            return JsonResponse({'error': 'Something went wrong.'}, status=500)

    return JsonResponse({'error': 'Invalid method. Please use POST.'}, status=405)

# -----------------------------GET GST DETAILS ---------------------------
@csrf_exempt
def get_price_gst_details(request):
        return async_to_sync(async_get_price_gst_details)(request)

async def async_get_price_gst_details(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            gst_details_id = data.get('gst_details_id')
    
            if not gst_details_id:
                return JsonResponse({'error': 'GST Details ID is required.'}, status=400)
    
            try:
                gst_details = await sync_to_async(GSTDetails.objects.get)(id=gst_details_id)
    
                gst_data = {
                    # 'product_category': gst_details.product.name if hasattr(gst_details.product, 'name') else 'No category name available',
                    'product_id':gst_details.product_id,
                    'cgst_value': gst_details.cgst_value,
                    'sgst_value': gst_details.sgst_value,
                    'igst_value': gst_details.igst_value,
                    'total_amount': gst_details.total_amount,
                    'cgst_percentage': gst_details.cgst_percentage,
                    'sgst_percentage': gst_details.sgst_percentage,
                    'igst_percentage': gst_details.igst_percentage,
                }
    
                return JsonResponse({'gst_details': gst_data}, status=200)
    
            except GSTDetails.DoesNotExist:
                return JsonResponse({'error': 'GST details not found.'}, status=404)
    
        except Exception as e:
            return JsonResponse({'error': 'Something went wrong.', 'details': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid method. Please use POST.'}, status=405)

# ------------------UPDATE GST DETAILS --------------------------------
@csrf_exempt
def update_price_gst_details(request):
        return async_to_sync(async_update_price_gst_details)(request)

async def async_update_price_gst_details(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            gst_details_id = data.get('gst_details_id')
    
            if not gst_details_id:
                return JsonResponse({'error': 'GST Details ID is required.'}, status=400)
    
            try:
                gst_details = await sync_to_async(GSTDetails.objects.get)(id=gst_details_id)
                gst_details.cgst_value = data.get('cgst_value', gst_details.cgst_value)
                gst_details.sgst_value = data.get('sgst_value', gst_details.sgst_value)
                gst_details.igst_value = data.get('igst_value', gst_details.igst_value)
                gst_details.total_amount = data.get('total_amount', gst_details.total_amount)
                gst_details.cgst_percentage = data.get('cgst_percentage', gst_details.cgst_percentage)
                gst_details.sgst_percentage = data.get('sgst_percentage', gst_details.sgst_percentage)
                gst_details.igst_percentage = data.get('igst_percentage', gst_details.igst_percentage)
    
                await sync_to_async(gst_details.save)()
    
                return JsonResponse({'message': 'GST details updated successfully.'}, status=200)
    
            except GSTDetails.DoesNotExist:
                return JsonResponse({'error': 'GST details not found.'}, status=404)
    
        except Exception as e:
            return JsonResponse({'error': 'Something went wrong.'}, status=500)

    return JsonResponse({'error': 'Invalid method. Please use POST.'}, status=405)

# ----------------------DELETE GST DETAILS----------------------------
@csrf_exempt
def delete_price_gst_details(request):
        return async_to_sync(async_delete_price_gst_details)(request)

async def async_delete_price_gst_details(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            gst_details_id = data.get('gst_details_id')
    
            if not gst_details_id:
                return JsonResponse({'error': 'GST Details ID is required.'}, status=400)
    
            try:
                gst_details = await sync_to_async(GSTDetails.objects.get)(id=gst_details_id)
    
                await sync_to_async(gst_details.delete)()
    
                return JsonResponse({'message': 'GST details deleted successfully.'}, status=200)
    
            except GSTDetails.DoesNotExist:
                return JsonResponse({'error': 'GST details not found.'}, status=404)
    
        except Exception as e:
            return JsonResponse({'error': 'Something went wrong.'}, status=500)

    return JsonResponse({'error': 'Invalid method. Please use POST.'}, status=405)


# --------------------CREATE STOCK DETAILS---------------------------------

@csrf_exempt
def create_stock_details(request):
    return async_to_sync(async_create_stock_details)(request)

async def async_create_stock_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            product_id = data.get('product_id')
            opening_stock = data.get('opening_stock')
            opening_stock_value = data.get('opening_stock_value')
            low_stock_qty = data.get('low_stock_qty')
            location = data.get('location')

            product = await sync_to_async(ProductDetails.objects.get)(id=product_id)
            
            stock_details = StockDetails(
                product=product,
                opening_stock=opening_stock,
                opening_stock_value=opening_stock_value,
                low_stock_qty=low_stock_qty,
                date=date.today(),
                location=location
            )

            await sync_to_async(stock_details.save)()

            return JsonResponse({"message": "Stock details created successfully!"}, status=201)
        except ProductDetails.DoesNotExist:
            return JsonResponse({"error": "Product not found."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)

# --------------------GET STOCK DETAILS-----------------------------------
@csrf_exempt
def get_stock_details(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body.decode("utf-8"))
            stock_details_id = data.get("stock_details_id")

            if not stock_details_id:
                return JsonResponse({"error": "stock_details_id is required."}, status=400)

            return async_to_sync(async_get_stock_details)(stock_details_id)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    
    return JsonResponse({"error": "Invalid request method."}, status=405)

async def async_get_stock_details(stock_details_id):
    try:
        stock_details = await sync_to_async(StockDetails.objects.get)(id=stock_details_id)

        response_data = {
            "product_id": stock_details.product_id,
            "opening_stock": stock_details.opening_stock,
            "opening_stock_value": str(stock_details.opening_stock_value),
            "low_stock_qty": stock_details.low_stock_qty,
            "date": stock_details.date, 
            "location": stock_details.location
        }
        return JsonResponse(response_data, status=200)
    except StockDetails.DoesNotExist:
        return JsonResponse({"error": "StockDetails not found."}, status=404)

# -------------------UPDATE STOCK DETAILS---------------------------------
@csrf_exempt
def update_stock_details(request):
    return async_to_sync(async_update_stock_details)(request)

async def async_update_stock_details(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            stock_id = data.get('id')
            opening_stock = data.get('opening_stock')
            opening_stock_value = data.get('opening_stock_value')
            low_stock_qty = data.get('low_stock_qty')
            date = data.get('date')
            location = data.get('location')

            if not stock_id:
                return JsonResponse({"error": "ID is required"}, status=400)

            stock_detail = await sync_to_async(StockDetails.objects.get)(id=stock_id)

            if not opening_stock or not opening_stock_value or not low_stock_qty or not location:
                return JsonResponse({"error": "All fields are required"}, status=400)

            product_id = data.get('product_id')
            if product_id:
                try:
                    product = await sync_to_async(ProductDetails.objects.get)(id=product_id)
                    stock_detail.product = product
                except ProductDetails.DoesNotExist:
                    return JsonResponse({"error": "Product not found"}, status=404)

            stock_detail.opening_stock = int(opening_stock)
            stock_detail.opening_stock_value = float(opening_stock_value)
            stock_detail.low_stock_qty = int(low_stock_qty)
            stock_detail.date = parse_date(date) if date else stock_detail.date
            stock_detail.location = location

            await sync_to_async(stock_detail.save)()

            return JsonResponse({"message": "Stock details updated successfully"}, status=200)

        except StockDetails.DoesNotExist:
            return JsonResponse({"error": "Stock detail not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

# -------------------DELETE STOCK DETAILS---------------------------------
@csrf_exempt
def delete_stock_details(request):
    return async_to_sync(async_delete_stock_details)(request)

async def async_delete_stock_details(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            
            stock_id = data.get('id')

            if not stock_id:
                return JsonResponse({"error": "ID is required"}, status=400)

            stock_detail = await sync_to_async(StockDetails.objects.get)(id=stock_id)
            await sync_to_async(stock_detail.delete)()

            return JsonResponse({"message": "Stock detail deleted successfully"}, status=200)

        except StockDetails.DoesNotExist:
            return JsonResponse({"error": "Stock detail not found"}, status=404)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)
# -------------------------STORE EMPLOYEE DETAILS-------------------------

@csrf_exempt
def add_employee(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_add_employee)(data)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use POST."}, status=405)


async def async_add_employee(data):

    required_fields = ["name", "gender", "date_of_birth", "email", "phone_number", "role", "salary", "address"]

    missing_fields = [field for field in required_fields if not data.get(field)]
    
    if missing_fields:
        return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)
    try:
        employee = Customer(
            # employee_id=data.get("employee_id"),
            name=data.get("name"),
            gender=data.get("gender"),
            date_of_birth=data.get("date_of_birth"),
            email=data.get("email"),
            phone_number=data.get("phone_number"),
            role=data.get("role"),
            salary=data.get("salary"),
            address=data.get("address"),
        )
        await sync_to_async(employee.save)()
        return JsonResponse({"message": "Employee added successfully"}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# ----------------------GET EMPLOYEE DEATILS-------------------------
@csrf_exempt
def get_employee(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_get_employee)(data)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use POST."}, status=405)


async def async_get_employee(data):
    employee_id = data.get("employee_id")

    employees = await sync_to_async(lambda: list(Customer.objects.filter(id=employee_id)))()
    
    if employees:
        employee = employees[0]  
        
        response_data = {
            "employee_id": employee.id,
            "name": employee.name,
            "gender": employee.gender,
            "date_of_birth": str(employee.date_of_birth),
            "email": employee.email,
            "phone_number": employee.phone_number,
            "role": employee.role,
            "date_joined": str(employee.date_joined),
            "salary": str(employee.salary),
            "address": employee.address,
        }
        return JsonResponse(response_data, status=200)

    return JsonResponse({"message": "Employee not found"}, status=404)

# -----------------UPDATE EMPLOYEE DETAILS ------------------------------

@csrf_exempt
def update_employee(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_update_employee)(data)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use POST."}, status=405)


async def async_update_employee(data):
    employee_id = data.get("employee_id")

    employees = await sync_to_async(lambda: list(Customer.objects.filter(id=employee_id)))()

    if employees:
        employee = employees[0]  

        employee.name = data.get("name", employee.name)
        employee.gender = data.get("gender", employee.gender)
        employee.date_of_birth = data.get("date_of_birth", employee.date_of_birth)
        employee.email = data.get("email", employee.email)
        employee.phone_number = data.get("phone_number", employee.phone_number)
        employee.role = data.get("role", employee.role)
        employee.salary = data.get("salary", employee.salary)
        employee.address = data.get("address", employee.address)

        await sync_to_async(employee.save)() 

        return JsonResponse({"message": "Employee updated successfully"}, status=200)

    return JsonResponse({"message": "Employee not found"}, status=404)

# -----------------------DELETE EMPLOYEE DETAILS -----------------------
@csrf_exempt
def delete_employee(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body.decode("utf-8"))
            return async_to_sync(async_delete_employee)(data)
        except ValueError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid method. Please use POST."}, status=405)


async def async_delete_employee(data):
    employee_id = data.get("employee_id")

    employees = await sync_to_async(lambda: list(Customer.objects.filter(id=employee_id)))()

    if employees:
        await sync_to_async(lambda: Customer.objects.filter(id=employee_id).delete())()
        return JsonResponse({"message": "Employee deleted successfully"}, status=200)

    return JsonResponse({"message": "Employee not found"}, status=404)


# -----------------REPORT--------------------

@csrf_exempt  
def customer_product_report(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body)
            customer_id = data.get('customer_id')

            if not customer_id:
                return JsonResponse({"message": "Customer ID is required"}, status=400)

            customer = Customer.objects.filter(id=customer_id).first()
            
            if not customer:
                return JsonResponse({"message": "Customer not found"}, status=404)

            products = ProductDetails.objects.filter(customer_id=customer_id)
            product_report = []

            for product in products:
                price_details = PriceDetails.objects.filter(product=product).first()
                gst_details = GSTDetails.objects.filter(product=product).first()
                stock_details = StockDetails.objects.filter(product=product).first()

                product_data = {
                    "product_name": product.product_name,
                    "category_name": product.category_name,
                    "sub_category_name": product.sub_category_name,
                    "brand_name": product.brand_name,
                    "unit": product.unit,
                    "product_code": product.product_code,
                    "bar_qr_code": product.bar_qr_code,
                    "description": product.description,
                    "image_url": product.image_url,
                    "price_details": {
                        "purchase_price": price_details.purchase_price if price_details else None,
                        "sale_price": price_details.sale_price if price_details else None,
                        "min_sale_price": price_details.min_sale_price if price_details else None,
                        "mrp": price_details.mrp if price_details else None,
                        "discount": price_details.discount if price_details else None,
                        "hsn_sac_code": price_details.hsn_sac_code if price_details else None,
                    },
                    "gst_details": {
                        "cgst_percentage": gst_details.cgst_percentage if gst_details else None,
                        "sgst_percentage": gst_details.sgst_percentage if gst_details else None,
                        "igst_percentage": gst_details.igst_percentage if gst_details else None,
                        "cgst_value": gst_details.cgst_value if gst_details else None,
                        "sgst_value": gst_details.sgst_value if gst_details else None,
                        "igst_value": gst_details.igst_value if gst_details else None,
                        "total_amount": gst_details.total_amount if gst_details else None,
                    },
                    "stock_details": {
                        "opening_stock": stock_details.opening_stock if stock_details else None,
                        "opening_stock_value": stock_details.opening_stock_value if stock_details else None,
                        "low_stock_qty": stock_details.low_stock_qty if stock_details else None,
                        "location": stock_details.location if stock_details else None,
                    }
                }

                product_report.append(product_data)

            response_data = {
                "customer_id": customer.id,
                "customer_name": customer.name,
                "products": product_report
            }

            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON data"}, status=400)

    else:
        return JsonResponse({"message": "Invalid request method. Please use GET."}, status=405)

# ---------------------------- CREATE ADMIN DETAILS ----------------------
@csrf_exempt
def create_admin(request):
    return async_to_sync(async_create_admin)(request)

async def async_create_admin(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            required_fields = ['email', 'password', 'full_name', 'hardware_signature']

            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            hashed_password = make_password(data.get('password'))
            hardware_signature = hashlib.sha3_512(data.get('hardware_signature').encode()).hexdigest()

            admin = Admin(
                email=data.get('email'),
                password_hash=hashed_password,
                full_name=data.get('full_name'),
                last_login=data.get('last_login', None),
                is_active=data.get('is_active', True),
                hardware_signature=hardware_signature,
                created_at=now()
            )

            await sync_to_async(admin.save)()

            return JsonResponse({"message": "Admin created successfully"}, status=201)
        except Exception as e:
            return JsonResponse({"message": "Invalid data", "error": str(e)}, status=400)

# --------------------GET ADMIN DETAILS---------------------
@csrf_exempt
def get_admin_details(request):
    return async_to_sync(async_get_admin_details)(request)

async def async_get_admin_details(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))
            admin_id = data.get('admin_id')

            admin = await sync_to_async(Admin.objects.filter(id=admin_id).first)()
            if admin:
                response_data = {
                    "admin_id": admin.id,
                    "email": admin.email,
                    "full_name": admin.full_name,
                    "created_at": admin.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    "last_login": admin.last_login.strftime("%Y-%m-%d %H:%M:%S") if admin.last_login else None,
                    "is_active": admin.is_active,
                    "hardware_signature": admin.hardware_signature
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({"message": "Admin not found"}, status=404)

        except Exception as e:
            return JsonResponse({"message": "Invalid request", "error": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method. Please use GET."}, status=405)

# ------------------------UPDATE ADMIN DETAILS ---------------------
@csrf_exempt
def update_admin_details(request):
    return async_to_sync(async_update_admin_details)(request)

async def async_update_admin_details(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))
            admin_id = data.get('admin_id')

            email = data.get('email')
            password = data.get('password')
            full_name = data.get('full_name')
            last_login = data.get('last_login')
            is_active = data.get('is_active')
            hardware_signature = data.get('hardware_signature')

            admin = await sync_to_async(Admin.objects.filter(id=admin_id).first)()

            if admin:
                if email:
                    admin.email = email
                if password:
                    admin.password_hash = make_password(password)
                if full_name:
                    admin.full_name = full_name
                if last_login:
                    admin.last_login = parse_datetime(last_login)
                if is_active is not None:
                    admin.is_active = is_active
                if hardware_signature:
                    admin.hardware_signature = hashlib.sha3_512(hardware_signature.encode()).hexdigest()

                await sync_to_async(admin.save)()

                response_data = {
                    "admin_id": admin.id,
                    "email": admin.email,
                    "full_name": admin.full_name,
                    "created_at": admin.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    "last_login": admin.last_login.strftime("%Y-%m-%d %H:%M:%S") if admin.last_login else None,
                    "is_active": admin.is_active,
                    "hardware_signature": admin.hardware_signature
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({"message": "Admin not found"}, status=404)

        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method. Please use PUT."}, status=405)

# -----------------------DELETE ADMIN DETAILS---------------------
@csrf_exempt
def delete_admin_details(request):
    return async_to_sync(async_delete_admin_details)(request)

async def async_delete_admin_details(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            admin_id = data.get('admin_id')

            admin = await sync_to_async(Admin.objects.filter(id=admin_id).first)()

            if admin:
                await sync_to_async(admin.delete)()
                return JsonResponse({"message": "Admin details deleted successfully"}, status=200)
            else:
                return JsonResponse({"message": "Admin not found"}, status=404)

        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)
    else:
        return JsonResponse({"message": "Invalid request method. Please use DELETE."}, status=405)

# ------------------------- CREATE SUBSCRIPTION DETAILS ---------------


@csrf_exempt
def create_subscription_plan(request):
    return async_to_sync(async_create_subscription_plan)(request)

async def async_create_subscription_plan(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            required_fields = ['admin_id', 'plan_name', 'duration_days', 'price', 'description', 'is_active']

            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            admin_id = data.get('admin_id')
            plan_name = data.get('plan_name')
            duration_days = data.get('duration_days')
            price = data.get('price')
            description = data.get('description', '') 
            is_active = data.get('is_active', True)

            admin = await sync_to_async(Admin.objects.filter(id=admin_id).first)()

            if not admin:
                return JsonResponse({"message": "Admin not found"}, status=404)

            created_at_str = data.get('created_at')
            
            try:
                created_at = datetime.fromisoformat(created_at_str)
            except ValueError:
                return JsonResponse({"message": "Invalid date format for 'created_at'. Expected ISO 8601 format."}, status=400)
            expiry_date = created_at + timedelta(days=duration_days)

            subscription_plan = SubscriptionPlan(
                admin=admin,
                plan_name=plan_name,
                duration_days=duration_days,
                price=price,
                description=description,
                created_at=created_at,
                is_active=is_active,
                expiry_date=expiry_date
            )

            await sync_to_async(subscription_plan.save)()

            

            response_data = {
                "subscription_id": subscription_plan.id,
                "admin_id": subscription_plan.admin.id,
                "plan_name": subscription_plan.plan_name,
                "duration_days": subscription_plan.duration_days,
                "price": str(subscription_plan.price),
                "description": subscription_plan.description,
                "is_active": subscription_plan.is_active,
                "expiry_date": expiry_date.strftime("%Y-%m-%d %H:%M:%S")
            }

            return JsonResponse(response_data, status=201)

        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)

    else:
        return JsonResponse({"message": "Invalid request method. Please use POST."}, status=405)


# ----------------------------GET SUBSCRIPTION DETAILS --------------------------
@csrf_exempt
def get_subscription_plan(request):
    return async_to_sync(async_get_subscription_plan)(request)

async def async_get_subscription_plan(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))

            plan_id = data.get('plan_id')

            subscription_plan = await sync_to_async(SubscriptionPlan.objects.filter(id=plan_id).first)()

            if subscription_plan:
                response_data = {
                    "plan_id": subscription_plan.id,
                    "admin_id": subscription_plan.admin_id,
                    "plan_name": subscription_plan.plan_name,
                    "duration_days": subscription_plan.duration_days,
                    "price": str(subscription_plan.price),
                    "description": subscription_plan.description,
                    "is_active": subscription_plan.is_active
                }
                return JsonResponse(response_data, status=200)
            else:
                return JsonResponse({"message": "Subscription Plan not found"}, status=404)

        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)

    else:
        return JsonResponse({"message": "Invalid request method. Please use POST."}, status=405)

# ------------------------UPDATE SUBSCRIPTION DETAILS--------------------

@csrf_exempt
def update_subscription_plan(request):
    return async_to_sync(async_update_subscription_plan)(request)

async def async_update_subscription_plan(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))

            plan_id = data.get('plan_id')

            subscription_plan = await sync_to_async(SubscriptionPlan.objects.filter(id=plan_id).first)()

            if not subscription_plan:
                return JsonResponse({"message": "Subscription Plan not found"}, status=404)

            subscription_plan.plan_name = data.get('plan_name', subscription_plan.plan_name)
            subscription_plan.duration_days = data.get('duration_days', subscription_plan.duration_days)
            subscription_plan.price = data.get('price', subscription_plan.price)
            subscription_plan.description = data.get('description', subscription_plan.description)
            subscription_plan.is_active = data.get('is_active', subscription_plan.is_active)

            await sync_to_async(subscription_plan.save)()

            response_data = {
                "plan_id": subscription_plan.id,
                "admin_id": subscription_plan.admin.id,
                "plan_name": subscription_plan.plan_name,
                "duration_days": subscription_plan.duration_days,
                "price": str(subscription_plan.price),
                "description": subscription_plan.description,
                "is_active": subscription_plan.is_active
            }

            return JsonResponse(response_data, status=200)

        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)

    else:
        return JsonResponse({"message": "Invalid request method. Please use POST."}, status=405)

# --------------------------DELETE SUBCRIPTION DETAILS-------------------
 
@csrf_exempt
def delete_subscription_plan(request):
    return async_to_sync(async_delete_subscription_plan)(request)

async def async_delete_subscription_plan(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))

            plan_id = data.get('plan_id')

            subscription_plan = await sync_to_async(SubscriptionPlan.objects.filter(id=plan_id).first)()

            if not subscription_plan:
                return JsonResponse({"message": "Subscription Plan not found"}, status=404)

            await sync_to_async(subscription_plan.delete)()

            return JsonResponse({"message": "Subscription Plan deleted successfully"}, status=200)

        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)

    else:
        return JsonResponse({"message": "Invalid request method. Please use POST."}, status=405)

# ---------------------------CREATE LISENCE DETAILS------------------


@csrf_exempt
def store_license_details(request):
    return async_to_sync(async_store_license_details)(request)

async def async_store_license_details(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            required_fields = ['admin_id', 'plan_id', 'hardware_signature', 'validity_days','license_key','is_active','last_validated']

            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            admin = await sync_to_async(Admin.objects.get)(id=data.get('admin_id'))
            plan = await sync_to_async(SubscriptionPlan.objects.get)(id=data.get('plan_id'))

            hardware_signature = hashlib.sha3_512(data.get('hardware_signature').encode()).hexdigest()

            current_time = datetime.utcnow()
            validity_days = int(data.get('validity_days', 30))  
            expiry_date = current_time + timedelta(days=validity_days)

            payload = {
                'license_key': data.get('license_key'),
                'exp': expiry_date.timestamp()  
            }
            encoded_license_key = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            license = await sync_to_async(License.objects.create)(  
                admin=admin,
                plan=plan,
                license_key=encoded_license_key,
                expiry_date=expiry_date,
                hardware_signature=hardware_signature,
                is_active=True,
                last_validated=data.get('last_validated'),
                created_at=current_time,
            )

            return JsonResponse({
                "message": "License details stored successfully!",
                "license_id": license.id,
                "created_at": license.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "expiry_date": license.expiry_date.strftime('%Y-%m-%d %H:%M:%S'),
            }, status=201)

        except Admin.DoesNotExist:
            return JsonResponse({"message": "Admin not found."}, status=404)
        except SubscriptionPlan.DoesNotExist:
            return JsonResponse({"message": "Subscription Plan not found."}, status=404)
        except Exception as e:
            return JsonResponse({"message": "An error occurred.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method."}, status=400)



# ------------------------ Get License Details ---------------------------

 

@csrf_exempt
def get_license_details(request):
    return async_to_sync(async_get_license_details)(request)

async def async_get_license_details(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body)
            license_id = data.get('license_id')

            license = await sync_to_async(License.objects.get)(id=license_id)

            try:
                decoded_license = jwt.decode(license.license_key, settings.SECRET_KEY, algorithms=['HS256'])
                expiry_timestamp = decoded_license.get('exp')
                expiry_date = datetime.utcfromtimestamp(expiry_timestamp)  

                original_license_key = decoded_license.get('license_key')

            except jwt.ExpiredSignatureError:
                return JsonResponse({"message": "License key has expired."}, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({"message": "Invalid license key."}, status=400)

            return JsonResponse({
                "message": "License details retrieved successfully.",
                "license_id": license.id,
                "admin_id": license.admin_id,
                "plan_id": license.plan_id,
                "license_key": original_license_key,
                "expiry_date": expiry_date.strftime('%Y-%m-%d %H:%M:%S'),
                "hardware_signature": license.hardware_signature,
                "is_active": license.is_active,
                "created_at": license.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "last_validated": license.last_validated.strftime('%Y-%m-%d %H:%M:%S') if license.last_validated else None,
            }, status=200)

        except License.DoesNotExist:
            return JsonResponse({"message": "License not found."}, status=404)
        except Exception as e:
            return JsonResponse({"message": "An error occurred.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method. Use GET."}, status=400)


# ------------------------------ Update License Details-------------------------

@csrf_exempt
def update_license_details(request):
    return async_to_sync(async_update_license_details)(request)

async def async_update_license_details(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            license_id = data.get('license_id')

            license = await sync_to_async(License.objects.get)(id=license_id)

            if 'admin_id' in data:
                admin = await sync_to_async(Admin.objects.get)(id=data['admin_id'])
                license.admin = admin

            if 'plan_id' in data:
                plan = await sync_to_async(SubscriptionPlan.objects.get)(id=data['plan_id'])
                license.plan = plan

            if 'hardware_signature' in data:
                license.hardware_signature = hashlib.sha3_512(data['hardware_signature'].encode()).hexdigest()

            if 'is_active' in data:
                license.is_active = data['is_active']

            if 'last_validated' in data:
                license.last_validated = datetime.strptime(data['last_validated'], '%Y-%m-%d %H:%M:%S')

            
            if 'validity_days' in data:
                validity_days = int(data['validity_days'])
                expiry_date = datetime.utcnow() + timedelta(days=validity_days)
                
                payload = {
                    'license_key': data.get('license_key', license.license_key),  
                    'exp': expiry_date.timestamp()
                }
                encoded_license_key = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

                license.license_key = encoded_license_key
                license.expiry_date = expiry_date

            if 'created_at' in data:
                license.created_at = datetime.strptime(data['created_at'], '%Y-%m-%d %H:%M:%S')

            await sync_to_async(license.save)()

            return JsonResponse({
                "message": "License details updated successfully!",
  
            }, status=200)

        except License.DoesNotExist:
            return JsonResponse({"message": "License not found."}, status=404)
        except Admin.DoesNotExist:
            return JsonResponse({"message": "Admin not found."}, status=404)
        except SubscriptionPlan.DoesNotExist:
            return JsonResponse({"message": "Subscription Plan not found."}, status=404)
        except Exception as e:
            return JsonResponse({"message": "An error occurred.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method. Use PUT."}, status=400)


# --------------Delete License Details----------------------- 

@csrf_exempt
def delete_license_details(request):
    return async_to_sync(async_delete_license_details)(request)

async def async_delete_license_details(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            license_id = data.get('license_id')

            license = await sync_to_async(License.objects.get)(id=license_id)

            await sync_to_async(license.delete)()

            return JsonResponse({"message": "License deleted successfully!", "license_id": license_id}, status=200)

        except License.DoesNotExist:
            return JsonResponse({"message": "License not found."}, status=404)
        except Exception as e:
            return JsonResponse({"message": "An error occurred.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Invalid request method. Use POST."}, status=400)
    


 # -------------------------PAYMENT -----------------------------------
# import razorpay
# import json
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt
# from .models import Payment

# # Initialize Razorpay Client
# client = razorpay.Client(auth=("rzp_test_X3NIP3mBV2M0tx ", "lmAjEtzHO7ahUcQAD3Iq7nmC"))

# @csrf_exempt
# def payment_handler(request, transaction_id=None):
#     if request.method == "POST":
#         # 1️⃣ Create a new payment order
#         data = json.loads(request.body)
#         admin_id = data.get("admin")
#         plan_id = data.get("plan")
#         amount = data.get("amount")
#         currency = data.get("currency")

#         # Prepare data for Razorpay
#         payment_data = {
#             "amount": int(float(amount) * 100),  # Convert to paise
#             "currency": currency,
#             "payment_capture": 1
#         }
#         order = client.order.create(data=payment_data)

    
#         payment = Payment.objects.create(
#             admin_id=admin_id,
#             plan_id=plan_id,
#             amount=amount,
#             currency=currency,
#             payment_gateway="Razorpay",
#             transaction_id=order["id"],
#             status="Pending"
#         )

#         return JsonResponse({"order_id": order["id"], "amount": amount, "currency": currency})

#     elif request.method == "PUT":
#         # 2️⃣ Webhook Handling - Update Payment Status
#         data = json.loads(request.body)
#         transaction_id = data.get("razorpay_order_id")
#         status = "Success" if data.get("status") == "captured" else "Failed"

#         try:
#             payment = Payment.objects.get(transaction_id=transaction_id)
#             payment.status = status
#             payment.save()
#             return JsonResponse({"message": "Payment Updated Successfully"})
#         except Payment.DoesNotExist:
#             return JsonResponse({"error": "Transaction not found"}, status=400)

#     elif request.method == "GET" and transaction_id:
#         # 3️⃣ Fetch Payment Details
#         try:
#             payment = Payment.objects.get(transaction_id=transaction_id)
#             return JsonResponse({
#                 "transaction_id": payment.transaction_id,
#                 "amount": str(payment.amount),
#                 "currency": payment.currency,
#                 "status": payment.status,
#                 "created_at": payment.created_at.strftime("%Y-%m-%d %H:%M:%S")
#             })
#         except Payment.DoesNotExist:
#             return JsonResponse({"error": "Payment not found"}, status=404)

#     return JsonResponse({"error": "Invalid request"}, status=400)
 

# @csrf_exempt
# def create_payment_order(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#         amount = data.get('amount')
#         currency = data.get('currency')
#         plan_id = data.get('plan_id')
#         admin_id = data.get('admin_id')

#         if not amount or not currency or not plan_id or not admin_id:
#             return JsonResponse({'error': 'Missing required fields'}, status=400)
       
#         try:
#             amount_in_paise = int(float(amount) * 100)  
#         except ValueError:
#             return JsonResponse({'error': 'Invalid amount format'}, status=400)

#         client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)) 

#         try:
#             order = client.order.create({
#                 'amount': amount_in_paise,
#                 'currency': currency,
#                 'payment_capture': 1 
#             })
#         except razorpay.errors.BadRequestError as e:
#             return JsonResponse({'error': f"Authentication failed: {str(e)}"}, status=400)

#         payment = Payment.objects.create(
#             admin_id=admin_id,
#             plan_id=plan_id,
#             amount=amount,
#             currency=currency,
#             payment_gateway="Razorpay",
#             transaction_id=order['id'],
#             status="Pending"
#         )

#         return JsonResponse({
#             'message': 'Order created successfully',
#             'order_id': order['id'],  
#             'amount': order['amount'], 
#             'currency': order['currency'] 
#         })

#     return JsonResponse({'error': 'Invalid request'}, status=400)

# # ---------------------------
# @csrf_exempt
# def razorpay_webhook(request):
#     if request.method == "POST":
#         signature = request.headers.get("X-Razorpay-Signature")
#         webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

#         payload = request.body.decode("utf-8")
#         generated_signature = hmac.new(
#             webhook_secret.encode(),
#             payload.encode(),
#             hashlib.sha256
#         ).hexdigest()

#         if signature != generated_signature:
#             return JsonResponse({"error": "Invalid Signature"}, status=400)

#         data = json.loads(payload)

#         if data.get("event") == "payment.captured":
#             payment_id = data["payload"]["payment"]["entity"]["order_id"]
#             payment = Payment.objects.get(transaction_id=payment_id)

            
#             payment.status = "Paid"
#             payment.save()

#             return JsonResponse({"message": "Payment captured successfully"})

#     return JsonResponse({"error": "Invalid request"}, status=400)
# ---------------------------

# import razorpay
# from django.http import JsonResponse
# from django.views.decorators.csrf import csrf_exempt

# client = razorpay.Client(auth=("rzp_test_X3NIP3mBV2M0tx", "lmAjEtzHO7ahUcQAD3Iq7nmC"))

# @csrf_exempt
# def razorpay_webhook(request):
#     secret = "ms2mEcYLz3zR9@w"
#     received_signature = request.headers.get("X-Razorpay-Signature")
#     payload = request.body

#     try:
#         client.utility.verify_webhook_signature(payload, received_signature, secret)
#     except razorpay.errors.SignatureVerificationError:
#         return JsonResponse({"error": "Invalid Signature"}, status=400)

#     return JsonResponse({"message": "Webhook received successfully"})


# https://c235-59-92-125-2.ngrok-free.app


# ------------------
@csrf_exempt
def create_payment_order(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON request
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        amount = data.get('amount')
        currency = data.get('currency')
        plan_id = data.get('plan_id')
        admin_id = data.get('admin_id')

        if not amount or not currency or not plan_id or not admin_id:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        try:
            amount_in_paise = int(float(amount) * 100)  # Convert to paise
        except ValueError:
            return JsonResponse({'error': 'Invalid amount format'}, status=400)

        # Create Razorpay client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        # Create order in Razorpay
        try:
            order = client.order.create({
                'amount': amount_in_paise,
                'currency': currency,
                'payment_capture': 1  
            })
        except razorpay.errors.BadRequestError as e:
            return JsonResponse({'error': f"Authentication failed: {str(e)}"}, status=400)

        # Store order in database
        payment = Payment.objects.create(
            admin_id=admin_id,
            plan_id=plan_id,
            amount=amount,
            currency=currency,
            payment_gateway="Razorpay",
            transaction_id=order['id'],
            status="Pending"
        )

        return JsonResponse({
            'message': 'Order created successfully',
            'order_id': order['id'],  
            'amount': order['amount'], 
            'currency': order['currency'] 
        })

    return JsonResponse({'error': 'Invalid request'}, status=400)


# -----------GET PAYMENT DETAILS-------------------

def get_payment_details(request, order_id):
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    
    try:
        payments = client.order.payments(order_id)
        if not payments['items']:
            return JsonResponse({'error': 'No payments found for this order'}, status=400)

        payment_info = payments['items'][0]  # Get first payment
        return JsonResponse({
            'razorpay_order_id': payment_info['order_id'],
            'razorpay_payment_id': payment_info['id'],
            'razorpay_signature': payment_info.get('signature', 'N/A')  # Razorpay does not return signature via API
        })
    except razorpay.errors.BadRequestError as e:
        return JsonResponse({'error': f"Razorpay Error: {str(e)}"}, status=400)


@csrf_exempt
def verify_payment_signature(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')

        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return JsonResponse({'error': 'Missing required fields'}, status=400)

        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        try:
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            client.utility.verify_payment_signature(params_dict)

            # Update payment status in the database
            payment = Payment.objects.get(transaction_id=razorpay_order_id)
            payment.status = "Success"
            payment.save()

            return JsonResponse({'message': 'Payment verified successfully'})
        except razorpay.errors.SignatureVerificationError:
            return JsonResponse({'error': 'Signature verification failed'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def razorpay_webhook(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        event = data.get('event')

        if event == 'payment.captured':
            payment_id = data['payload']['payment']['entity']['id']
            order_id = data['payload']['payment']['entity']['order_id']
            amount = data['payload']['payment']['entity']['amount']
            currency = data['payload']['payment']['entity']['currency']

            try:
                payment = Payment.objects.get(transaction_id=order_id)
                payment.status = "Success"
                payment.save()
                return JsonResponse({'message': 'Payment updated successfully'})
            except Payment.DoesNotExist:
                return JsonResponse({'error': 'Payment record not found'}, status=400)

        return JsonResponse({'message': 'Webhook received'})
    
    return JsonResponse({'error': 'Invalid request'}, status=400)

# --------------------------------------------------------------------

@csrf_exempt
def razorpay_payment_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

           
            amount = data.get("amount")  
            currency = data.get("currency", "INR")
            plan_id = data.get("plan_id")
            admin_id = data.get("admin_id")

            if not amount or not plan_id or not admin_id:
                return JsonResponse({"error": "Missing required fields"}, status=400)

            amount_in_paise = int(float(amount) * 100)  

            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

            order = client.order.create({
                "amount": amount_in_paise,
                "currency": currency,
                "payment_capture": 1  # Auto-capture
            })

            # 🔹 Step 2: Store Order in Database (Before Payment)
            payment = Payment.objects.create(
                admin_id=admin_id,
                plan_id=plan_id,
                amount=amount,
                currency=currency,
                payment_gateway="Razorpay",
                transaction_id=order["id"],
                status="Pending"
            )

            return JsonResponse({
                "message": "Order created successfully",
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"]
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    elif request.method == "PUT":
        try:
            data = json.loads(request.body)

            # 🔹 Step 3: Get Payment Details From Razorpay
            order_id = data.get("razorpay_order_id")
            payment_id = data.get("razorpay_payment_id")
            signature = data.get("razorpay_signature")

            if not order_id or not payment_id or not signature:
                return JsonResponse({"error": "Missing payment details"}, status=400)

            # 🔹 Step 4: Verify Payment Signature (Security Check)
            secret = settings.RAZORPAY_KEY_SECRET
            expected_signature = hmac.new(
                bytes(secret, "utf-8"),
                bytes(order_id + "|" + payment_id, "utf-8"),
                hashlib.sha256
            ).hexdigest()

            if expected_signature != signature:
                return JsonResponse({"error": "Invalid payment signature"}, status=400)

            # 🔹 Step 5: Update Payment Status in Database (After Successful Payment)
            payment = Payment.objects.filter(transaction_id=order_id).first()
            if not payment:
                return JsonResponse({"error": "No payments found for this order"}, status=404)

            payment.status = "Paid"
            payment.save()

            return JsonResponse({"message": "Payment verified successfully"})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format"}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=400)
# -----------------------------Supplier List ------------------

@csrf_exempt

def  create_supplier(request):
    return async_to_sync(async_cerate_supplier)(request)

async def async_cerate_supplier(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

            required_fields = ['supplier_name','mobile_number','email','address','area','pin_code', 'state', 'opening_balance','gst_number']
            
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)
            

            supplier = SupplierList(

                supplier_name = data.get("supplier_name"),
                mobile_number = data.get("mobile_number"),
                email = data.get("email"),
                address = data.get("address"),
                area = data.get("area"),
                pin_code = data.get("pin_code"),
                state = data.get("state"),
                opening_balance = data.get("opening_balance"),
                gst_number = data.get("gst_number")

            )
            await sync_to_async(supplier.save)()

            return JsonResponse({'message':f"Supplier Added Succeessfully..!"})
        
    
        except Exception as e:
            return JsonResponse({"message": "Error occurred", "error": str(e)}, status=400)

    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

# --------------------------GET SUPPLIER LIST-------------------

@csrf_exempt
def get_supplier(request):
    return async_to_sync(async_get_supplier)(request)

async def async_get_supplier(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            supplier_id = data.get('supplier_id')

            if not supplier_id:
                return JsonResponse({"message": "ID is required."}, status=400)
                        
            supplier = await sync_to_async(SupplierList.objects.get)(id=supplier_id)
            supplier_data = {
                "supplier_id":supplier.id,
                "supplier_name": supplier.supplier_name,
                "mobile_number": supplier.mobile_number,
                "email": supplier.email,
                "address": supplier.address,
                "pin_code": supplier.pin_code,
                "area": supplier.area,
                "state": supplier.state,
                "opening_balance": supplier.opening_balance,
                "gst_number": supplier.gst_number
                

            }

            return JsonResponse({"data": supplier_data}, status=200)

        except SupplierList.DoesNotExist:
            return JsonResponse({"message": "Supplier not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Invalid Request Method."}, status=405)

# ---------------UPDATE SUPPLIER-------------

@csrf_exempt

def update_supplier(request):
    return async_to_sync(async_update_supplier)(request)

async def async_update_supplier(request):
    if  request.method == "PUT":

        try:
            data = json.loads(request.body)
            supplier_id = data.get('supplier_id')

            if not supplier_id:
                return JsonResponse({"error": "supplier_id is required."}, status=400)
            try:
                supplier = await sync_to_async(SupplierList.objects.get)(id=supplier_id)
            except SupplierList.DoesNotExist:
                return JsonResponse({"error": "Supplier not found."}, status=404)
    
            supplier_name = data.get("supplier_name")
            mobile_number = data.get("mobile_number")
            email = data.get("email")
            address = data.get("address")
            area = data.get("area")
            pin_code = data.get("pin_code")
            state = data.get("state")
            opening_balance = data.get("opening_balance")
            gst_number = data.get("gst_number")
            
    
            # required_fields = ['supplier_name','mobile_number','email','address','area','pin_code', 'state', 'opening_balance','gst_number']
                
            # missing_fields = [field for field in required_fields if field not in data]
    
            # if missing_fields:
            #     return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)
    
            
        
            supplier.supplier_name = supplier_name
            supplier.mobile_number = mobile_number
            supplier.email = email
            supplier.address = address
            supplier.area = area
            supplier.pin_code = pin_code
            supplier.state = state
            supplier.opening_balance = opening_balance
            supplier.gst_number = gst_number
            await sync_to_async(supplier.save)()
    
            return JsonResponse({"message": "Supplier updated successfully."}, status=200)
    
    
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    else:
        return JsonResponse({"error":f"Invalid Request Method"}, status=400)



# ------------------------------------DELETE SUPPLIER--------------------

@csrf_exempt
def delete_supplier(request):
    return async_to_sync(async_delete_supplier)(request)

async def async_delete_supplier(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
    
            supplier_id = data.get("supplier_id")
    
            if not supplier_id :
                return JsonResponse({"message":f"supplier_id is required"},status=400)
            
            supplier = await sync_to_async(SupplierList.objects.get)(id=supplier_id)
    
            await sync_to_async(supplier.delete)()
            return JsonResponse({"message":f"Supplier Deleted Successfully..!"})
    
        except SupplierList.DoesNotExist:
            return JsonResponse({"message": "SupplierList not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)    
    else:
        return JsonResponse({"error":"Invalid Reqquest Method"},status=400)
        
 # -------------- CREATE  CUSTOMER LIST -----------------

@csrf_exempt

def create_customer(request):
    return async_to_sync(async_create_customer)(request)

async def async_create_customer(request):
    if request.method == "POST":
        try : 
            data = json.loads(request.body)

            required_fields = ["customer_name","mobile_number","email","address","area","pin_code","state","opening_balance","gst_number"]

            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)
        
            customer = CustomerList(

            customer_name = data.get("customer_name"),
            mobile_number = data.get("mobile_number"),
            email = data.get("email"),
            address = data.get("address"), 
            area = data.get("area"),
            pin_code = data.get("pin_code"),
            state = data.get("state"),
            opening_balance = data.get("opening_balance"),
            gst_number = data.get("gst_number")  
            )
              
            await sync_to_async(customer.save)()

            return JsonResponse({"message": f"Customer Created Successfully..!"})
        
        except CustomerList.DoesNotExist:
            return JsonResponse({"message": "Customer not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)    
    else:
        return JsonResponse({"error":"Invalid Reqquest Method"},status=400)


#-----------------------GET CUSTOMER DETAILS ---------------

@csrf_exempt

def get_customer(request):
    return async_to_sync(async_get_customer)(request)

async def  async_get_customer(request):
    if request.method =="GET":
        try :
            data = json.loads(request.body)

            customer_id = data.get("customer_id")

            if not customer_id:
                return JsonResponse({"error":f"Customer ID is Required"}, status=400) 


            customer = await sync_to_async(CustomerList.objects.get)(id=customer_id)

            customer_data = {

                "customer_id":customer.id,
                "customer_name": customer.customer_name,
                "mobile_number": customer.mobile_number,
                "email": customer.email,
                "address": customer.address,
                "pin_code": customer.pin_code,
                "area": customer.area,
                "state": customer.state,
                "opening_balance": customer.opening_balance,
                "gst_number": customer.gst_number

            }    

            return JsonResponse({"data": customer_data}, status = 200) 
        

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    else:
        return JsonResponse({"error":f"Invalid Request Method"}, status=400)

# -----------------UPADTE CUSTOMER DETAILS--------------

@csrf_exempt

def update_customer(request):
    return async_to_sync(async_update_customer)(request)

async def async_update_customer(request):
    if  request.method == "PUT":

        try:
            data = json.loads(request.body)
            customer_id = data.get('customer_id')

            if not customer_id:
                return JsonResponse({"error": "customer_id is required."}, status=400)
            try:
                customer = await sync_to_async(SupplierList.objects.get)(id=customer_id)
            except SupplierList.DoesNotExist:
                return JsonResponse({"error": "Customer not found."}, status=404)
    
            customer_name = data.get("customer_name")
            mobile_number = data.get("mobile_number")
            email = data.get("email")
            address = data.get("address")
            area = data.get("area")
            pin_code = data.get("pin_code")
            state = data.get("state")
            opening_balance = data.get("opening_balance")
            gst_number = data.get("gst_number")
            
    
            required_fields = ['customer_name','mobile_number','email','address','area','pin_code', 'state', 'opening_balance','gst_number']
                
            missing_fields = [field for field in required_fields if field not in data]
    
            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)
    
            
        
            customer.customer_name = customer_name
            customer.mobile_number = mobile_number
            customer.email = email
            customer.address = address
            customer.area = area
            customer.pin_code = pin_code
            customer.state = state
            customer.opening_balance = opening_balance
            customer.gst_number = gst_number
            await sync_to_async(customer.save)()
    
            return JsonResponse({"message": "Customer updated successfully."}, status=200)
    
    
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    else:
        return JsonResponse({"error":f"Invalid Request Method"}, status=400)
# ---------------DELETE CUSTOMER DEATILS ---------------

@csrf_exempt

def delete_customer(request):
    return async_to_sync(async_delete_customer)(request)

async def  async_delete_customer (request):
    if request.method == "DELETE":
        try :
            data = json.loads(request.body)

            customer_id = data.get("customer_id")

            if not customer_id :
                return JsonResponse({"message": "Customer Id is Required"})
            
            customer = await sync_to_async(CustomerList.objects.get)(id=customer_id)
            
            await sync_to_async(customer.delete)()

            return JsonResponse({"message":"Customer Deleted Successfully..!"})

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)

    else:
        return JsonResponse({"error":f"Invalid Request Method"}, status=400)    

# -----------------------------------

def get_hardware_details():
    pythoncom.CoInitialize()
    c = wmi.WMI()
    motherboard = c.Win32_BaseBoard()[0].SerialNumber.strip()
    hard_disk = c.Win32_DiskDrive()[0].SerialNumber.strip()
    cpu = c.Win32_Processor()[0].ProcessorId.strip()
    pythoncom.CoUninitialize()
    return {
        "motherboard_id": motherboard,
        "hard_disk": hard_disk,
        "cpu": cpu,
    }

@csrf_exempt
def login_user(request):
    return async_to_sync(async_login_user)(request)

async def async_login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_name = data.get('user_name')
            email = data.get('email')
            access_key = data.get('access_key')

            user = await sync_to_async(UserModel.objects.filter(user_name=user_name, email=email).first)()

            if not user:
                user = UserModel(user_name=user_name, email=email, access_key=access_key)
                await sync_to_async(user.save)()

            if user:
                system_details = await sync_to_async(get_hardware_details)()

                api_url = "https://0f64-122-178-19-232.ngrok-free.app/api/store_hardware/"
                payload = {
                    "user_name": user.user_name,
                    "email": user.email,
                    "access_key": user.access_key,
                    "hardware_details": system_details
                }
                headers = {"Content-Type": "application/json"}

                try:
                    response = await sync_to_async(requests.post)(api_url, json=payload, headers=headers, timeout=10)
                    print("API response:", response.status_code, response.text)
                    response.raise_for_status()
                    external_api_msg = response.json()
                except requests.RequestException as e:
                    external_api_msg = {'error': f'Failed to send external API: {str(e)}'}
                
                return JsonResponse({
                    'local_response': 'Login successfully',
                    'external_api_response': external_api_msg
                }, status=200)
            else:
                return JsonResponse({"message": "Invalid username or access key"}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid Request Method"}, status=400)

@csrf_exempt
def notify_verification(request):
    return async_to_sync(async_notify_verification)(request)

async def async_notify_verification(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get("message")
            print(f"Notification Received: {message}")
            return JsonResponse({"message": "Access key verification Successful"})
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        except Exception as e:
            print(f"Error: {str(e)}")
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid Request Method"}, status=400)




# -----------------------------PENDING SALE CALCULATION------------------------------


def search_customer(request):
    customer_name = request.GET.get('name')
    customers = CustomerList.objects.filter(customer_name__icontains=customer_name)
    data = [{'id': c.id, 'customer_name': c.customer_name} for c in customers]
    return JsonResponse(data, safe=False)

def get_customer_details(request):
    customer_id = request.GET.get('customer_id')
    customer = CustomerList.objects.filter(id=customer_id).first()
    if customer:
        data = {
            'mobile_number': customer.mobile_number,
            'gst_number': customer.gst_number
        }
    else:
        data = {'mobile_number': '', 'gst_number': ''}
    return JsonResponse(data)




def search_product(request):
    product_name = request.GET.get('name')
    products = ProductDetails.objects.filter(product_name__icontains=product_name)
    data = [{'id': p.id, 'product_name': p.product_name} for p in products]
    return JsonResponse(data, safe=False)


def get_product_details(request):
    product_id = request.GET.get('product_id')
    product = get_object_or_404(ProductDetails, id=product_id)

    # Get HSN Code from SubCategory
    sub_category = SubCategory.objects.filter(subcategory_name=product.sub_category_name).first()
    hsn_sac_code = sub_category.hsn_sac_code if sub_category else ''

    # Get Discount from PriceDetails
    price_details = PriceDetails.objects.filter(product=product).first()
    discount = price_details.discount if price_details else 0

    # Get GST Percentages from GSTDetails
    gst_details = GSTDetails.objects.filter(product=product).first()
    cgst_percentage = gst_details.cgst_percentage if gst_details else 0
    sgst_percentage = gst_details.sgst_percentage if gst_details else 0

    return JsonResponse({
        'hsn_sac_code': hsn_sac_code,
        'discount': discount,
        'cgst_percentage': cgst_percentage,
        'sgst_percentage': sgst_percentage
    })



# def add_sale_with_calculation(request):
#     if request.method == 'POST':
#         customer_id = request.POST.get('customer_id')
#         product_ids = request.POST.getlist('product_id')
#         quantities = request.POST.getlist('quantity')

#         customer = CustomerList.objects.filter(id=customer_id).first()
#         customer_name = customer.customer_name
#         mobile_number = customer.mobile_number
#         gst_number = customer.gst_number

#         total_amount_before_tax = 0
#         total_discount = 0
#         total_cgst = 0
#         total_sgst = 0
#         grant_total = 0

#         for product_id, quantity in zip(product_ids, quantities):
#             product = ProductDetails.objects.filter(id=product_id).first()
#             product_name = product.product_name

#             sub_category = SubCategory.objects.filter(subcategory_name=product.sub_category_name).first()
#             hsn_sac_code = sub_category.hsn_sac_code if sub_category else ''

#             price_details = PriceDetails.objects.filter(product=product).first()
#             sale_price = price_details.sale_price if price_details else 0
#             discount_percent = price_details.discount if price_details else 0

#             gst_details = GSTDetails.objects.filter(product=product).first()
#             cgst_percentage = gst_details.cgst_percentage if gst_details else 0
#             sgst_percentage = gst_details.sgst_percentage if gst_details else 0

#             quantity = int(quantity)
#             rate = sale_price * quantity
#             discount_value = (rate * discount_percent) / 100
#             discounted_rate = rate - discount_value

#             cgst_value = (discounted_rate * cgst_percentage) / 100
#             sgst_value = (discounted_rate * sgst_percentage) / 100

#             total_amount = discounted_rate + cgst_value + sgst_value

#             total_amount_before_tax += rate
#             total_discount += discount_value
#             total_cgst += cgst_value
#             total_sgst += sgst_value
#             grant_total += total_amount

#             # Store each product entry in Sale
#             sale = Sale(
#                 customer_name=customer_name,
#                 mobile_number=mobile_number,
#                 gst_number=gst_number,
#                 product_name=product_name,
#                 hsn_sac_code=hsn_sac_code,
#                 rate=rate,
#                 discount_percent=discount_percent,
#                 discount_value=discount_value,
#                 cgst_percent=cgst_percentage,
#                 cgst_value=cgst_value,
#                 sgst_percent=sgst_percentage,
#                 sgst_value=sgst_value,
#                 total_amount=total_amount,
#                 quantity=quantity,
#                 total_amount_before_tax=total_amount_before_tax,
#                 total_discount=total_discount,
#                 total_cgst=total_cgst,
#                 total_sgst=total_sgst,
#                 grant_total=grant_total
#             )
#             sale.save()

#         return JsonResponse({"message": "Sale Added Successfully"})
