from django.contrib import admin

from .models import *

admin.site.register(Owner)
admin.site.register(Model)
admin.site.register(Vehicle)
admin.site.register(VehicleState)
admin.site.register(Reservation)
