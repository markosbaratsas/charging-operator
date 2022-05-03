from django.utils import timezone
from rest_framework import serializers

from chargers.models import (Charger, MethodConstantBool,
                             MethodConstantDecimal, MethodConstantInt,
                             MethodConstantStation, PricingGroup)
from chargers.useful_functions import get_charging_price
from stations.serializers import StationMarkersSerializer


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
        datetime_now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        return get_charging_price(obj,
                                  set(),
                                  datetime_now,
                                  datetime_now)


class ChargerSerializer(serializers.ModelSerializer):
    power = serializers.FloatField()

    class Meta:
        model = Charger
        fields = ['id', 'name', 'current', 'connector_type', 'power']


class ChargerReservationSerializer(serializers.ModelSerializer):
    power = serializers.FloatField()
    current_price = serializers.SerializerMethodField()

    class Meta:
        model = Charger
        fields = ['id', 'name', 'current', 'connector_type', 'power',
                  'current_price']

    def get_current_price(self, obj):
        datetime_now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        return get_charging_price(obj.pricing_group,
                                  set(),
                                  datetime_now,
                                  datetime_now)


class MethodConstantIntSerializer(serializers.ModelSerializer):
    value = serializers.IntegerField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'value']


class MethodConstantDecimalSerializer(serializers.ModelSerializer):
    value = serializers.FloatField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'value']


class MethodConstantBoolSerializer(serializers.ModelSerializer):
    value = serializers.BooleanField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'value']


class MethodConstantStationSerializer(serializers.ModelSerializer):
    value = serializers.SerializerMethodField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'value']

    def get_value(self, obj):
        return StationMarkersSerializer(obj.value).data


class PricingGroupSerializer(serializers.ModelSerializer):
    current_price = serializers.SerializerMethodField()
    chargers = serializers.SerializerMethodField()
    pricing_method = serializers.SerializerMethodField()

    class Meta:
        model = PricingGroup
        fields = ['id', 'name', 'current_price', 'chargers', 'pricing_method']

    def get_current_price(self, obj):
        datetime_now = timezone.now().strftime("%Y-%m-%d %H:%M:%S")
        return get_charging_price(obj,
                                  set(),
                                  datetime_now,
                                  datetime_now)

    def get_chargers(self, obj):
        chargers = Charger.objects.filter(pricing_group=obj)
        serializer = ChargerSerializer(chargers, many=True)
        return serializer.data

    def get_pricing_method(self, obj):
        variables_list_of_dict = []

        for i in MethodConstantInt.objects.filter(pricing_group=obj):
            s = MethodConstantIntSerializer(i).data
            variables_list_of_dict.append(s)

        for i in MethodConstantDecimal.objects.filter(pricing_group=obj):
            s = MethodConstantDecimalSerializer(i).data
            variables_list_of_dict.append(s)

        for i in MethodConstantBool.objects.filter(pricing_group=obj):
            s = MethodConstantBoolSerializer(i).data
            variables_list_of_dict.append(s)

        for i in MethodConstantStation.objects.filter(pricing_group=obj):
            s = MethodConstantStationSerializer(i).data
            variables_list_of_dict.append(s)

        ret = {
            "name": obj.method_name,
            "variables": variables_list_of_dict
        }
        return ret
