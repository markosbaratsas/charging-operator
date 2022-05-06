from django.urls import path

import gridprice.views as views

urlpatterns = [
    path('gridprice/get', views.get_grid_prices, name="get_grid_prices"),
    path('gridprice/get-recent-prices', views.get_recent_prices,
                                        name="get_recent_prices"),
    path('gridprice/locations', views.get_locations, name="get_locations"),
]
