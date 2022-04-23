from django.contrib.auth.models import User
from django.db import models
import datetime
from pytz import timezone


class Station(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=31, default='')
    latitude = models.DecimalField(max_digits=8, decimal_places=5, default=0)
    longitude = models.DecimalField(max_digits=8, decimal_places=5, default=0)
    address = models.CharField(max_length=63, default='')
    phone = models.CharField(max_length=15, default='')

    def __str__(self):
        return f'{self.id}, {self.name}'


class UserStation(models.Model):
    id = models.AutoField(primary_key=True)
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id}, {self.user}, {self.station}'


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
    from_datetime = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-22 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))
    to_datetime = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-23 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))

    def __str__(self):
        return f'{self.id}, {self.parking_cost_snapshot},\
from {str(self.from_datetime)}, to {str(self.to_datetime)}'

