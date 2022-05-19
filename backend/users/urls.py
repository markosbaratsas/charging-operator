from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token

import users.views as views

urlpatterns = [
    path('register', views.register_operator, name="register_operator"),
    path('login', obtain_auth_token, name="obtain_auth_token"),
    path('logout', views.delete_token, name="delete_token"),
    path('validate-token', views.validate_token_operator,
                    name="validate_token_operator"),
    path('validate-token-owner', views.validate_token_owner,
                    name="validate_token_owner"),
]
