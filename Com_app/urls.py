from django.urls import path
from .views import RegisterUser, VerifyOTP,LoginView,CompanyCreateAPIView,CompanyManagementView,SalesPartyCreateView,SalesPartyManagementView,PurchaseLedgercreateView,PurchaseLedgerView,AccountingVoucherCreateView,AccountingVoucherManagementView,PurchasePartycreateViewSet,PurchasePartyViewSet,SalesLedgerCreateView,SalesLedgerView,PurchaseVoucherCreateView,PurchaseVoucherView,PaymentcreateView,PaymentView

urlpatterns = [
    
    path('register/', RegisterUser.as_view(), name='register_user'),
    path('verify-otp/', VerifyOTP.as_view(), name='verify_otp'),
    path('login/', LoginView.as_view(), name='login'),

    path('create/company/', CompanyCreateAPIView.as_view(), name='create_company'), 
    path('companies/', CompanyManagementView.as_view(), name='get_all_companies'),
    path('companies/<uuid:company_id>/', CompanyManagementView.as_view(), name='get_company'),

    path('create/salesparty/', SalesPartyCreateView.as_view(), name='create_salesparty'),
    path('salesparty/', SalesPartyManagementView.as_view(), name='salesparty-list'), 
    path('salesparty/<int:pk>/', SalesPartyManagementView.as_view(), name='salesparty-detail'),  

    path('create/accounting/', AccountingVoucherCreateView.as_view(), name='accounting_voucher_create'),
    path('accountingvouchers/<int:pk>/', AccountingVoucherManagementView.as_view(), name='accounting_voucher_detail'),
    path('accountingvouchers/', AccountingVoucherManagementView.as_view(), name='accounting_voucher_list'),

    path('create/purchase-party/', PurchasePartycreateViewSet.as_view(), name='purchase_party'),
    path('purchase-party/', PurchasePartyViewSet.as_view(), name='purchase_party_list'), 
    path('purchase-party/<uuid:pk>/', PurchasePartyViewSet.as_view(), name='purchase_party_detail'),


    path('create/purchase-ledger/', PurchaseLedgercreateView.as_view(), name='purchase_ledger_create'), 
    path('purchase-ledger/', PurchaseLedgerView.as_view(), name='purchase_ledger_list'),  
    path('purchase-ledger/<uuid:purchase_ledger_id>/', PurchaseLedgerView.as_view(), name='purchase_ledger_detail'),  

    path('create/salesledger/', SalesLedgerCreateView.as_view(), name='sales_ledger'),
    path('sales-ledger/', SalesLedgerView.as_view(), name='sales_ledger_list'),  
    path('sales-ledger/<uuid:SalesLedger_id>/', SalesLedgerView.as_view(), name='sales_ledger_detail'),  


    path('create/purchase_voucher/', PurchaseVoucherCreateView.as_view(), name='purchase_voucher_create'),  
    path('purchase_voucher/', PurchaseVoucherView.as_view(), name='purchase_voucher_create'),  
    path('purchase_voucher/<uuid:purchase_id>/', PurchaseVoucherView.as_view(), name='purchase_voucher'),

    path('create/payment/', PaymentcreateView.as_view(), name='create_payment'),
    path('payment/', PaymentView.as_view(), name='get_all_payments'),  
    path('payment/<int:payment_number>/', PaymentView.as_view(), name='payment_detail'),  # For GET, PUT, DELETE specific payment





]
