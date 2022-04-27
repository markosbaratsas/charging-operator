from django.contrib import admin

from .models import *

admin.site.register(PricingGroup)
admin.site.register(MethodConstantInt)
admin.site.register(MethodConstantDecimal)
admin.site.register(MethodConstantBool)
admin.site.register(MethodConstantStation)
admin.site.register(Charger)
