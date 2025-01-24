from django.urls import path
# from .views import CompanyViewSet
from Details.views import  RegisterUser,CompanyViewSet,CompanyManagementView,BranchView,BranchManagementView,CurrencySettingPostView,CurrencySettingView,VerifyOTPView,LoginView,SalesPartyCreateView,SalesPartyManagementView,AccountingVoucherCreateView,AccountingVoucherManagementView,PurchasePartyViewSet,PurchaseLedgerView,SalesLedgerView,PurchaseVoucherCreateView,PurchaseVoucherView,PaymentView,PaymentcreateView


urlpatterns = [


    path('register/', RegisterUser.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),

    path('create/company/', CompanyViewSet.as_view(), name='create_company'), 
    path('companies/', CompanyManagementView.as_view(), name='get_all_companies'),
    path('companies/<uuid:company_id>/', CompanyManagementView.as_view(), name='get_company'),

    path('create/salesparty/', SalesPartyCreateView.as_view(), name='SalesPartyCreateView'),
    path('salesparty/', SalesPartyManagementView.as_view(), name='salesparty-list'), 
    path('salesparty/<int:pk>/', SalesPartyManagementView.as_view(), name='salesparty-detail'),  


    path('create/accounting/', AccountingVoucherCreateView.as_view(), name='accounting_voucher_create'),
    path('accountingvouchers/<int:pk>/', AccountingVoucherManagementView.as_view(), name='accounting_voucher_detail'),
    path('accountingvouchers/', AccountingVoucherManagementView.as_view(), name='accounting_voucher_list'),


    path('create/purchase-party/', PurchasePartyViewSet.as_view(), name='purchase_party'),
    path('purchase-party/', PurchasePartyViewSet.as_view(), name='purchase_party_list'), 
    path('purchase-party/<uuid:pk>/', PurchasePartyViewSet.as_view(), name='purchase_party_detail'),


    path('create/purchase-ledger/', PurchaseLedgerView.as_view(), name='purchase_ledger_create'), 
    path('purchase-ledger/', PurchaseLedgerView.as_view(), name='purchase_ledger_list'),  
    path('purchase-ledger/<uuid:purchase_ledger_id>/', PurchaseLedgerView.as_view(), name='purchase_ledger_detail'),   

    path('create/salesledger/', SalesLedgerView.as_view(), name='sales_ledger'),
    path('sales-ledger/', SalesLedgerView.as_view(), name='sales_ledger_list'),  
    path('sales-ledger/<uuid:SalesLedger_id>/', SalesLedgerView.as_view(), name='sales_ledger_detail'), 

    path('create/purchase_voucher/', PurchaseVoucherCreateView.as_view(), name='purchase_voucher_create'),  
    path('purchase_voucher/', PurchaseVoucherView.as_view(), name='purchase_voucher_create'),  
    path('purchase_voucher/<int:purchase_no>/', PurchaseVoucherView.as_view(), name='purchase_voucher_detail'),  

    path('create/payment/', PaymentcreateView.as_view(), name='create_payment'),
    path('payment/', PaymentView.as_view(), name='get_all_payments'),  # For GET all payments
    path('payment/<int:payment_number>/', PaymentView.as_view(), name='payment_detail'),  # For GET, PUT, DELETE specific payment









    # path('create/companies/', CreateCompanyView.as_view(), name='create_company'),

    path('create/branch/',  BranchView.as_view(), name='RegisterView'),
    path('branches/', BranchManagementView.as_view(), name='get_all_branches'),
    path('branches/<uuid:branch_id>/', BranchManagementView.as_view(), name='get_or_update_delete_branch'),

    
    path('create/currency/', CurrencySettingPostView.as_view(), name='currency-create'),
    path('currencies/', CurrencySettingView.as_view(), name='currency-list'),
    path('currencies/<uuid:currency_id>/', CurrencySettingView.as_view(), name='currency-detail'),





]


