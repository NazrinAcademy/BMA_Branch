from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import TaxDetails,GST ,EWayBill
from datetime import datetime

@csrf_exempt
def create_gst(request):
    if request.method == 'POST':
        try:
            
            data = json.loads(request.body)

            state = data.get('state', '')
            registration_type = data.get('registration_type', '')
            assessee_of_other_territory = data.get('assessee_of_other_territory', '')
            GSTIN_UIN = data.get('GSTIN_UIN', '')
            periodicity_of_GSTR1 = data.get('periodicity_of_GSTR1', '')
            gst_user_name = data.get('gst_user_name', '')
            mode_filing = data.get('mode_filing', '')
            e_invoicing_applicable = data.get('e_invoicing_applicable', '')
            applicable_from_e_invoicing = data.get('applicable_from_e_invoicing', '')
            invoice_bill_from_place = data.get('invoice_bill_from_place', '')
            e_way_bill_applicable = data.get('e_way_bill_applicable', '')
            applicable_from_e_way_bill = data.get('applicable_from_e_way_bill', '')
            applicable_for_intrastate = data.get('applicable_for_intrastate', '')

            applicable_from_e_invoicing = datetime.strptime(applicable_from_e_invoicing, "%Y-%m-%d").date() if applicable_from_e_invoicing else None
            applicable_from_e_way_bill = datetime.strptime(applicable_from_e_way_bill, "%Y-%m-%d").date() if applicable_from_e_way_bill else None

            GST.objects.create(
                state=state,
                registration_type=registration_type,
                assessee_of_other_territory=assessee_of_other_territory,
                GSTIN_UIN=GSTIN_UIN,
                periodicity_of_GSTR1=periodicity_of_GSTR1,
                gst_user_name=gst_user_name,
                mode_filing=mode_filing,
                e_invoicing_applicable=e_invoicing_applicable,
                applicable_from_e_invoicing=applicable_from_e_invoicing,
                invoice_bill_from_place=invoice_bill_from_place,
                e_way_bill_applicable=e_way_bill_applicable,
                applicable_from_e_way_bill=applicable_from_e_way_bill,
                applicable_for_intrastate=applicable_for_intrastate
            )

            return JsonResponse({"message": "GST details added successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# # -----------------------GET details--------------------------------

@csrf_exempt
def get_gst(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            gst_id = data.get('id', None)  

            if gst_id is None:
                return JsonResponse({"error": "ID is required in the request body."}, status=400)

            gst = GST.objects.get(id=gst_id)

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

    return JsonResponse({"error": "Only POST method is allowed."}, status=405)



# # --------------------------UPDATE GST DETAILS--------------------------------------

@csrf_exempt
def update_gst(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            gst_id = data.get('id', None)  

            if gst_id is None:
                return JsonResponse({"error": "ID is required in the request body."}, status=400)

            gst = GST.objects.get(id=gst_id)

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

            gst.save()

            return JsonResponse({"message": "GST details updated successfully."}, status=200)

        except GST.DoesNotExist:
            return JsonResponse({"error": "GST record not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# # ------------------------------DELETE GST DETAILS-----------------------------


@csrf_exempt
def delete_gst(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            gst_id = data.get('id', None) 

            if gst_id is None:
                return JsonResponse({"error": "ID is required in the request body."}, status=400)

            gst = GST.objects.get(id=gst_id)

        
            gst.delete()

            return JsonResponse({"message": "GST record deleted successfully."}, status=200)

        except GST.DoesNotExist:
            return JsonResponse({"error": "GST record not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# ----------------------------CREATE GSTR1 -------------------------
from .models import GSTR1 
import json


@csrf_exempt 
def create_gstr1(request):
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
            
            # Store B2CLInvoice data
            gstr1_record.place_of_supply_b2cl = data.get('place_of_supply_b2cl')
            gstr1_record.invoice_number_b2cl = data.get('invoice_number_b2cl')
            gstr1_record.invoice_date_b2cl = data.get('invoice_date_b2cl')
            gstr1_record.supply_type_b2cl = data.get('supply_type_b2cl')
            gstr1_record.invoice_value_b2cl = data.get('invoice_value_b2cl')
            
            # Store B2CSInvoice data
            gstr1_record.place_of_supply_b2cs = data.get('place_of_supply_b2cs')
            gstr1_record.taxable_value_b2cs = data.get('taxable_value_b2cs')
            gstr1_record.supply_type_b2cs = data.get('supply_type_b2cs')
            gstr1_record.rate_percentage_b2cs = data.get('rate_percentage_b2cs')
            gstr1_record.integrated_tax_b2cs = data.get('integrated_tax_b2cs')
            gstr1_record.central_tax_b2cs = data.get('central_tax_b2cs')
            gstr1_record.state_ut_tax_b2cs = data.get('state_ut_tax_b2cs')
            gstr1_record.cess_b2cs = data.get('cess_b2cs')
            
            # Store CDNRInvoice data
            gstr1_record.gstin_uin_recipient_cdnr = data.get('gstin_uin_recipient_cdnr')
            gstr1_record.receiver_name_cdnr = data.get('receiver_name_cdnr')
            gstr1_record.debit_credit_note_no_cdnr = data.get('debit_credit_note_no_cdnr')
            gstr1_record.debit_credit_note_date_cdnr = data.get('debit_credit_note_date_cdnr')
            gstr1_record.original_invoice_number_cdnr = data.get('original_invoice_number_cdnr')
            gstr1_record.original_invoice_date_cdnr = data.get('original_invoice_date_cdnr')
            gstr1_record.note_type_cdnr = data.get('note_type_cdnr')
            gstr1_record.note_value_cdnr = data.get('note_value_cdnr')
            
            # Store CDNURInvoice data
            gstr1_record.note_type_cdnur = data.get('note_type_cdnur')
            gstr1_record.debit_credit_note_no_cdnur = data.get('debit_credit_note_no_cdnur')
            gstr1_record.debit_credit_note_date_cdnur = data.get('debit_credit_note_date_cdnur')
            gstr1_record.original_invoice_number_cdnur = data.get('original_invoice_number_cdnur')
            gstr1_record.original_invoice_date_cdnur = data.get('original_invoice_date_cdnur')
            gstr1_record.note_value_cdnur = data.get('note_value_cdnur')
            gstr1_record.supply_type_cdnur = data.get('supply_type_cdnur')
            
            # Store EXPInvoice data
            gstr1_record.invoice_number_exp = data.get('invoice_number_exp')
            gstr1_record.invoice_date_exp = data.get('invoice_date_exp')
            gstr1_record.port_code_exp = data.get('port_code_exp')
            gstr1_record.shipping_bill_no_exp = data.get('shipping_bill_no_exp')
            gstr1_record.shipping_bill_date_exp = data.get('shipping_bill_date_exp')
            gstr1_record.total_invoice_value_exp = data.get('total_invoice_value_exp')
            gstr1_record.supply_type_exp = data.get('supply_type_exp')
            gstr1_record.gst_payment_exp = data.get('gst_payment_exp')
            
            # Store NilExemptNonGSTSupplies data
            gstr1_record.nil_rated = data.get('nil_rated', False)
            gstr1_record.exempted = data.get('exempted', False)
            gstr1_record.non_gst_supplies = data.get('non_gst_supplies', False)
            
            # Store HSNInvoice data
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
            
            # Store TaxPeriodDocuments data
            gstr1_record.nature_of_document = data.get('nature_of_document')
            gstr1_record.sr_no_from = data.get('sr_no_from')
            gstr1_record.sr_no_to = data.get('sr_no_to')
            gstr1_record.total_number = data.get('total_number')
            gstr1_record.cancelled = data.get('cancelled', False)
            gstr1_record.net_issue = data.get('net_issue')

            # Save the record to the database
            gstr1_record.save()
            
            return JsonResponse({"message": "GSTR1 details stored successfully!"}, status=200)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# --------------------------GET GSTR1----------------------------------------



@csrf_exempt
def get_gstr1(request):
    if request.method == "GET":
        try:
            # Parse the JSON request body
            data = json.loads(request.body)
            record_id = data.get("id")

            if not record_id:
                return JsonResponse({"error": "ID not provided"}, status=400)

            # Fetch the record from the database
            try:
                gstr1_record = GSTR1.objects.get(id=record_id)

                # Prepare the response data with all fields
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
    if request.method == "PUT":
        try:
            
            data = json.loads(request.body)
            gstr1_id = data.get('gstr1_id')

            if not gstr1_id:
                return JsonResponse({"error": "ID is required."}, status=400)
            gstr1_record = GSTR1.objects.filter(id=gstr1_id).first()
            
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
    
                gstr1_record.save() 
                return JsonResponse({"message": "GSTR1 record updated successfully."}, status=200)
            else:
                return JsonResponse({"error": "Record not found."}, status=404)
        except GSTR1.DoesNotExist:
            return JsonResponse({"error": "GSTR1 record not found."}, status=404)
        
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
    else:
        return JsonResponse({"error": "Invalid request method."}, status=405)


# ------------------------DELETE GSTR1 --------------------



@csrf_exempt  
def delete_gstr1(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body)
            gstr1_id = data.get("gstr1_id")

            if not gstr1_id:
                return JsonResponse({"error": "ID not provided."}, status=400)

            gstr1_record = GSTR1.objects.filter(id=gstr1_id)
            if not gstr1_record.exists():
                return JsonResponse({"error": "Record not found."}, status=404)

            gstr1_record.delete()
            return JsonResponse({"message": f"Record with ID {gstr1_id} deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)

    return JsonResponse({"error": "Invalid request method. Use POST."}, status=400)

# -----------------------------CREATE   GSTR2  ----------------------------------------------

from django.utils.dateparse import parse_date
from .models import GSTR2

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


# # -----------------------------CREATE STOCK GROUP-------------------------------------------
# @csrf_exempt  
# def create_stock_group(request):
#     if request.method == "POST":
#         try:
           
#             data = json.loads(request.body)
            
           
#             name = data.get("name")
#             alias = data.get("alias")
#             under_name = data.get("under")  
#             quantities_added = data.get("quantities_added", "No")
#             set_alter_gst_details = data.get("set_alter_gst_details", "Yes")

#             # if under_name:
#             #     parent_group = StockGroup.objects.get(name=under_name)  
#             #     under = parent_group  
#             # else:
#             #     under = None  

           
#             stock_group = StockGroup.objects.create(
#                 name=name,
#                 alias=alias,
#                 under=under_name,
#                 quantities_added=quantities_added,
#                 set_alter_gst_details=set_alter_gst_details,
#             )

#             return JsonResponse({
#                 "id": stock_group.id,
#                 "name": stock_group.name,
#                 "message": "StockGroup created successfully!"
#             }, status=201)

#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "Parent group does not exist."}, status=400)
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON format."}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Invalid HTTP method. Use POST."}, status=405)


# # # ---------------------GET DETAILS FROM DATABASES-------------------------------------------


# @csrf_exempt
# def get_stock_group_details(request):
#     if request.method == 'GET':
#         try:
#             data = json.loads(request.body)

#             parent_id = data.get("id")

#             if not parent_id:
#                 return JsonResponse({"error": "Parent ID is required."}, status=400)

#             parent_group = StockGroup.objects.get(id=parent_id)

#             # child_groups = StockGroup.objects.filter(under=parent_group)

#             response_data = {
#                 "id": parent_group.id,
#                 "name": parent_group.name,
#                 "alias": parent_group.alias,
#                 "quantities_added": parent_group.quantities_added,
#                 "set_alter_gst_details": parent_group.set_alter_gst_details,
#                 "under": parent_group.under
#             }

#             # child_data = []
#             # for child in child_groups:
#             #     child_data.append({
#             #         "id": child.id,
#             #         "name": child.name,
#             #         "alias":child.alias,
#             #         "quantities_added": child.quantities_added,
#             #         "set_alter_gst_details": child.set_alter_gst_details,
#             #         "under": f"{child.under.name} ({child.under.id})" if child.under else None
#             #     })

#             # response_data = {
#             #     "parent": parent_data,
#             #     "children": child_data
#             # }

#             return JsonResponse(response_data, status=200)

#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "Stock Group not found."}, status=404)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)


# # # -----------------------------------UPDATE DEATILS--------------------------------------------------------

# @csrf_exempt
# def update_stock_group(request):
#     if request.method == 'PUT':
#         try:

#             data = json.loads(request.body)

#             id = data.get('id')

#             stock_group = StockGroup.objects.get(id=id)

#             stock_group.name = data.get("name", stock_group.name)
#             stock_group.alias = data.get("alias", stock_group.alias)
#             stock_group.quantities_added = data.get("quantities_added", stock_group.quantities_added)
#             stock_group.set_alter_gst_details = data.get("set_alter_gst_details", stock_group.set_alter_gst_details)
#             stock_group.under = data.get("under", stock_group.under)
            
#             # if 'under' in data:
#             #     parent_group_name = data.get("under")
#             #     if parent_group_name:

#             #         parent_group = StockGroup.objects.get(name=parent_group_name)
#             #         stock_group.under = parent_group

#             stock_group.save()

#             return JsonResponse({
#                 "id": stock_group.id,
#                 "name": stock_group.name,
#                 "message": "StockGroup updated successfully!"
#             }, status=200)

#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "StockGroup not found."}, status=404)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
#     else:
#         return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)

# # # ------------------------------------DELETE DETAILS --------------------------------------------------


# @csrf_exempt
# def delete_stock_group(request):
#     if request.method == 'DELETE':
#         try:
#             data = json.loads(request.body)

#             id = data.get('id')

#             if not id:
#                 return JsonResponse({"error": "ID not provided in the request."}, status=400)

#             stock_group = StockGroup.objects.get(id=id)

#             stock_group.delete()

#             return JsonResponse({
#                 "message": "StockGroup deleted successfully!",
#                 "id": id
#             }, status=200)

#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "StockGroup not found."}, status=404)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     else:
#         return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)
    

# #  # -------------------------------- STORE STOCK CATEGORY ---------------------------------------------

# @csrf_exempt
# def create_stock_category(request):
#     if request.method == 'GET':
#         try:
#             data = json.loads(request.body.decode('utf-8'))
#             name = data.get('name')
#             alias = data.get('alias')
#             under_name = data.get('under') 

#             if not name:
#                 return JsonResponse({'error': 'Name is required'}, status=400)

            
#             if under_name:
#                 try:
#                     under_group = StockGroup.objects.get(name=under_name)
#                 except StockGroup.DoesNotExist:
#                     return JsonResponse({'error': 'StockGroup not found'}, status=404)
#             else:
#                 under_group = None

#             stock_category = StockCategory.objects.create(
#                 name=name,
#                 alias=alias,
#                 under=under_group
#             )

#             return JsonResponse({
#                 'message': 'Stock Category created successfully',
#                 'data': {
#                     'id': stock_category.id,
#                     'name': stock_category.name,
#                     'alias': stock_category.alias,
#                     'under': stock_category.under.id if stock_category.under else None  # Return the ID of the StockGroup
#                 }
#             }, status=201)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)



# # #  ----------------------UPDATE STOCK CATEGORY DETAILS------------------------------------


# @csrf_exempt
# def update_stock_category(request):
#     if request.method == 'PUT':
#         try:
           
#             data = json.loads(request.body)
#             stock_category_id = data.get('id')
#             name = data.get('name')
#             alias = data.get('alias')
#             under_name = data.get('under') 

#             if not stock_category_id:
#                 return JsonResponse({'error': 'StockCategory ID is required'}, status=400)

#             stock_category = StockCategory.objects.get(id=stock_category_id)

#             if under_name:
#                 try:
#                     under_group = StockGroup.objects.get(name=under_name)
#                     stock_category.under = under_group  
#                 except StockGroup.DoesNotExist:
#                     return JsonResponse({'error': 'StockGroup with the given name not found'}, status=404)

#             if name:
#                 stock_category.name = name
#             if alias:
#                 stock_category.alias = alias

#             stock_category.save()

#             response_data = {
#                 'message': 'StockCategory updated successfully',
#                 'stock_category': {
#                     'id': stock_category.id,
#                     'name': stock_category.name,
#                     'alias': stock_category.alias,
#                     'under': stock_category.under.id if stock_category.under else None  
#                 }
#             }

#             return JsonResponse(response_data, status=200)

#         except StockCategory.DoesNotExist:
#             return JsonResponse({'error': 'StockCategory not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)

# # # ----------------------------------DELETE CATEGORY -----------------------------------------------------



# @csrf_exempt
# def delete_stock_category(request):
#     if request.method == 'DELETE':
#         try:
#             data = json.loads(request.body)
#             stock_category_id = data.get('id')

#             if not stock_category_id:
#                 return JsonResponse({'error': 'StockCategory ID is required'}, status=400)

#             stock_category = StockCategory.objects.get(id=stock_category_id)

#             stock_category.delete()

#             return JsonResponse({'message': 'StockCategory deleted successfully'}, status=200)

#         except StockCategory.DoesNotExist:
#             return JsonResponse({'error': 'StockCategory not found'}, status=404)
#         except Exception as e:
#             return JsonResponse({'error': str(e)}, status=500)

#     return JsonResponse({'error': 'Invalid request method'}, status=405)



# # # --------------------GET STOCK GROUPS AND REALATED CATEGORIES---------------------------------------
# @csrf_exempt
# def get_stock_group_and_categories(request):
#     if request.method == 'GET':
#         try:
#             data = json.loads(request.body)
#             group_id = data.get('group_id')

#             if not group_id:
#                 return JsonResponse({'error': 'Group ID is required'}, status=400)

#             try:
#                 stock_group = StockGroup.objects.get(id=group_id)
#             except StockGroup.DoesNotExist:
#                 return JsonResponse({'error': 'StockGroup not found'}, status=404)

#             stock_categories = StockCategory.objects.filter(under=stock_group)

#             categories_data = [
#                 {
#                     'id': category.id,
#                     'name': category.name,
#                     'alias': category.alias,
#                     'under': category.under.id if category.under else None
#                 }
#                 for category in stock_categories
#             ]

#             return JsonResponse({
#                 'group': {
#                     'id': stock_group.id,
#                     'name': stock_group.name,
#                     'alias':stock_group.alais,
#                     'quantities_added': stock_group.quantities_added,
#                     'set_alter_gst_details': stock_group.set_alter_gst_details,
#                     'under': stock_group.under.id if stock_group.under else None
#                 },
#                 'categories': categories_data
#             }, status=200)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)

# # -----------------DELETE STOCK GROUPS AND RELATED CATEGORY  -----------------------------------------

# @csrf_exempt
# def delete_stock_group_and_category(request):
#     if request.method == "DELETE":
#         try:
#             data = json.loads(request.body)
#             stock_group = StockGroup.objects.get(id=data['id'])
#             stock_group.delete()

#             return JsonResponse({"message": "Stock Group and related Stock Categories deleted successfully!"}, status=200)

#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "StockGroup not found"}, status=404)
#         except KeyError:
#             return JsonResponse({"error": "Missing required field(s)"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Only POST method allowed."}, status=405)



# # # ------------------------------------UNIT CREATION ---------------------------------------------------

# @csrf_exempt
# def create_unit_creation(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)

#             unit_type = data.get('unit_type')
#             symbol = data.get('symbol')
#             formal_name = data.get('formal_name')
#             uqc = data.get('uqc')
#             decimal_places = data.get('decimal_places', 0)  

#             if not unit_type or not symbol or not formal_name or uqc is None:
#                 return JsonResponse({"error": "All required fields must be provided."}, status=400)

#             unit_creation = UnitCreation(
#                 unit_type=unit_type,
#                 symbol=symbol,
#                 formal_name=formal_name,
#                 uqc=uqc,
#                 decimal_places=decimal_places
#             )

#             unit_creation.save()

#             return JsonResponse({
#                 "id": unit_creation.id,
#                 "formal_name": unit_creation.formal_name,
#                 "message": "UnitCreation created successfully!"
#             }, status=201)

#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON data."}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
    
#     else:
#         return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)

# # # ----------------------------GET UNIT ------------------------------------------------------

# @csrf_exempt
# def get_unit_creation(request):
#     if request.method == 'GET':
#         try:
#             data = json.loads(request.body)

#             id = data.get('id')

#             if not id:
#                 return JsonResponse({"error": "ID not provided in the request."}, status=400)

#             unit_creation = UnitCreation.objects.get(id=id)

#             return JsonResponse({
#                 "id": unit_creation.id,
#                 "unit_type": unit_creation.unit_type,
#                 "symbol": unit_creation.symbol,
#                 "formal_name": unit_creation.formal_name,
#                 "uqc": unit_creation.uqc,
#                 "decimal_places": unit_creation.decimal_places,
#                 "message": "UnitCreation fetched successfully!"
#             }, status=200)

#         except UnitCreation.DoesNotExist:
#             return JsonResponse({"error": "UnitCreation not found."}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON data."}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)
    
#     else:
#         return JsonResponse({"error": "Invalid request method. Use POST."}, status=405)


# # # -----------------------------------UPDATE UNIT TABLE---------------------------------------



# @csrf_exempt
# def update_unit_creation(request):
#     if request.method == 'PUT':
#         try:
#             data = json.loads(request.body)

#             id = data.get('id')

#             if not id:
#                 return JsonResponse({"error": "ID not provided in the request."}, status=400)

#             unit_creation = UnitCreation.objects.get(id=id)

#             unit_creation.unit_type = data.get('unit_type', unit_creation.unit_type)
#             unit_creation.symbol = data.get('symbol', unit_creation.symbol)
#             unit_creation.formal_name = data.get('formal_name', unit_creation.formal_name)
#             unit_creation.uqc = data.get('uqc', unit_creation.uqc)
#             unit_creation.decimal_places = data.get('decimal_places', unit_creation.decimal_places)

#             unit_creation.save()

#             return JsonResponse({
#                 "id": unit_creation.id,
#                 "unit_type": unit_creation.unit_type,
#                 "symbol": unit_creation.symbol,
#                 "formal_name": unit_creation.formal_name,
#                 "uqc": unit_creation.uqc,
#                 "decimal_places": unit_creation.decimal_places,
#                 "message": "UnitCreation updated successfully!"
#             }, status=200)

#         except UnitCreation.DoesNotExist:
#             return JsonResponse({"error": "UnitCreation not found."}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON data."}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     else:
#         return JsonResponse({"error": "Invalid request method. Use PUT."}, status=405)


# # # ------------------------------------DELETE UNIT-----------------------------------------------------
# @csrf_exempt
# def delete_unit_creation(request):
#     if request.method == 'DELETE':
#         try:
#             data = json.loads(request.body)

#             id = data.get('id')

#             if not id:
#                 return JsonResponse({"error": "ID not provided in the request."}, status=400)

#             unit_creation = UnitCreation.objects.get(id=id)

#             unit_creation.delete()

#             return JsonResponse({
#                 "message": "UnitCreation deleted successfully!",
#                 "id": id
#             }, status=200)

#         except UnitCreation.DoesNotExist:
#             return JsonResponse({"error": "UnitCreation not found."}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({"error": "Invalid JSON data."}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     else:
#         return JsonResponse({"error": "Invalid request method. Use DELETE."}, status=405)
# # # -------------------------------------CREATE STOCK ITEM------------------------------------------------


# @csrf_exempt
# def create_stock_item(request):
#     if request.method == "POST":
#         try:
#             data = json.loads(request.body)

#             group = StockGroup.objects.get(id=data['group_id'])

#             category = StockCategory.objects.get(name=data['under'])

#             unit = UnitCreation.objects.get(name=data['units'])

#             stock_item = StockItem.objects.create(
#                 name=data['name'],
#                 alias=data['alias'],
#                 group_id=group,
#                 under=category,
#                 units=unit,
#                 gst_applicability=data['gst_applicability'],
#                 set_alter_gst_details=data['set_alter_gst_details'],
#                 type_of_supply=data['type_of_supply'],
#                 rate_of_duty=data.get('rate_of_duty', None),
#                 opening_quantity=data['opening_quantity'],
#                 rate_per_unit=data['rate_per_unit'],
#                 value=data['value']
#             )

#             return JsonResponse({"message": "Stock Item created successfully!"}, status=201)

#         except KeyError as e:
#             return JsonResponse({"error": f"Missing field: {e}"}, status=400)
#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "Invalid StockGroup ID."}, status=400)
#         except StockCategory.DoesNotExist:
#             return JsonResponse({"error": "Invalid StockCategory name."}, status=400)
#         except UnitCreation.DoesNotExist:
#             return JsonResponse({"error": "Invalid Units name."}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Only POST method allowed."}, status=405)


# # # --------------------------GET STOCK ITEM WITH ITEM ID -----------------------------------------------


# @csrf_exempt
# def get_stock_item_details(request):
#     if request.method == "GET":
#         try:
#             data = json.loads(request.body)

#             stock_item = StockItem.objects.get(id=data['id'])

#             response = {
#                 "id": stock_item.id,
#                 "name": stock_item.name,
#                 "alias":stock_item.alias,
#                 "group": {
#                     "id": stock_item.group_id.id,
#                     "name": stock_item.group_id.name
#                 },
#                 "under": {
#                     "id": stock_item.under.id,
#                     "name": stock_item.under.name
#                 },
#                 "units": {
#                     "id": stock_item.units.id,
#                     "name": stock_item.units.name
#                 },
#                 "gst_applicability": stock_item.gst_applicability,
#                 "set_alter_gst_details": stock_item.set_alter_gst_details,
#                 "type_of_supply": stock_item.type_of_supply,
#                 "rate_of_duty": stock_item.rate_of_duty,
#                 "opening_quantity": stock_item.opening_quantity,
#                 "rate_per_unit": stock_item.rate_per_unit,
#                 "value": stock_item.value
#             }

#             return JsonResponse(response, status=200)

#         except StockItem.DoesNotExist:
#             return JsonResponse({"error": "StockItem not found"}, status=404)
#         except KeyError:
#             return JsonResponse({"error": "Missing 'id' in request body"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Only POST method allowed."}, status=405)


# # # -----------------------------UPADTE STOCK ITEM DEATILS-----------------------------------------------


# @csrf_exempt
# def update_stock_item(request):
#     if request.method == "PUT":
#         try:
#             data = json.loads(request.body)
#             stock_item = StockItem.objects.get(id=data['id'])

#             if 'name' in data:
#                 stock_item.name = data['name']
#             if 'alias' in data:
#                 stock_item.alias = data['alias']

#             if 'group_id' in data:
#                 group = StockGroup.objects.get(id=data['group_id'])
#                 stock_item.group_id = group

#             if 'under' in data:
#                 category = StockCategory.objects.get(name=data['under'])
#                 stock_item.under = category

#             if 'units' in data:
#                 stock_item.units = data['units']

#             if 'gst_applicability' in data:
#                 stock_item.gst_applicability = data['gst_applicability']

#             if 'set_alter_gst_details' in data:
#                 stock_item.set_alter_gst_details = data['set_alter_gst_details']

#             if 'type_of_supply' in data:
#                 stock_item.type_of_supply = data['type_of_supply']

#             if 'rate_of_duty' in data:
#                 stock_item.rate_of_duty = data['rate_of_duty']

#             if 'opening_quantity' in data:
#                 stock_item.opening_quantity = data['opening_quantity']

#             if 'rate_per_unit' in data:
#                 stock_item.rate_per_unit = data['rate_per_unit']

#             if 'value' in data:
#                 stock_item.value = data['value']

#             stock_item.save()

#             return JsonResponse({"message": "Stock Item updated successfully!"}, status=200)

#         except StockItem.DoesNotExist:
#             return JsonResponse({"error": "StockItem not found"}, status=404)
#         except StockGroup.DoesNotExist:
#             return JsonResponse({"error": "Invalid StockGroup ID"}, status=400)
#         except StockCategory.DoesNotExist:
#             return JsonResponse({"error": "Invalid StockCategory name"}, status=400)
#         except KeyError:
#             return JsonResponse({"error": "Missing required field(s)"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Only POST method allowed."}, status=405)



# # # ------------------------------DELETE STOCK ITEM WITH ITEM ID-------------------------------------


# @csrf_exempt
# def delete_stock_item(request):
#     if request.method == "DELETE":
#         try:
#             data = json.loads(request.body)
#             stock_item = StockItem.objects.get(id=data['id'])
#             stock_item.delete()

#             return JsonResponse({"message": "Stock Item deleted successfully!"}, status=200)

#         except StockItem.DoesNotExist:
#             return JsonResponse({"error": "StockItem not found"}, status=404)
#         except KeyError:
#             return JsonResponse({"error": "Missing required field(s)"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Only POST method allowed."}, status=405)

# # # ---------------------------GET STOCKCATEGORY AND STOCKITEMS------------------------------------
# @csrf_exempt
# def get_stock_category_and_items(request):
#     if request.method == 'GET':
#         try:
#             data = json.loads(request.body)
#             category_id = data.get('category_id')

#             if not category_id:
#                 return JsonResponse({'error': 'Category ID is required'}, status=400)

#             try:
#                 stock_category = StockCategory.objects.get(id=category_id)
#             except StockCategory.DoesNotExist:
#                 return JsonResponse({'error': 'StockCategory not found'}, status=404)

#             stock_items = StockItem.objects.filter(under=stock_category)

#             items_data = [
#                 {
#                     'id': item.id,
#                     'name': item.name,
#                     'alias':item.alias,
#                     'group': item.group.id if item.group else None,
#                     'units': item.units,
#                     'gst_applicability': item.gst_applicability,
#                     'set_alter_gst_details': item.set_alter_gst_details,
#                     'type_of_supply': item.type_of_supply,
#                     'rate_of_duty': item.rate_of_duty,
#                     'opening_quantity': item.opening_quantity,
#                     'rate_per_unit': item.rate_per_unit,
#                     'value': item.value
#                 }
#                 for item in stock_items
#             ]

#             return JsonResponse({
#                 'category': {
#                     'id': stock_category.id,
#                     'name': stock_category.name,
#                     'alias': stock_category.alias,
#                     'under': stock_category.under.id if stock_category.under else None
#                 },
#                 'items': items_data
#             }, status=200)

#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON format'}, status=400)

#     return JsonResponse({'error': 'Method not allowed'}, status=405)


# # #-------------------------------DELETE STOCKCATEGORY AND STOCKITEM with STOCKCATEGORY ID-------------------------------


# @csrf_exempt
# def delete_stock_category_and_items(request):
#     if request.method == "DELETE":
#         try:
#             data = json.loads(request.body)
#             stock_category = StockCategory.objects.get(id=data['id'])
#             stock_category.delete()

#             return JsonResponse({"message": "Stock Category and related Stock Items deleted successfully!"}, status=200)

#         except StockCategory.DoesNotExist:
#             return JsonResponse({"error": "StockCategory not found"}, status=404)
#         except KeyError:
#             return JsonResponse({"error": "Missing required field(s)"}, status=400)
#         except Exception as e:
#             return JsonResponse({"error": str(e)}, status=500)

#     return JsonResponse({"error": "Only POST method allowed."}, status=405)



# # --------------------------STOCK GROUP TAX DETAILS--------------------------------------------------

 

@csrf_exempt
def stock_group_tax_details(request):
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

            stock_group_tax = TaxDetails.objects.create(
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
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))
            id = data.get('id')

            if not id:
                return JsonResponse({'error': 'ID is required'}, status=400)

            try:
                stock_group_tax = TaxDetails.objects.get(id=id)
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


# # ----------------------UPDATE TAX DETAILS -------------------------------------------------


@csrf_exempt
def update_stock_group_tax_details(request):
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
                stock_group_tax = TaxDetails.objects.get(id=id)

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

                stock_group_tax.save()

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


# # --------------------------------DELETE TAX DETAILS------------------------------------


@csrf_exempt
def delete_stock_group_tax_details(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            id = data.get('id')

            if not id:
                return JsonResponse({'error': 'ID is required'}, status=400)

            try:
                stock_group_tax = TaxDetails.objects.get(id=id)
                stock_group_tax.delete()

                return JsonResponse({'message': 'Stock Group Tax Details deleted successfully'}, status=200)

            except TaxDetails.DoesNotExist:
                return JsonResponse({'error': 'Stock Group Tax Details not found'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ----------------------CREATE E-WAY BILL DETAILS-------------------------------
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import EWayBill

@csrf_exempt
def create_ewaybill(request):
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

            mandatory_fields = [eway_bill_no, date, dispatch_from, ship_to, transport_id, mode, 
                                doc_lading_rr_airway_no, vehicle_number, vehicle_type, date_of_transport]
            if not all(mandatory_fields):
                return JsonResponse({"message": "All mandatory fields must be provided."}, status=400)

            ewaybill = EWayBill.objects.create(
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
                "message": "EWayBill created successfully.",
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
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)

# ---------------------------------GET E-WAY BILL DETAILS--------------------------------



@csrf_exempt
def get_ewaybill(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            
            ewaybill_id = data.get('id')
            
            if not ewaybill_id:
                return JsonResponse({"message": "ID is required."}, status=400)
            
            try:
                ewaybill = EWayBill.objects.get(id=ewaybill_id)
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
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)

# -------------------------------UPDATE E-WAY BILL DETAILS -----------------------------------



@csrf_exempt
def update_ewaybill(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            ewaybill_id = data.get('id')

            if not ewaybill_id:
                return JsonResponse({"message": "ID is required to update an EWayBill."}, status=400)

            try:
                ewaybill = EWayBill.objects.get(id=ewaybill_id)
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

            ewaybill.save()
            return JsonResponse({"message": "EWayBill updated successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only PUT method is allowed."}, status=405)

 #--------------------DELETE E-WAY BILL DETAAILS ---------------------------



@csrf_exempt
def delete_ewaybill(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            ewaybill_id = data.get('id')

            if not ewaybill_id:
                return JsonResponse({"message": "ID is required to delete an EWayBill."}, status=400)

            try:
                ewaybill = EWayBill.objects.get(id=ewaybill_id)
            except EWayBill.DoesNotExist:
                return JsonResponse({"message": "EWayBill with the given ID does not exist."}, status=404)

            ewaybill.delete()
            return JsonResponse({"message": "EWayBill deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:



            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only DELETE method is allowed."}, status=405)


# --------------------------CREATE E-INVOICE DEATAILS----------------------
from .models import EInvoice

@csrf_exempt
def create_einvoice(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            ack_no = data.get('ack_no')
            ack_date = data.get('ack_date')
            irn = data.get('irn')
            bill_to_place = data.get('bill_to_place')
            ship_to_place = data.get('ship_to_place')

            if not ack_no or not ack_date or not irn or not bill_to_place or not ship_to_place:
                return JsonResponse({"message": "All fields are required."}, status=400)

            einvoice = EInvoice(
                ack_no=ack_no,
                ack_date=ack_date,
                irn=irn,
                bill_to_place=bill_to_place,
                ship_to_place=ship_to_place
            )
            einvoice.save()

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
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
            einvoice_id = data.get('id')

            if not einvoice_id:
                return JsonResponse({"message": "ID is required."}, status=400)

            try:
                einvoice = EInvoice.objects.get(id=einvoice_id)
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
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)


# --------------------UPDATE E-INVOICE DETAILS---------------------------

@csrf_exempt
def update_einvoice(request):
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

            try:
                einvoice = EInvoice.objects.get(id=einvoice_id)
                
                einvoice.ack_no = ack_no
                einvoice.ack_date = ack_date
                einvoice.irn = irn
                einvoice.bill_to_place = bill_to_place
                einvoice.ship_to_place = ship_to_place

                einvoice.save()

                return JsonResponse({"message": "e-Invoice updated successfully."}, status=200)

            except EInvoice.DoesNotExist:
                return JsonResponse({"message": "e-Invoice not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)


# ------------------------DELETE E-INVOICE DETAILS-----------------------------------



@csrf_exempt
def delete_einvoice(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            
            einvoice_id = data.get('id')

            if not einvoice_id:
                return JsonResponse({"message": "ID is required."}, status=400)

            try:
                einvoice = EInvoice.objects.get(id=einvoice_id)
                
                einvoice.delete()

                return JsonResponse({"message": "e-Invoice deleted successfully."}, status=200)

            except EInvoice.DoesNotExist:
                return JsonResponse({"message": "e-Invoice not found."}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format."}, status=400)

        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    else:
        return JsonResponse({"message": "Only POST method is allowed."}, status=405)


# ------------------------CALCULATE AND STORE PRICE DETAILS-------------------------------------
# from django.http import JsonResponse

# def calculate_product_details(request):
#     if request.method == 'POST':
#         # Get input data from the request
#         sale_price = float(request.POST.get('sale_price'))
#         discount = float(request.POST.get('discount'))
#         cgst_percentage = float(request.POST.get('cgst_percentage'))
#         sgst_percentage = float(request.POST.get('sgst_percentage'))
#         igst_percentage = float(request.POST.get('igst_percentage'))
#         cess_percentage = float(request.POST.get('cess_percentage'))

#         # Calculate discounted price
#         discounted_price = sale_price - (sale_price * discount / 100)

#         # Calculate individual tax amounts
#         cgst_amount = discounted_price * cgst_percentage / 100
#         sgst_amount = discounted_price * sgst_percentage / 100
#         igst_amount = discounted_price * igst_percentage / 100
#         cess_amount = discounted_price * cess_percentage / 100

#         # Calculate total amount
#         total_amount = discounted_price + cgst_amount + sgst_amount + igst_amount + cess_amount

#         # Return the calculated values
#         return JsonResponse({
#             "message": "Calculation successful!",
#             "input_values": {
#                 "sale_price": sale_price,
#                 "discount": discount,
#                 "cgst_percentage": cgst_percentage,
#                 "sgst_percentage": sgst_percentage,
#                 "igst_percentage": igst_percentage,
#                 "cess_percentage": cess_percentage
#             },
#             "calculated_values": {
#                 "discounted_price": round(discounted_price, 2),
#                 "cgst_amount": round(cgst_amount, 2),
#                 "sgst_amount": round(sgst_amount, 2),
#                 "igst_amount": round(igst_amount, 2),
#                 "cess_amount": round(cess_amount, 2),
#                 "total_amount": round(total_amount, 2)
#             }
#         })

#     return JsonResponse({"message": "Invalid request method."}, status=400)



# from .models import ProductDetails, Product
# from django.http import JsonResponse

# def calculate_and_store_product_details(request):
#     if request.method == 'POST':
#         try:
#             # Get input data from the request
#             product_id = request.POST.get('product_id')
#             sale_price = float(request.POST.get('sale_price'))
#             discount = float(request.POST.get('discount'))
#             cgst_percentage = float(request.POST.get('cgst_percentage'))
#             sgst_percentage = float(request.POST.get('sgst_percentage'))
#             igst_percentage = float(request.POST.get('igst_percentage'))
#             cess_percentage = float(request.POST.get('cess_percentage'))

#             # Perform calculations
#             discounted_price = sale_price - (sale_price * discount / 100)
#             cgst_amount = discounted_price * cgst_percentage / 100
#             sgst_amount = discounted_price * sgst_percentage / 100
#             igst_amount = discounted_price * igst_percentage / 100
#             cess_amount = discounted_price * cess_percentage / 100
#             total_amount = discounted_price + cgst_amount + sgst_amount + igst_amount + cess_amount

#             # Fetch the product instance
#             product = Product.objects.get(id=product_id)

#             # Store all values in the database
#             ProductDetails.objects.create(
#                 product=product,
#                 sale_price=sale_price,
#                 discount=discount,
#                 discounted_price=round(discounted_price, 2),
#                 cgst_percentage=cgst_percentage,
#                 sgst_percentage=sgst_percentage,
#                 igst_percentage=igst_percentage,
#                 cess_percentage=cess_percentage,
#                 cgst_amount=round(cgst_amount, 2),
#                 sgst_amount=round(sgst_amount, 2),
#                 igst_amount=round(igst_amount, 2),
#                 cess_amount=round(cess_amount, 2),
#                 total_amount=round(total_amount, 2)
#             )

#             # Respond with success
#             return JsonResponse({"message": "Product details stored successfully!"})

#         except Product.DoesNotExist:
#             return JsonResponse({"message": "Product not found."}, status=404)
#         except Exception as e:
#             return JsonResponse({"message": str(e)}, status=400)

#     return JsonResponse({"message": "Invalid request method."}, status=400)


# --------------
# from django.http import JsonResponse
# from decimal import Decimal

# def calculate_gst_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)

#         # Input values
#         sale_price = Decimal(data.get('sale_price', 0))
#         discount = Decimal(data.get('discount', 0))
#         cgst_percentage = Decimal(data.get('cgst_percentage', 0))
#         sgst_percentage = Decimal(data.get('sgst_percentage', 0))
#         igst_percentage = Decimal(data.get('igst_percentage', 0))
#         cess_percentage = Decimal(data.get('cess_percentage', 0))

#         # Calculations
#         discounted_price = sale_price - (sale_price * discount / 100)
#         cgst_amount = discounted_price * cgst_percentage / 100
#         sgst_amount = discounted_price * sgst_percentage / 100
#         igst_amount = discounted_price * igst_percentage / 100
#         cess_amount = discounted_price * cess_percentage / 100
#         total_amount = discounted_price + cgst_amount + sgst_amount + igst_amount + cess_amount

#         # Response
#         return JsonResponse({
#             "discounted_price": round(discounted_price, 2),
#             "cgst_amount": round(cgst_amount, 2),
#             "sgst_amount": round(sgst_amount, 2),
#             "igst_amount": round(igst_amount, 2),
#             "cess_amount": round(cess_amount, 2),
#             "total_amount": round(total_amount, 2)
#         })

#     return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# from django.http import JsonResponse
# from .models import ProductDetails, PriceGstDetails
# import json

# def store_gst_details_view(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)

#         # Fetch the product object
#         product = ProductDetails.objects.get(id=data.get('product_id'))

#         # Save the details in the database
#         PriceGstDetails.objects.create(
#             product=product,
#             purchase_price=data.get('purchase_price'),
#             sale_price=data.get('sale_price'),
#             min_sale_price=data.get('min_sale_price'),
#             mrp=data.get('mrp'),
#             discount=data.get('discount'),
#             hsn_sac_code=data.get('hsn_sac_code'),
#             cess_percentage=data.get('cess_percentage'),
#             cgst_percentage=data.get('cgst_percentage'),
#             sgst_percentage=data.get('sgst_percentage'),
#             igst_percentage=data.get('igst_percentage'),
#             discounted_price=data.get('discounted_price'),
#             cgst_amount=data.get('cgst_amount'),
#             sgst_amount=data.get('sgst_amount'),
#             igst_amount=data.get('igst_amount'),
#             cess_amount=data.get('cess_amount'),
#             total_amount=data.get('total_amount'),
#         )

#         return JsonResponse({"message": "Details stored successfully."})

#     return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# ------------------------ NEW CATEGORY ------------------------------
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Category

@csrf_exempt
def create_category(request):
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

            category = Category.objects.create(
                category_name=category_name,
                cgst=cgst,
                sgst=sgst,
                igst=igst
            )

            return JsonResponse({
                "message": f"Category '{category.category_name}' created successfully.",
                "id": category.id,
                "category_name": category.category_name
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# ------------------------------ GET NEW CATEGORY -----------------------
from .models import Category

@csrf_exempt  
def get_category(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))
            category_id = data.get('id')

            if not category_id:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category = Category.objects.filter(id=category_id).first()

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
    
# --------------------GET CATEGORY AND SUBCATEGORY DETAILS WITH CATEGORY ID----------------------

from .models import Category, SubCategory

@csrf_exempt
def get_category_and_subcategory(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'category_id' not in data:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category_id = data['category_id']
            category = Category.objects.filter(id=category_id).first()
            if not category:
                return JsonResponse({"error": "Category not found."}, status=404)

            subcategories = SubCategory.objects.filter(category_name=category)
            subcategory_details = [
                {"id": sub.id, "subcategory_name": sub.subcategory_name, "hsn_sac_code": sub.hsn_sac_code}
                for sub in subcategories
            ]

            return JsonResponse({
                "category_id": category.id,
                "category_name": category.category_name,
                "cgst": category.cgst,
                "sgst": category.sgst,
                "igst": category.igst,
                "subcategories": subcategory_details
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# --------------------DELETE CATEGORY AND SUBCATEGORY DETAILS WITH CATEGORY ID ------------------



@csrf_exempt
def delete_category_and_subcategory(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            if 'category_id' not in data:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category_id = data['category_id']
            category = Category.objects.filter(id=category_id).first()
            if not category:
                return JsonResponse({"error": "Category not found."}, status=404)

            subcategories = SubCategory.objects.filter(category_name=category)
            subcategories.delete()
            category.delete()

            return JsonResponse({"message": "Category and its subcategories deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only DELETE method is allowed."}, status=405)



# --------------------UPDATE NEW CATEGORY -------------------------


from .models import Category

@csrf_exempt 
def update_category(request):
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

            category = Category.objects.filter(id=category_id).first()

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

            category.save()

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



# -----------------DELETE NEW CATEGORY-----------------------------

from .models import Category

@csrf_exempt
def delete_category(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))
            category_id = data.get('id')

            if not category_id:
                return JsonResponse({"error": "Category ID is required."}, status=400)

            category = Category.objects.filter(id=category_id).first()

            if not category:
                return JsonResponse({"error": "Category not found."}, status=404)

            category.delete()

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


from .models import SubCategory, Category

@csrf_exempt
def create_subcategory(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))

            required_fields = ['category_name', 'subcategory_name','hsn_sac_code']
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)
            
            category_name = data.get('category_name')  
            subcategory_name = data.get('subcategory_name')
            hsn_sac_code = data.get('hsn_sac_code')
            
            category = Category.objects.get(category_name=category_name)
            
           
            subcategory = SubCategory.objects.create(
                category_name=category,  
                subcategory_name=subcategory_name,
                hsn_sac_code=hsn_sac_code
            )
            
            return JsonResponse({"message": "SubCategory created successfully"}, status=201)
        
        except Category.DoesNotExist:
            return JsonResponse({"error": "Category not found"}, status=404)
        except KeyError:
            return JsonResponse({"error": "Missing required fields"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# -----------------GET SUB CATEGORY-----------------------


@csrf_exempt
def get_subcategory(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body.decode('utf-8'))
            subcategory_id = data.get('id')

            if not subcategory_id:
                return JsonResponse({"error": "ID is required"}, status=400)

            try:
                subcategory = SubCategory.objects.get(id=subcategory_id)
                response_data = {
                    "id": subcategory.id,
                    "category_name": subcategory.category_name.category_name,
                    "subcategory_name": subcategory.subcategory_name,
                    "hsn_sac_code": subcategory.hsn_sac_code
                }
                return JsonResponse(response_data, status=200)
            except SubCategory.DoesNotExist:
                return JsonResponse({"error": "SubCategory not found"}, status=404)

        except KeyError as ke:
            return JsonResponse({"error": f"Key error: {str(ke)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# ------------UPDATE SUB CATEGORY -------------------



@csrf_exempt
def update_subcategory(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body.decode('utf-8'))
            subcategory_id = data.get('id')
            category_name = data.get('category_name')
            subcategory_name = data.get('subcategory_name')
            hsn_sac_code = data.get('hsn_sac_code')

            if not subcategory_id or not category_name or not subcategory_name or not hsn_sac_code:
                return JsonResponse({"error": "All fields are required"}, status=400)

            try:
                subcategory = SubCategory.objects.get(id=subcategory_id)
            except SubCategory.DoesNotExist:
                return JsonResponse({"error": "SubCategory not found"}, status=404)

            try:
                category = Category.objects.get(category_name=category_name)
            except Category.DoesNotExist:
                return JsonResponse({"error": "Category not found"}, status=404)

            subcategory.category_name = category
            subcategory.subcategory_name = subcategory_name
            subcategory.hsn_sac_code = hsn_sac_code
            subcategory.save()

            return JsonResponse({"message": "SubCategory updated successfully"}, status=200)

        except KeyError as ke:
            return JsonResponse({"error": f"Key error: {str(ke)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# -------------DELETE SUB CATEGORY--------------

from .models import SubCategory

@csrf_exempt
def delete_subcategory(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            subcategory_id = data.get('id')

            subcategory = SubCategory.objects.filter(id=subcategory_id).first()

            if not subcategory:
                return JsonResponse({"error": "SubCategory not found."}, status=404)

            subcategory.delete()

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


from .models import Brand
@csrf_exempt
def create_brand(request):
    if request.method == 'POST':
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

            if Brand.objects.filter(brand_name=brand_name).exists():
                return JsonResponse({"error": "Brand already exists."}, status=400)

            brand = Brand.objects.create(brand_name=brand_name)

            return JsonResponse({
                "message": "Brand created successfully.",
                "id": brand.id,
                "brand_name": brand.brand_name
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)



# -------------------GET  BRAND ------------------
from .models import Brand

@csrf_exempt
def get_brand(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            brand_id = data['id']

            brand = Brand.objects.filter(id=brand_id).first()

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
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# ---------------UPDATE BRAND -------------------------


from .models import Brand

@csrf_exempt
def update_brand(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data or 'brand_name' not in data:
                return JsonResponse({"error": "ID and brand_name are required."}, status=400)

            brand_id = data['id']
            brand_name = data['brand_name']

            brand = Brand.objects.filter(id=brand_id).first()

            if not brand:
                return JsonResponse({"error": "Brand not found."}, status=404)

            brand.brand_name = brand_name
            brand.save()

            return JsonResponse({
                "message": "Brand updated successfully.",
                "id": brand.id,
                "brand_name": brand.brand_name
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# -------------------DELETE BRAND -------------------------

from .models import Brand

@csrf_exempt
def delete_brand(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            brand_id = data['id']

            brand = Brand.objects.filter(id=brand_id).first()

            if not brand:
                return JsonResponse({"error": "Brand not found."}, status=404)

            brand.delete()

            return JsonResponse({
                "message": "Brand deleted successfully.",
                "id": brand_id ,
                
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)
    
# ---------------------CREATE NEW UNIT ----------------

from .models import Unit

@csrf_exempt
def create_unit(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))

            required_fields = ['unit', 'full_name', 'allow_decimal']

            for field in required_fields:
                if field not in data:
                    return JsonResponse({"error": f"{field} is required."}, status=400)

            unit = data['unit']
            full_name = data['full_name']
            allow_decimal = data['allow_decimal']

            if Unit.objects.filter(unit=unit).exists():
                return JsonResponse({"error": "Unit already exists."}, status=400)

            new_unit = Unit.objects.create(
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
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)

# --------------------------GET UNIT --------------------------


from .models import Unit

@csrf_exempt
def get_unit(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            unit_id = data['id']

            unit = Unit.objects.filter(id=unit_id).first()

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
    else:
        return JsonResponse({"error": "Only POST method is allowed."}, status=405)


# --------------------UPDATE UNIT -----------------------

from .models import Unit

@csrf_exempt
def update_unit(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            unit_id = data['id']
            unit = Unit.objects.filter(id=unit_id).first()

            if not unit:
                return JsonResponse({"error": "Unit not found."}, status=404)

            if 'unit' in data:
                unit.unit = data['unit']
            if 'full_name' in data:
                unit.full_name = data['full_name']
            if 'allow_decimal' in data:
                unit.allow_decimal = data['allow_decimal']

            unit.save()

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
    else:
        return JsonResponse({"error": "Only PUT method is allowed."}, status=405)


# --------------DELETE UNIT -------------


from .models import Unit

@csrf_exempt
def delete_unit(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode('utf-8'))

            if 'id' not in data:
                return JsonResponse({"error": "ID is required."}, status=400)

            unit_id = data['id']
            unit = Unit.objects.filter(id=unit_id).first()

            if not unit:
                return JsonResponse({"error": "Unit not found."}, status=404)

            unit.delete()

            return JsonResponse({"message": f"Unit with ID {unit_id} deleted successfully."}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only DELETE method is allowed."}, status=405)


# ----------------------- CREATE PRODUCT DETAILS----------------



from .models import ProductDetails, Category, SubCategory, Brand, Unit

@csrf_exempt
def create_product(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))

            required_fields = ['category', 'sub_category', 'brand' ,'unit' ,'product_code','bar_qr_code','description']
            missing_fields = [field for field in required_fields if field not in data]

            if missing_fields:
                return JsonResponse({"error": f"Missing fields: {', '.join(missing_fields)}"}, status=400)

            category = Category.objects.get(category_name=data['category'])  
            sub_category = SubCategory.objects.get(subcategory_name=data['sub_category']) 
            brand = Brand.objects.get(brand_name=data['brand'])  
            unit = Unit.objects.get(unit=data['unit'])  

            product = ProductDetails.objects.create(
                product_name=data['product_name'],
                category=category,
                sub_category=sub_category,
                brand=brand,
                unit=unit,
                product_code=data['product_code'],
                bar_qr_code=data.get('bar_qr_code', ''),
                description=data.get('description', '')
            )

            
            product.save()

            return JsonResponse({"message": "Product details added successfully"}, status=201)

        except Category.DoesNotExist:
            return JsonResponse({"error": "Category with the given name not found"}, status=400)
        except SubCategory.DoesNotExist:
            return JsonResponse({"error": "SubCategory with the given name not found"}, status=400)
        except Brand.DoesNotExist:
            return JsonResponse({"error": "Brand with the given name not found"}, status=400)
        except Unit.DoesNotExist:
            return JsonResponse({"error": "Unit with the given name not found"}, status=400)
        except KeyError as e:
            return JsonResponse({"error": f"Missing field: {str(e)}"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# ----------------------- GET PRODUCT DETAILS----------------


from .models import ProductDetails

@csrf_exempt
def get_product(request):
    if request.method == "GET":
        try:
            data = json.loads(request.body.decode('utf-8'))
            if 'id' not in data:
                return JsonResponse({"error": "Missing 'id' in request body"}, status=400)
            product = ProductDetails.objects.get(id=data['id'])
            product_data = {
                "product_name": product.product_name,
                "category": product.category.category_name,
                "sub_category": product.sub_category.subcategory_name,
                "brand": product.brand.brand_name,
                "unit": product.unit.unit,
                "product_code": product.product_code,
                "bar_qr_code": product.bar_qr_code,
                "description": product.description,
            }
            return JsonResponse({"product_details": product_data}, status=200)
        except ProductDetails.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid HTTP method"}, status=405)

# ------------------------UPDATE PRODUCT DETAILS----------------

from .models import ProductDetails, Category, SubCategory, Brand, Unit

@csrf_exempt
def update_product(request):
    if request.method == "PUT":
        try:
            data = json.loads(request.body.decode('utf-8'))
            if 'product_name' not in data:
                return JsonResponse({"error": "Missing 'product_name' in request body"}, status=400)
            
            product = ProductDetails.objects.get(product_name=data['product_name'])  
            print(product)

            
            category_id = Category.objects.get(category_name=data['category_name']).id if 'category_name' in data else product.category_id
            sub_category_id = SubCategory.objects.get(subcategory_name=data['sub_category_name']).id if 'sub_category_name' in data else product.sub_category_id
            brand_id = Brand.objects.get(brand_name=data['brand_name']).id if 'brand_name' in data else product.brand_id
            unit_id = Unit.objects.get(unit=data['unit_name']).id if 'unit_name' in data else product.unit_id
            
            product.category_id = category_id
            product.sub_category_id = sub_category_id
            product.brand_id = brand_id
            product.unit_id = unit_id
            product.product_code = data.get('product_code', product.product_code)
            product.bar_qr_code = data.get('bar_qr_code', product.bar_qr_code)
            product.description = data.get('description', product.description)
            
            product.save()
            return JsonResponse({"message": "Product details updated successfully"}, status=200)
        except ProductDetails.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except (Category.DoesNotExist, SubCategory.DoesNotExist, Brand.DoesNotExist, Unit.DoesNotExist) as e:
            return JsonResponse({"error": f"{e.__class__.__name__} not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid HTTP method"}, status=405)


# ----------------------- CREATE PRODUCT DETAILS--------------

@csrf_exempt
def delete_product(request):
    if request.method == "DELETE":
        try:
            data = json.loads(request.body.decode('utf-8'))
            if 'id' not in data:
                return JsonResponse({"error": "Missing 'id' in request body"}, status=400)
            product = ProductDetails.objects.get(id=data['id'])
            product.delete()
            return JsonResponse({"message": "Product details deleted successfully"}, status=200)
        except ProductDetails.DoesNotExist:
            return JsonResponse({"error": "Product not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid HTTP method"}, status=405)



# ----------------------- CREATE PRICE DETAILS----------------


from .models import PriceDetails, ProductDetails

@csrf_exempt
def create_price_details(request):
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

            if not all([product_id, purchase_price, sale_price, min_sale_price, mrp, discount, hsn_sac_code]):
                return JsonResponse({'error': 'All fields are required.'}, status=400)

            try:
                product = ProductDetails.objects.get(id=product_id)

                price_details = PriceDetails(
                    product=product,
                    purchase_price=purchase_price,
                    sale_price=sale_price,
                    min_sale_price=min_sale_price,
                    mrp=mrp,
                    discount=discount,
                    hsn_sac_code=hsn_sac_code
                )
                price_details.save()

                return JsonResponse({'message': 'Price details created successfully.'}, status=201)

            except ProductDetails.DoesNotExist:
                return JsonResponse({'error': 'Product not found.'}, status=404)

        except ValueError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    return JsonResponse({'error': 'Invalid method. Please use POST.'}, status=405)


# ---------------------CREATE GST DEATILS WITH CALCULATION----------------------------
from .models import PriceDetails, GSTDetails, ProductDetails

@csrf_exempt
def create_gst_details(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            product_id = data.get('product_id')
            cess_percentage = data.get('cess_percentage', 0.00)
            cgst_percentage = data.get('cgst_percentage', 0.00)
            sgst_percentage = data.get('sgst_percentage', 0.00)
            igst_percentage = data.get('igst_percentage', 0.00)

            if not product_id:
                return JsonResponse({'error': 'Product ID is required.'}, status=400)

            try:
                product = ProductDetails.objects.get(id=product_id)
                price_details = PriceDetails.objects.get(product=product)

                sale_price = price_details.sale_price
                discount = price_details.discount

                cess_value = (cess_percentage / 100) * sale_price
                cgst_value = (cgst_percentage / 100) * sale_price
                sgst_value = (sgst_percentage / 100) * sale_price
                igst_value = (igst_percentage / 100) * sale_price

                total_amount = sale_price - discount + cess_value + cgst_value + sgst_value + igst_value

                gst_details = GSTDetails(
                    product=product,
                    cess_percentage=cess_percentage,
                    cgst_percentage=cgst_percentage,
                    sgst_percentage=sgst_percentage,
                    igst_percentage=igst_percentage,
                    cess_value=cess_value,
                    cgst_value=cgst_value,
                    sgst_value=sgst_value,
                    igst_value=igst_value,
                    total_amount=total_amount
                )
                gst_details.save()

                return JsonResponse({'message': 'GST details created successfully.'}, status=201)

            except ProductDetails.DoesNotExist:
                return JsonResponse({'error': 'Product not found.'}, status=404)

            except PriceDetails.DoesNotExist:
                return JsonResponse({'error': 'Price details for the product not found.'}, status=404)

        except ValueError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    return JsonResponse({'error': 'Invalid method. Please use POST.'}, status=405)
