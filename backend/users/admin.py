from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin

from users.forms import MyUserCreationForm, MyUserChangeForm
from users.models import MyUser

class MyUserAdmin(UserAdmin):
    add_form = MyUserCreationForm
    form = MyUserChangeForm
    model = MyUser
    list_display = ['username', 'is_operator', 'is_owner']
    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('is_operator', 'is_owner')}),
    ) #this will allow to change these fields in admin module


admin.site.register(MyUser, MyUserAdmin)
