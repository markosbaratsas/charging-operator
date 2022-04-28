from django.urls import path

import chargers.views as views

urlpatterns = [
    path('chargers/pricing-groups', views.get_pricing_groups, name="get_pricing_groups"),
    path('chargers/pricing-groups/prices', views.get_pricing_groups_prices,
                                                name="get_pricing_groups_prices"),
]
