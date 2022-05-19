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
    path('reservations/model/get-manufacturers', views.get_manufacturers,
                                    name="get_manufacturers"),
    path('reservations/model/get-models', views.get_models,
                                    name="get_models"),
    path('reservations/vehicles/create', views.create_vehicle,
                                    name="create_vehicle"),
    path('reservations/vehicles/delete', views.delete_vehicle,
                                    name="delete_vehicle"),
    path('reservations/owner-create-reservation',
                                    views.owner_create_reservation,
                                    name="owner_create_reservation"),
    path('reservations/owner', views.get_owner,
                                    name="get_owner"),
    path('reservations/vehicles', views.get_vehicles,
                                    name="get_vehicles"),
    path('reservations/owner/edit', views.edit_owner,
                                    name="edit_owner"),
    path('reservations/owner-reservations', views.owner_reservations,
                                    name="owner_reservations"),
]
