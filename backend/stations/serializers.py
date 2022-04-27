from rest_framework import serializers

from chargers.models import Charger, PricingGroup
from stations.models import Station


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
