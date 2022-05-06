from django.utils import timezone
from rest_framework import serializers

from gridprice.models import GridPrice, Location


class GridPriceSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()
    start_time = serializers.SerializerMethodField()
    end_time = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    start_time_time = serializers.SerializerMethodField()
    end_time_time = serializers.SerializerMethodField()

    class Meta:
        model = GridPrice
        fields = ['id', 'location', 'start_time', 'end_time', 'price',
                  'start_time_time', 'end_time_time']

    def get_location(self, obj):
        return obj.location.name

    def get_start_time(self, obj):
        return (obj.start_time\
                    .astimezone(timezone.get_current_timezone())\
                    .strftime("%Y-%m-%d %H:%M"))

    def get_end_time(self, obj):
        return (obj.end_time\
                    .astimezone(timezone.get_current_timezone())\
                    .strftime("%Y-%m-%d %H:%M"))

    def get_start_time_time(self, obj):
        return (obj.end_time\
                    .astimezone(timezone.get_current_timezone())\
                    .strftime("%H:%M"))

    def get_end_time_time(self, obj):
        return (obj.end_time\
                    .astimezone(timezone.get_current_timezone())\
                    .strftime("%H:%M"))

    def get_price(self, obj):
        # convert to €/KWh
        return obj.get_kw_price()


class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = ['id', 'name']
