from django.db import models


class Location(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=63, default='')

    def __str__(self):
        return f'{self.id}, {self.name}'


class GridPrice(models.Model):
    id = models.AutoField(primary_key=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL,
                                 null=True, blank=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now_add=True)
    # price will be in €/MWh
    price = models.DecimalField(max_digits=8, decimal_places=3, default=0)

    def __str__(self):
        return f'{self.price}€/MWh, from: {self.start_time}, to: {self.end_time}'
