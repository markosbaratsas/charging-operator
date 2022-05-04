from django.urls import path

import stations.views as views

urlpatterns = [
    path('stations', views.get_stations, name="get_stations"),
    path('stations/parking-costs', views.get_parking_costs,
                                            name="get_parking_costs"),
    path('stations/parking-cost/set_default', views.set_parking_cost,
                                            name="set_parking_cost"),
    path('stations/markers', views.get_station_markers,
                                            name="get_station_markers"),
    path('stations/add-station', views.add_station, name="add_station"),
    path('stations/create-station', views.create_station,
                                            name="create_station"),
    path('stations/get-station', views.get_station, name="get_station"),
]
