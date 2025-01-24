from django.contrib import admin

from django.contrib import admin
from .models import Company, Branch, CurrencySetting

# @admin.register(Company)
# class CompanyAdmin(admin.ModelAdmin):
#     list_display = ('company_name', 'default_currency', 'business_type', 'created_at')
#     search_fields = ('company_name', 'gst_number', 'pan_number')

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('branch_name', 'company', 'default_currency', 'timezone')

@admin.register(CurrencySetting)
class CurrencySettingAdmin(admin.ModelAdmin):
    list_display = ('currency_name', 'exchange_rate', 'symbol', 'decimal_places')

