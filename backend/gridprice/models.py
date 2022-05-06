from datetime import datetime
from django.db import models
from pytz import timezone
from charging_operator.settings import TIME_ZONE


class Location(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=63, default='')

    def __str__(self):
        return f'{self.id}, {self.name}'


class GridPrice(models.Model):
    id = models.AutoField(primary_key=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL,
                                 null=True, blank=True)
    start_time = models.DateTimeField(default=datetime.\
            strptime("2022-05-05 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone(TIME_ZONE)))
    end_time = models.DateTimeField(default=datetime.\
            strptime("2022-05-05 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone(TIME_ZONE)))
    # price will be in €/MWh
    price = models.DecimalField(max_digits=8, decimal_places=3, default=0)

    def __str__(self):
        return f'{self.price}€/MWh, from: {self.start_time}, to: {self.end_time}'

    def get_kw_price(self):
        return float(self.price)/1000
