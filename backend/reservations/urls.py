from django.urls import path

import reservations.views as views

urlpatterns = [
    path('reservations/vehicle-states', views.get_vehicle_states, name="get_vehicle_states"),
    path('reservations', views.get_reservations, name="get_reservations"),
]
