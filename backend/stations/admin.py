from django.contrib import admin

from .models import *

admin.site.register(Station)
admin.site.register(ParkingCostSnapshot)
admin.site.register(ParkingCost)
