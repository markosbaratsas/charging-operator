from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

import users.views as views

urlpatterns = [
    path('register', views.register_user, name="register_user"),
    path('login', obtain_auth_token, name="obtain_auth_token"),
    path('logout', views.delete_token, name="delete_token"),
]
