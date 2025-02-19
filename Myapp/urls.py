from django.urls import path
from Myapp import views

urlpatterns = [
    path('GST/add', views.addGst, name='addGst'),
    path('GST/get', views.GstGet, name='GstGet'),
    path('GST/update',views.update_gst, name='update_gst'),
    path('GST/delete', views.delete_gst, name='delete_gst'),
    
    path('category/add', views.add_StockCategory, name='add_StockCategory'),
    path('category/get', views.get_StockCategory, name='getStockCategory'),
    path('category/update', views.update_StockCategory, name='update_StockCategory'),
    path('category/delete', views.delete_StockCategory, name='delete_StockCategory'),
    
    path('stock/detail/add', views.add_StockDetails, name='add_StockDetails'),
    path('stock/detail/get', views.get_stockDetails, name='get_stockDetails'),
    path('stock/detail/update', views.update_stockDetails, name='update_stockDetails'),
    path('stock/detail/delete', views.delete_stockDetails, name='delete_stockDetails'),
    
    path('subcategory/add', views.add_StocksubCategory, name='addStockCategory'),
    path('subcategory/get', views.get_StocksubCategory, name='get_StocksubCategory'),
    path('subcategory/update', views.update_StocksubCategory, name='update_StocksubCategory'),
    path('subcategory/delete', views.delete_subcategory, name='delete_subcategory'),
    
    path('unit/add', views.add_unit_creation, name='add_unit_creation'),
    path('unit/get', views.get_unit, name='get_unit'),
    path('unit/update', views.update_unit, name='update_unit'),
    path('unit/delete', views. delete_unit, name=' delete_unit'),
    
    path('productdetails/get/all', views.get_product_all, name=' get_product_all'),
    
    path('productdetails/add', views.add_product_details, name=' add_product'),
    path('productdetails/get', views.get_product, name=' get_product'),
    path('productdetails/update', views.update_product, name=' update_product'),
    path('productdetails/delete', views.delete_product, name=' delete_product'),
    
    path('gst/details/add', views.add_priceGStDetails, name=' add_priceGstDetails'),
    path('gst/details/get', views.get_priceGstDetails, name=' get_priceGstDetails'),
    path('gst/details/update', views.update_priceGstDetails, name='update_priceGstDetails'),
    path('gst/details/delete', views.delete_priceGstDetails, name=' delete_priceGstDetails'),
    
    path('calculation', views.price_calculation, name=' price_calculation'),
    
    path('pricedetails/add', views.add_priceDetails, name=' add_priceDetails'),
    path('pricedetails/get', views.get_priceDetails, name=' get_priceDetails'),
    path('pricedetails/update', views.update_priceDetails, name='update_priceDetails'),
    path('pricedetails/delete', views.delete_priceDetails, name=' delete_priceDetails'),
    
    path('other_details/add', views.add_other_details, name=' add_other_details'),
    path('other_details/get', views.get_other_details, name=' get_other_details'),
    path('other_details/update', views.update_other_details, name='update_other_details'),
    path('other_details/delete', views.delete_other_details, name='delete_other_details'),
    
    path('productsetting/add', views.add_product_settings, name='add_product_settings'),
    path('productsetting/get', views.get_product_settings, name='get_product_settings'),
    path('productsetting/update', views.update_product_settings, name='update_product_settings'),
    path('productsetting/delete', views.delete_product_settings, name='delete_product_settings'),
    
    path('brand/api/add', views.add_brand, name='add_brand'),
    path('brand/api/get', views.get_brand, name='get_brand'),
    path('brand/api/update', views.update_brand, name='update_brand'),
    path('brand/api/delete', views.delete_brand, name='delete_brand'),
    
    # path('gstr1/add', views.add_gstr1, name='add_gstr1'),
    
    path('einvoice/add', views.add_e_invoice_details, name='add_e_invoice_details'),
    path('einvoice/get', views.get_e_invoice, name='get_e_invoice'),
    path('einvoice/update', views.update_e_invoice, name='update_e_invoice'),
    path('einvoice/delete', views.delete_e_invoice, name='delete_e_invoice'),
    
    path('ewaybill/add', views.add_e_way_bill, name='add_e_way_bill'),
    path('ewaybill/get', views.get_e_way_bill, name='get_e_way_bill'),
    path('ewaybill/update', views.update_e_way_bill, name='update_e_way_bill'),
    path('ewaybill/delete', views.delete_e_way_bill, name='delete_e_way_bill'),
    
    path('employes/details/add', views.add_employee_details, name='add_employee_details'),
    path('employes/details/get', views.get_employee, name='get_employee'),
    path('employes/details/update', views.update_employee, name='update_employee'),
    path('employes/details/delete', views.delete_employee, name='delete_employee'),
    
    path('report/details/get', views.get_report_details, name='get_report_details'),
    
    path('admin/add', views.add_admin, name='add_admin'),
    path('admin/get', views.get_admin, name='get_admin'),
    path('admin/update', views.update_admin, name='update_admin'),
    path('admin/delete', views.delete_admin, name='delete_admin'),
    
    path('SubscriptionPlan/add', views.add_subscription_plan, name='add_subscription_plan'),
    path('SubscriptionPlan/get', views.get_subscription_plan, name='get_subscription_plan'),
    path('SubscriptionPlan/update', views.update_subscription_plan, name='update_subscription_plan'),
    path('SubscriptionPlan/delete', views.delete_subscription_plan, name='delete_subscription_plan'),
    
    path('license/add', views.add_license, name='add_license'),
    path('license/get', views.get_license, name='get_license'),
    path('license/update', views.update_license, name='update_license'),
    path('license/delete', views.delete_license, name='delete_license'),
    
    path('notification/add', views.create_notification, name='create_notification'),
    path('notification/get', views.get_notification, name='get_notification'),
    path('notification/update', views.update_notification, name='update_notification'),
    path('notification/delete', views.delete_notification, name='delete_notification'),
    
    # path('payment/add',views.create_payment, name='create_payment'),
    # path('razorpay-webhook/',views.razorpay_webhook, name='razorpay_webhook'),
    path('razorpay-webhook/',views.razorpay_webhook, name='razorpay_webhook'),
    
    path('customer/add', views.Customer_add, name='Customer_add'),
    path('customer/get', views.Customer_get, name='Customer_get'),
    path('customer/update', views.customer_update, name='customer_update'),
    path('customer/delete', views.Customer_delete, name='Customer_delete'),
    
    path('supplier/add', views.Supplier_add, name='Supplier_add'),
    path('supplier/get', views.Supplier_get, name='Supplier_add'),
    path('supplier/update', views.supplier_update, name='supplier_update'),
    path('supplier/delete', views.supplier_delete, name='supplier_delete'),
]
