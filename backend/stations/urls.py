from django.urls import path

import stations.views as views

urlpatterns = [
    path('stations', views.get_stations, name="get_stations"),
]
