from django.contrib.auth.models import User
from django.db import models
import datetime
from pytz import timezone

from gridprice.models import Location


class Station(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=31, default='')
    latitude = models.DecimalField(max_digits=8, decimal_places=5, default=0)
    longitude = models.DecimalField(max_digits=8, decimal_places=5, default=0)
    address = models.CharField(max_length=63, default='')
    phone = models.CharField(max_length=15, default='')
    operators = models.ManyToManyField(User)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL,
                                 null=True, blank=True)

    def __str__(self):
        return f'{self.id}, {self.name}'

    def get_chargers(self):
        # probably notthe best way to avoid circular imports
        from chargers.models import PricingGroup, Charger

        chargers = []
        for group in PricingGroup.objects.filter(station=self):
            for c in Charger.objects.filter(pricing_group=group):
                chargers.append(c)

        return chargers


class ParkingCostSnapshot(models.Model):
    id = models.AutoField(primary_key=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    name = models.CharField(max_length=31, default='')
    value = models.DecimalField(max_digits=9, decimal_places=4, default=0)
    is_default = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.id}, {self.name}, {str(self.value)}, \
is_default: {str(self.is_default)}'


class ParkingCost(models.Model):
    id = models.AutoField(primary_key=True)
    parking_cost_snapshot = models.ForeignKey(ParkingCostSnapshot,
                                              on_delete=models.CASCADE)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    from_datetime = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-22 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))
    to_datetime = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-23 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))

    def __str__(self):
        return f'{self.id}, {self.parking_cost_snapshot},\
from {str(self.from_datetime)}, to {str(self.to_datetime)}'


class StationRequests(models.Model):
    id = models.AutoField(primary_key=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    operator = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id}, {self.station.name}, {self.operator.username}'
