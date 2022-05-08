from django.urls import path

import stats.views as views

urlpatterns = [
    path('statistics/reservations', views.get_reservations,
                                            name="get_reservations"),
]
