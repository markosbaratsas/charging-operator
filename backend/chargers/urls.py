from django.urls import path

import chargers.views as views

urlpatterns = [
    path('chargers/pricing-groups/information',
                            views.get_pricing_groups_information,
                            name="get_pricing_groups_information"),
    path('chargers/pricing-groups/prices', views.get_pricing_groups_prices,
                            name="get_pricing_groups_prices"),
    path('chargers/pricing-groups', views.get_pricing_groups,
                            name="get_pricing_groups"),
    path('chargers/pricing-group/update', views.update_pricing_group,
                            name="update_pricing_group"),
]
