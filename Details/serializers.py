from rest_framework import serializers
from .models import User, Company, Branch, CurrencySetting,Companies,SalesParty,AccountingVoucher,PurchaseParty,PurchaseLedger,SalesLedger,PurchaseVoucher,Payment




class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

        

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class SalesPartySerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesParty
        fields = "__all__"

    def validate(self, attrs):
        maintain_balances = attrs.get("maintain_balances_bill_by_bill", False)
        default_credit_period = attrs.get("default_credit_period", "")
        if default_credit_period == "":
            attrs["default_credit_period"] = None
        elif not isinstance(attrs.get("default_credit_period"), int) and attrs.get("default_credit_period") is not None:
            raise serializers.ValidationError({
                "default_credit_period": "A valid integer is required."
            })

        check_credit_days = attrs.get("check_credit_days_during_voucher_entry", "")
        if check_credit_days == "":
            attrs["check_credit_days_during_voucher_entry"] = None
        elif not isinstance(attrs.get("check_credit_days_during_voucher_entry"), bool) and attrs.get("check_credit_days_during_voucher_entry") is not None:
            raise serializers.ValidationError({
                "check_credit_days_during_voucher_entry": "Must be a valid boolean."
            })

   
        if not maintain_balances:
            attrs["default_credit_period"] = None
            attrs["check_credit_days_during_voucher_entry"] = None

        return attrs


class AccountingVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountingVoucher
        fields = '__all__'  

    def validate(self, data):
        if data['amount'] != data['quantity'] * data['rate']:
            raise serializers.ValidationError("Amount must be equal to quantity * rate.")
        return data


class PurchasePartySerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseParty
        fields = '__all__'

    # def validate(self, data):

    #     # maintain_balances = data.get('maintain_balances', False)
        # default_credit_period = data.get('default_credit_period')
        # check_credit_days = data.get('check_credit_days')

        # if maintain_balances:
        #     if default_credit_period is None:
        #         raise serializers.ValidationError({'default_credit_period': 'This field is required when maintain_balances is True.'})
        #     if check_credit_days is None:
        #         raise serializers.ValidationError({'check_credit_days': 'This field is required when maintain_balances is True.'})
        # else:
        #     if default_credit_period is not None or check_credit_days is not None:
        #         raise serializers.ValidationError({
        #             'default_credit_period': 'This field must be null when maintain_balances is False.',
        #             'check_credit_days': 'This field must be null when maintain_balances is False.'
        #         })

        # return data



class PurchaseLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseLedger
        fields = "__all__"

    def validate(self, data):
        type_of_ledger = data.get("type_of_ledger")
        if type_of_ledger == "Invoice Rounding":
            if not data.get("rounding_method"):
                raise serializers.ValidationError({
                    "rounding_method": "This field is required when type_of_ledger is 'Invoice Rounding'."
                })
            if data.get("rounding_limit") is None:
                raise serializers.ValidationError({
                    "rounding_limit": "This field is required when type_of_ledger is 'Invoice Rounding'."
                })

        else:
            if data.get("rounding_method") or data.get("rounding_limit") is not None:
                raise serializers.ValidationError({
                    "rounding_method": "This field must be null unless type_of_ledger is 'Invoice Rounding'.",
                    "rounding_limit": "This field must be null unless type_of_ledger is 'Invoice Rounding'."
                })

        return data
    

class SalesLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesLedger
        fields = '__all__'

    def validate(self, data):
        
        if data.get('type_of_salesLeger') == 'Invoice Rounding':
            if data.get('rounding_limit') is None:
                raise serializers.ValidationError({"rounding_limit": "This field is required when type_of_salesLeger is 'Invoice Rounding'."})
            if data.get('rounding_method') is None:
                raise serializers.ValidationError({"rounding_method": "This field is required when type_of_salesLeger is 'Invoice Rounding'."})
        else:
            
            data['rounding_limit'] = None
            data['rounding_method'] = None

        return data


class PurchaseVoucherSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseVoucher
        fields = [
            "purchase_no", "supplier_invoice_no", "date", "party_account_name", 
            "current_balance", "purchase_ledger", "narration", "item_name", 
            "quantity", "rate_per", "amount"
        ]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['payment_number', 'date', 'account', 'cur_balance', 'particulars', 'amount', 'narration', 'created_at', 'updated_at']
        read_only_fields = ['payment_number', 'created_at', 'updated_at']  


class CompaniesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Companies
        fields = '__all__'

    def validate(self, attrs):
        if attrs.get('lock_period_from') and attrs.get('lock_period_to'):
            if attrs['lock_period_from'] > attrs['lock_period_to']:
                raise serializers.ValidationError("Lock period start date cannot be later than the end date.")
        return attrs

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'

class CurrencySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CurrencySetting
        fields = '__all__'
