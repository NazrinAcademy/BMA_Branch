from django.urls import path
from Myapp import views

urlpatterns = [
    path('Mathavan/GST/add', views.addGst, name='addGst'),
    path('Mathavan/GST/get', views.GstGet, name='GstGet'),
    path('Mathavan/GST/update',views.update_gst, name='update_gst'),
    path('Mathavan/GST/delete', views.delete_gst, name='delete_gst'),
    
    path('Mathavan/category/add', views.add_StockCategory, name='add_StockCategory'),
    path('Mathavan/category/get', views.get_StockCategory, name='getStockCategory'),
    path('Mathavan/category/update', views.update_StockCategory, name='update_StockCategory'),
    path('Mathavan/category/delete', views.delete_StockCategory, name='delete_StockCategory'),
    
    path('Mathavan/category/get/all', views.category_get_all, name='getStockCategory'),
    
    path('Mathavan/stock/detail/add', views.add_StockDetails, name='add_StockDetails'),
    path('Mathavan/stock/detail/get', views.get_stockDetails, name='get_stockDetails'),
    path('Mathavan/stock/detail/update', views.update_stockDetails, name='update_stockDetails'),
    path('Mathavan/stock/detail/delete', views.delete_stockDetails, name='delete_stockDetails'),
    
    path('Mathavan/stock/detail/get/all', views.stock_details_all, name='get_stockDetails'),
    
    path('Mathavan/subcategory/add', views.add_StocksubCategory, name='addStockCategory'),
    path('Mathavan/subcategory/get', views.get_StocksubCategory, name='get_StocksubCategory'),
    path('Mathavan/subcategory/update', views.update_StocksubCategory, name='update_StocksubCategory'),
    path('Mathavan/subcategory/delete', views.delete_subcategory, name='delete_subcategory'),
    
    path('Mathavan/subcategory/get/all', views.subCategory_all, name='get_StocksubCategory'),
    
    path('Mathavan/unit/add', views.add_unit_creation, name='add_unit_creation'),
    path('Mathavan/unit/get', views.get_unit, name='get_unit'),
    path('Mathavan/unit/update', views.update_unit, name='update_unit'),
    path('Mathavan/unit/delete', views. delete_unit, name=' delete_unit'),
    
    path('Mathavan/unit/get/all', views.all_unit, name='get_unit'),
    
    path('Mathavan/productdetails/add', views.add_product_details, name=' add_product'),
    path('Mathavan/productdetails/get', views.get_product, name=' get_product'),
    path('Mathavan/productdetails/update', views.update_product, name=' update_product'),
    path('Mathavan/productdetails/delete', views.delete_product, name=' delete_product'),
    
    path('Mathavan/productdetails/get/all', views.get_product_all, name=' get_product_all'),
    
    path('Mathavan/gst/details/add', views.add_priceGStDetails, name=' add_priceGstDetails'),
    path('Mathavan/gst/details/get', views.get_priceGstDetails, name=' get_priceGstDetails'),
    path('Mathavan/gst/details/update', views.update_priceGstDetails, name='update_priceGstDetails'),
    path('Mathavan/gst/details/delete', views.delete_priceGstDetails, name=' delete_priceGstDetails'),
    
    path('Mathavan/gst/details/get/all', views.priceGstDtails_all, name=' get_priceGstDetails'),
    
    path('Mathavan/pricedetails/add', views.add_priceDetails, name=' add_priceDetails'),
    path('Mathavan/pricedetails/get', views.get_priceDetails, name=' get_priceDetails'),
    path('Mathavan/pricedetails/update', views.update_priceDetails, name='update_priceDetails'),
    path('Mathavan/pricedetails/delete', views.delete_priceDetails, name=' delete_priceDetails'),
    
    path('Mathavan/pricedetails/get/all', views.get_priceDetails_all, name=' get_priceDetails'),
    
    path('Mathavan/other_details/add', views.add_other_details, name=' add_other_details'),
    path('Mathavan/other_details/get', views.get_other_details, name=' get_other_details'),
    path('Mathavan/other_details/update', views.update_other_details, name='update_other_details'),
    path('Mathavan/other_details/delete', views.delete_other_details, name='delete_other_details'),
    
    path('Mathavan/productsetting/add', views.add_product_settings, name='add_product_settings'),
    path('Mathavan/productsetting/get', views.get_product_settings, name='get_product_settings'),
    path('Mathavan/productsetting/update', views.update_product_settings, name='update_product_settings'),
    path('Mathavan/productsetting/delete', views.delete_product_settings, name='delete_product_settings'),
    
    path('Mathavan/brand/api/add', views.add_brand, name='add_brand'),
    path('Mathavan/brand/api/get', views.get_brand, name='get_brand'),
    path('Mathavan/brand/api/update', views.update_brand, name='update_brand'),
    path('Mathavan/brand/api/delete', views.delete_brand, name='delete_brand'),
    
    path('Mathavan/brand/api/get/all', views.get_brand_all, name='get_brand'),
    
    # path('Mathavan/gstr1/add', views.add_gstr1, name='add_gstr1'),
    
    path('Mathavan/einvoice/add', views.add_e_invoice_details, name='add_e_invoice_details'),
    path('Mathavan/einvoice/get', views.get_e_invoice, name='get_e_invoice'),
    path('Mathavan/einvoice/update', views.update_e_invoice, name='update_e_invoice'),
    path('Mathavan/einvoice/delete', views.delete_e_invoice, name='delete_e_invoice'),
    
    path('Mathavan/einvoice/get/all', views.get_e_invoice_all, name='get_e_invoice_all'),
    
    path('Mathavan/ewaybill/add', views.add_e_way_bill, name='add_e_way_bill'),
    path('Mathavan/ewaybill/get', views.get_e_way_bill, name='get_e_way_bill'),
    path('Mathavan/ewaybill/update', views.update_e_way_bill, name='update_e_way_bill'),
    path('Mathavan/ewaybill/delete', views.delete_e_way_bill, name='delete_e_way_bill'),
    
    path('Mathavan/ewaybill/get/all', views.get_e_way_bill_all, name='get_e_way_bill_all'),
    
    path('Mathavan/employes/details/add', views.add_employee_details, name='add_employee_details'),
    path('Mathavan/employes/details/get', views.get_employee, name='get_employee'),
    path('Mathavan/employes/details/update', views.update_employee, name='update_employee'),
    path('Mathavan/employes/details/delete', views.delete_employee, name='delete_employee'),
    
    path('Mathavan/report/details/get', views.get_report_details, name='get_report_details'),
    
    path('Mathavan/admin/add', views.add_admin, name='add_admin'),
    path('Mathavan/admin/get', views.get_admin, name='get_admin'),
    path('Mathavan/admin/update', views.update_admin, name='update_admin'),
    path('Mathavan/admin/delete', views.delete_admin, name='delete_admin'),
    
    path('Mathavan/admin/get/all', views.get_admin_all, name='get_admin_all'),
    
    path('Mathavan/SubscriptionPlan/add', views.add_subscription_plan, name='add_subscription_plan'),
    path('Mathavan/SubscriptionPlan/get', views.get_subscription_plan, name='get_subscription_plan'),
    path('Mathavan/SubscriptionPlan/update', views.update_subscription_plan, name='update_subscription_plan'),
    path('Mathavan/SubscriptionPlan/delete', views.delete_subscription_plan, name='delete_subscription_plan'),
    
    path('Mathavan/SubscriptionPlan/get/all', views.get_subscription_plan_all, name='get_subscription_plan_all'),
    
    path('Mathavan/license/add', views.add_license, name='add_license'),
    path('Mathavan/license/get', views.get_license, name='get_license'),
    path('Mathavan/license/update', views.update_license, name='update_license'),
    path('Mathavan/license/delete', views.delete_license, name='delete_license'),
    
    path('Mathavan/license/get/all', views.get_license_all, name='get_license_all'),
    
    path('Mathavan/notification/add', views.create_notification, name='create_notification'),
    path('Mathavan/notification/get', views.get_notification, name='get_notification'),
    path('Mathavan/notification/update', views.update_notification, name='update_notification'),
    path('Mathavan/notification/delete', views.delete_notification, name='delete_notification'),
    
    path('Mathavan/notification/get/all', views.get_notification_all, name='get_notification_all'),
    
    # path('Mathavan/payment/add',views.create_payment, name='create_payment'),
    # path('Mathavan/razorpay-webhook/',views.razorpay_webhook, name='razorpay_webhook'),
    path('Mathavan/razorpay-webhook/',views.razorpay_webhook, name='razorpay_webhook'),
    
    path('Mathavan/customer/add', views.Customer_add, name='Customer_add'),
    path('Mathavan/customer/get', views.Customer_get, name='Customer_get'),
    path('Mathavan/customer/update', views.customer_update, name='customer_update'),
    path('Mathavan/customer/delete', views.Customer_delete, name='Customer_delete'),
    
    path('Mathavan/customer/get/all', views.Customer_get_all, name='Customer_get_all'),
    
    path('Mathavan/supplier/add', views.Supplier_add, name='Supplier_add'),
    path('Mathavan/supplier/get', views.Supplier_get, name='Supplier_add'),
    path('Mathavan/supplier/update', views.supplier_update, name='supplier_update'),
    path('Mathavan/supplier/delete', views.supplier_delete, name='supplier_delete'),
    
    path('Mathavan/supplier/get/all', views.Supplier_get_all, name='Supplier_add_all'),
    
    path('Mathavan/accesskey/api/add', views.add_access_key, name='add_access_key'),
    path('Mathavan/accesskey/api/get', views.accesskey_get, name='accesskey_get'),
    path('Mathavan/accesskey/api/update', views.accesskey_update, name='accesskey_update'),
    path('Mathavan/accesskey/api/delete', views.accesskey_delete, name='accesskey_delete'),
    
    path('Mathavan/accesskey/api/get/all', views.accesskey_get_all, name='accesskey_get_all'),
    
    path('Mathavan/sale/ledger/api/add', views.customer_sale_ledger_add, name='customer_sale_ledger_add'),

#another api    
    path('Mathavan/verify/api/responce', views.verify_code, name='verify_code'),

#calculations 
    path('Mathavan/calculation', views.price_calculation, name=' price_calculation'),
    path('Mathavan/customer/producet/cal', views.customer_product_calculation, name=' customer_product_calculation'),
    path('Mathavan/balance/api/calculation', views.balance_calculation, name=' balance_calculation'),
]
