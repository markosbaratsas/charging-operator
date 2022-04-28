from rest_framework import serializers

from chargers.models import Charger, PricingGroup
from chargers.useful_functions import get_charging_price


class PricingGroupInfoSerializer(serializers.ModelSerializer):
    all_chargers = serializers.SerializerMethodField()
    occupied_chargers = serializers.SerializerMethodField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'occupied_chargers', 'all_chargers',
                  'method_name', 'description']

    def get_all_chargers(self, obj):
        return int(Charger.objects.filter(pricing_group=obj).count())

    def get_occupied_chargers(self, obj):
        return int(Charger.objects.filter(pricing_group=obj,
                                          is_occupied=True).count())


class PricingGroupPricesSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'current_price']

    def get_current_price(self, obj):
        return get_charging_price(obj, set())
