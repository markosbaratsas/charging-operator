from rest_framework import serializers
from chargers.models import Charger
from chargers.serializers import PricingGroupSerializer
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
        for group in obj.pricing_groups.all():
            all = Charger.objects.filter(pricing_group=group).count()

        return all

    def get_occupied_chargers(self, obj):
        occupied = 0
        for group in obj.pricing_groups.all():
            occupied = Charger.objects.filter(pricing_group=group,
                                              is_occupied=True).count()

        return occupied

