from rest_framework import serializers

from chargers.models import Charger, PricingGroup
from stations.models import ParkingCost, Station


class DashboardStationSerializer(serializers.ModelSerializer):
    all_chargers = serializers.SerializerMethodField()
    occupied_chargers = serializers.SerializerMethodField()

    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude', 'address',
                  'occupied_chargers', 'all_chargers']


    def get_all_chargers(self, obj):
        all = 0
        groups = PricingGroup.objects.filter(station=obj)
        for group in groups:
            all += Charger.objects.filter(pricing_group=group).count()

        return all

    def get_occupied_chargers(self, obj):
        occupied = 0
        groups = PricingGroup.objects.filter(station=obj)
        for group in groups:
            occupied += Charger.objects.filter(pricing_group=group,
                                              is_occupied=True).count()

        return occupied


class StationMarkersSerializer(serializers.ModelSerializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()

    class Meta:
        model = Station
        fields = ['id', 'name', 'address', 'latitude', 'longitude']


class StationInformationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Station
        fields = ['id', 'name', 'latitude', 'longitude', 'address']


class ParkingCostSerializer(serializers.ModelSerializer):
    station = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    is_default = serializers.SerializerMethodField()

    class Meta:
        model = ParkingCost
        fields = ['id', 'from_datetime', 'to_datetime', 'station', 'name',
                  'value', 'is_default']

    def get_station(self, obj):
        return StationInformationSerializer(obj.station).data

    def get_name(self, obj):
        return obj.parking_cost_snapshot.name

    def get_value(self, obj):
        return obj.parking_cost_snapshot.value

    def get_is_default(self, obj):
        return obj.parking_cost_snapshot.is_default
