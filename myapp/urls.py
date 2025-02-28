# # In your app's urls.py file
from django.urls import path
from . import views

urlpatterns = [

# gst details:
    path('create_gst/', views.create_gst, name='create_gst'),
    path('get_gst/', views.get_gst, name='get_gst'),
    path('update_gst/', views.update_gst, name='update_gst'),
    path('delete_gst/', views.delete_gst, name='delete_gst'),   

#tax details:
    path('stock_group_tax_details/', views.stock_group_tax_details, name='stock_group_tax_details'),
    path('get_stock_group_tax_details/', views.get_stock_group_tax_details, name='get_stock_group_tax_details'),
    path('update_stock_group_tax_details/', views.update_stock_group_tax_details, name='update_stock_group_tax_details'),
    path('delete_stock_group_tax_details/', views.delete_stock_group_tax_details, name='delete_stock_group_tax_details'),

# E-way bill 

    path('create_ewaybill/', views.create_ewaybill, name='create_ewaybill'),
    path('get_ewaybill/', views.get_ewaybill, name='get_ewaybill'),
    path('update_ewaybill/', views.update_ewaybill, name='update_ewaybill'),
    path('delete_ewaybill/', views.delete_ewaybill, name='delete_ewaybill'),
# e-invoice
    path('create_einvoice/', views.create_einvoice, name='create_einvoice'),
    path('get_einvoice/', views.get_einvoice, name='get_einvoice'),
    path('update_einvoice/', views.update_einvoice, name='update_einvoice'),
    path('delete_einvoice/', views.delete_einvoice, name='delete_einvoice'),

# GSTR1
    path('create_gstr1/', views.create_gstr1, name='create_gstr1'), 
    path('get_gstr1/', views.get_gstr1, name='get_gstr1'), 
    path('update_gstr1/', views.update_gstr1, name='update_gstr1'), 
    path('delete_gstr1/', views.delete_gstr1, name='delete_gstr1'), 
# GSTR2
    path('create_gstr2/', views.create_gstr2, name='create_gstr2'), 
    path('get_gstr2/', views.get_gstr2, name='get_gstr2'), 
    path('update_gstr2/', views.update_gstr2, name='update_gstr2'), 
    path('delete_gstr2/', views.delete_gstr2, name='delete_gstr2'), 

# CATEGORY
    path('create_category/', views.create_category, name='create_category'), 
    path('get_category/', views.get_category, name='get_category'), 
    path('update_category/', views.update_category, name='update_category'), 
    path('delete_category/', views.delete_category, name='delete_category'),
 

# SUBCATEGORY
    path('create_subcategory/', views.create_subcategory, name='create_subcategory'), 
    path('get_subcategory/', views.get_subcategory, name='get_subcategory'), 
    path('update_subcategory/', views.update_subcategory, name='update_subcategory'), 
    path('delete_subcategory/', views.delete_subcategory, name='delete_subcategory'),
# BRAND
    path('create_brand/', views.create_brand, name='create_brand'), 
    path('get_brand/', views.get_brand, name='get_brand'), 
    path('update_brand/', views.update_brand, name='update_brand'), 
    path('delete_brand/', views.delete_brand, name='delete_brand'),
# UNIT
    path('create_unit/', views.create_unit, name='create_unit'), 
    path('get_unit/', views.get_unit, name='get_unit'), 
    path('update_unit/', views.update_unit, name='update_unit'), 
    path('delete_unit/', views.delete_unit, name='delete_unit'),
# PRODUCT
    path('create_product/', views.create_product, name='create_product'), 
    path('get_product/', views.get_product, name='get_product'), 
    path('update_product/', views.update_product, name='update_product'), 
    path('delete_product/', views.delete_product, name='delete_product'), 
# PRICE DETAILS
    path('create_price_details/', views.create_price_details, name='create_price_details'),
    path('get_price_details/', views.get_price_details, name='get_price_details'),
    path('update_price_details/', views.update_price_details, name='update_price_details'),
    path('delete_price_details/', views.delete_price_details, name='delete_price_details'),
# GST DETAILS 
    path('calculate_tax_and_total/', views.calculate_tax_and_total, name='calculate_tax_and_total'), 
    path('create_price_gst_details/', views.create_price_gst_details, name='create_price_gst_details'), 
    path('get_price_gst_details/', views.get_price_gst_details, name='get_price_gst_details'), 
    path('update_price_gst_details/', views.update_price_gst_details, name='update_price_gst_details'), 
    path('delete_price_gst_details/', views.delete_price_gst_details, name='delete_price_gst_details'), 
    
# STOCK DETAILS
    path('create_stock_details/', views.create_stock_details, name='create_stock_details'), 
    path('get_stock_details/', views.get_stock_details, name='get_stock_details'), 
    path('update_stock_details/', views.update_stock_details, name='update_stock_details'), 
    path('delete_stock_details/', views.delete_stock_details, name='delete_stock_details'), 


# EMPLOYEE 
    path('add_employee/', views.add_employee, name='add_employee'), 
    path('get_employee/', views.get_employee, name='get_employee'), 
    path('update_employee/', views.update_employee, name='update_employee'), 
    path('delete_employee/', views.delete_employee, name='delete_employee'), 
    
# REPORT  
    path('customer_product_report/', views.customer_product_report, name='customer_product_report'), 
   
# ADMIN 
    path('create_admin/', views.create_admin, name='create_admin'), 
    path('get_admin_details/', views.get_admin_details, name='get_admin_details'), 
    path('update_admin_details/', views.update_admin_details, name='update_admin_details'), 
    path('delete_admin_details/', views.delete_admin_details, name='delete_admin_details'), 

# SUBSCRIPTION 
    path('create_subscription_plan/', views.create_subscription_plan, name='create_subscription_plan'), 
    path('get_subscription_plan/', views.get_subscription_plan, name='get_subscription_plan'), 
    path('update_subscription_plan/', views.update_subscription_plan, name='update_subscription_plan'), 
    path('delete_subscription_plan/', views.delete_subscription_plan, name='delete_subscription_plan'), 

# LISENCE
    path('store_license_details/', views.store_license_details, name='store_license_details'), 
    path('get_license_details/', views.get_license_details, name='get_license_details'), 
    path('update_license_details/', views.update_license_details, name='update_license_details'), 
    path('delete_license_details/', views.delete_license_details, name='delete_license_details'), 


# PAYMENT:
    # path('payment/', views.payment_view, name='payment-create'),  # For POST requests to create payments
    # path('payment/<str:transaction_id>/', views.payment_view, name='payment-read-update-delete'),  # For GET, PUT, DELETE on specific transaction
    
    # path('create_payment/', views.create_payment_order, name='create_payment_order'),
    path('create_payment_order/', views.create_payment_order, name='create_payment_order'),
    path('get_payment_details/<str:order_id>/', views.get_payment_details, name='get_payment_details'),
    path('razorpay_webhook/', views.razorpay_webhook, name='razorpay_webhook'),
    # path('razorpay_webhook/', views.razorpay_webhook, name='razorpay_webhook'),

#    NOTIFICATION
    # path('send_expiry_notifications/', views.send_expiry_notifications, name='send_expiry_notifications'),


# SUPPLIER : 

     path('create_supplier/', views.create_supplier, name = 'create_supplier'),
     path('get_supplier/',views.get_supplier,name ='get_supplier'),
     path('update_supplier/',views.update_supplier,name ='update_supplier'),
     path('delete_supplier/',views.delete_supplier,name ='delete_supplier'),

# CUSTOMER : 
     path('create_customer/',views.create_customer,name ='create_customer'),
     path('get_customer/',views.get_customer,name ='get_customer'),
     path('update_customer/',views.update_customer,name ='update_customer'),
     path('delete_customer/',views.delete_customer,name ='delete_customer'),



# login

    path('login/', views.login_user, name='login'),
    path('notify/', views.notify_verification, name='notify'),


]

