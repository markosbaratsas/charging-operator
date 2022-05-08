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
    path('chargers/pricing-group/create', views.create_pricing_group,
                            name="create_pricing_group"),
    path('chargers/pricing-group/update', views.update_pricing_group,
                            name="update_pricing_group"),
    path('chargers/pricing-group/delete', views.delete_pricing_group,
                            name="delete_pricing_group"),
    path('chargers/create', views.create_charger, name="create_charger"),
    path('chargers/update', views.update_charger, name="update_charger"),
    path('chargers/delete', views.delete_charger, name="delete_charger"),
    path('chargers/get-not-healthy', views.get_not_healthy_chargers,
                            name="get_not_healthy_chargers"),
    path('chargers/not-healthy', views.set_not_healthy, name="set_not_healthy"),
    path('chargers/healthy', views.set_healthy, name="set_healthy"),
]
