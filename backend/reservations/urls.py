from django.urls import path

import reservations.views as views

urlpatterns = [
    path('reservations/vehicle-states', views.get_vehicle_states,
                                    name="get_vehicle_states"),
    path('reservations/vehicle-state/get', views.get_vehicle_state,
                                    name="get_vehicle_state"),
    path('reservations', views.get_reservations, name="get_reservations"),
    path('reservations/available-chargers', views.get_available_chargers,
                                    name="get_available_chargers"),
    path('reservations/create', views.create_reservation,
                                    name="create_reservation"),
    path('reservations/update', views.update_reservation,
                                    name="update_reservation"),
    path('reservations/delete', views.delete_reservation,
                                    name="delete_reservation"),
    path('reservations/cancel', views.cancel_reservation,
                                    name="cancel_reservation"),
    path('reservations/vehicle-state/create', views.vehicle_state,
                                    name="vehicle_state"),
    path('reservations/end-reservation', views.end_reservation,
                                    name="end_reservation"),
]
