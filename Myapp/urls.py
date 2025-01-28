# # In your app's urls.py file
from django.urls import path
from . import views

urlpatterns = [


    path('create_gst/', views.create_gst, name='create_gst'),
    path('get_gst/', views.get_gst, name='get_gst'),
    path('update_gst/', views.update_gst, name='update_gst'),
    path('delete_gst/', views.delete_gst, name='delete_gst'),

    # path('create_stock_group/', views.create_stock_group, name='create_stock_group'),
    # path('get_stock_group_details/', views.get_stock_group_details, name='get_stock_group_details'),
    # path('update_stock_group/', views.update_stock_group, name='update_stock_group'),
    # path('delete_stock_group/', views.delete_stock_group, name='delete_stock_group'),

# stock category:
    
#     path('create_stock_category/', views.create_stock_category, name='create_stock_category'),
#     # path('get_group_categories_details/', views.get_group_categories_details, name='get_group_categories_details'),
#     path('update_stock_categor/', views.update_stock_category, name='update_stock_category'),
#     path('delete_stock_category/', views.delete_stock_category, name='delete_stock_category'),


# # unit creation:
#     path('create_unit_creation/', views.create_unit_creation, name='create_unit_creation'),
#     path('get_unit_creation/', views.get_unit_creation, name='get_unit_creation'),
#     path('update_unit_creation/', views.update_unit_creation, name='update_unit_creation'),
#     path('delete_unit_creation/', views.delete_unit_creation, name='delete_unit_creation'),

# stock items:
#     path('create_stock_item/', views.create_stock_item, name='create_stock_item'),
#     path('get_stock_item_details/', views.get_stock_item_details, name='get_stock_item_details'),
#     path('update_stock_item/', views.update_stock_item, name='update_stock_item'),
#     path('delete_stock_item/', views.delete_stock_item, name='delete_stock_item'),


# #others
#     path('get_stock_group_and_categories/', views.get_stock_group_and_categories, name='get_stock_group_and_categories'),
#     path('delete_stock_group_and_category/', views.delete_stock_group_and_category, name='delete_stock_group_and_category'),

#     path('get_stock_category_and_items/', views.get_stock_category_and_items, name='get_stock_category_and_items'),
#     path('delete_stock_category_and_items/', views.delete_stock_category_and_items, name='delete_stock_category_and_items'),
    

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

# productadd

    # path('calculate-gst/', views.calculate_gst_view, name='calculate-gst'),
    # path('store-gst-details/', views.store_gst_details_view, name='store-gst-details'), 

# ----------------------------------------------

# CATEGORY
    path('create_category/', views.create_category, name='create_category'), 
    path('get_category/', views.get_category, name='get_category'), 
    path('update_category/', views.update_category, name='update_category'), 
    path('delete_category/', views.delete_category, name='delete_category'),
    path('get_category_and_subcategory/', views.get_category_and_subcategory, name='get_category_and_subcategory'),
    path('delete_category_and_subcategory/', views.delete_category_and_subcategory, name='delete_category_and_subcategory'),

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


    path('create_price_details/', views.create_price_details, name='create_price_details'),

    path('create_gst_details/', views.create_gst_details, name='create_gst_details'), 


    
]
