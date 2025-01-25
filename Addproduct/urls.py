from django.urls import path
from . import views

urlpatterns = [
    path('create_product/', views.create_product, name='create_product'),
    path('get_product/', views.get_product, name='get_product'),
    path('update_product/', views.update_product, name='update_product'),
    path('delete_product/', views.delete_product, name='delete_product'),
    path('get_price_details_by_product/', views.get_price_details_by_product, name='get_price_details_by_product'),
    path('delete_price_details_by_product/', views.delete_price_details_by_product, name='delete_price_details_by_product'),
    
    path('create_price_details/', views.create_price_details, name='create_price_details'),
    path('get_price_details/', views.get_price_details, name='get_price_details'),
    path('update_price_details/', views.update_price_details, name='update_price_details'),
    path('delete_price_details/', views.delete_price_details, name='delete_price_details'),
    path('get_price_details_by_product/', views.get_price_details_by_product, name='get_price_details_by_product'),
    path('delete_price_details_by_product/', views.delete_price_details_by_product, name='delete_price_details_by_product'),
    
    path('create_stock_and_unit_details/', views.create_stock_and_unit_details, name='create_stock_and_unit_details'),
    path('get_stock_and_unit_details/', views.get_stock_and_unit_details, name='get_stock_and_unit_details'),
    path('update_stock_and_unit_details/', views.update_stock_and_unit_details, name='update_stock_and_unit_details'),
    path('delete_stock_and_unit_details/', views.delete_stock_and_unit_details, name='delete_stock_and_unit_details'),
    path('get_stock_and_unit_details_by_product/', views.get_stock_and_unit_details_by_product, name='get_stock_and_unit_details_by_product'),
    path('delete_stock_and_unit_details_by_product/', views.delete_stock_and_unit_details_by_product, name='delete_stock_and_unit_details_by_product'),


    path('create_other_details/', views.create_other_details, name='create_other_details'),
    path('get_other_details/', views.get_other_details, name='get_other_details'),
    path('update_other_details/', views.update_other_details, name='update_other_details'),
    path('delete_other_details/', views.delete_other_details, name='delete_other_details'),
    path('get_other_details_by_product/', views.get_other_details_by_product, name='get_other_details_by_product'),
    path('delete_other_details_by_product/', views.delete_other_details_by_product, name='delete_other_details_by_product'),

    path('delete_product_and_related_details/', views.delete_product_and_related_details, name='delete_product_and_related_details'),
    path('get_product_and_related_details/', views.get_product_and_related_details, name='get_product_and_related_details'),

]
