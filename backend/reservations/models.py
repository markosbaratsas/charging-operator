from django.db import models
import datetime
from pytz import timezone

from chargers.models import Charger
from stations.models import Station
from users.models import MyUser


class Owner(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=31, default='')
    email = models.EmailField(max_length=31, default='')
    phone = models.CharField(max_length=15, default='')
    user = models.ForeignKey(MyUser, on_delete=models.SET_NULL, null=True,
                             blank=True)

    def __str__(self):
        ret = f'{self.id}, {self.name}'
        if self.user:
            ret += ', ' + self.user.username
        return ret


class Model(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=63, default='')
    manufacturer = models.CharField(max_length=63, default='')
    battery_capacity = models.DecimalField(max_digits=8, decimal_places=4,
                                          default=0)

    def __str__(self):
        return f'{self.id}, {self.name}, {self.manufacturer}, \
{self.battery_capacity}'


class Vehicle(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(Owner, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=31, default='')
    model = models.ForeignKey(Model, on_delete=models.SET_NULL, null=True)
    license_plate = models.CharField(max_length=31, default='')
    default = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.id}, {self.name}, {self.model}'


class VehicleState(models.Model):
    class State(models.TextChoices):
        """These are the possible pricing methods supported
        """
        CHARGING = 'Charging'
        CANCELED = 'Canceled'
        SUCCESS = 'Success'
        FAILURE = 'Failure'

    id = models.AutoField(primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    charger = models.ForeignKey(Charger, on_delete=models.SET_NULL, null=True)
    state = models.CharField(max_length=31, default='',
                                    choices=State.choices)
    current_battery = models.DecimalField(max_digits=8, decimal_places=4,
                                          default=-1)
    desired_final_battery = models.DecimalField(max_digits=8,
                                               decimal_places=4, default=-1)
    energy_transmitted_so_far = models.DecimalField(max_digits=8,
                                               decimal_places=4, default=-1)

    def __str__(self):
        return f'{self.id}, {self.state}, {self.vehicle}'


class Reservation(models.Model):
    class ReservationState(models.TextChoices):
        """These are the possible pricing methods supported
        """
        CHARGING = 'Charging'
        CANCELED = 'Canceled'
        SUCCESS = 'Success'
        FAILURE = 'Failure'
        RESERVED = 'Reserved'

    id = models.AutoField(primary_key=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.SET_NULL, null=True)
    charger = models.ForeignKey(Charger, on_delete=models.SET_NULL, null=True)
    station = models.ForeignKey(Station, on_delete=models.SET_NULL, null=True)
    vehicle_state = models.ForeignKey(VehicleState,
                                      on_delete=models.SET_NULL, null=True,
                                      blank=True)
    expected_arrival = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-22 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))
    actual_arrival = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-22 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))
    expected_departure = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-22 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))
    actual_departure = models.DateTimeField(default=datetime.\
            datetime.strptime("2022-04-22 00:00:00", "%Y-%m-%d %H:%M:%S").\
            replace(tzinfo=timezone('UTC')))
    state = models.CharField(max_length=31, default='',
                                    choices=ReservationState.choices)
    price_per_kwh = models.DecimalField(max_digits=6, decimal_places=3,
                                        default=0)
    smart_vtg = models.BooleanField(default=True)

    # calculated when reservation is over
    total_energy_transmitted = models.DecimalField(max_digits=7,
                                                 decimal_places=3,
                                                 default=0)
    parking_cost = models.DecimalField(max_digits=6, decimal_places=3,
                                       default=0)
    parking_cost_extra = models.DecimalField(max_digits=6, decimal_places=3,
                                        default=0)
    energy_cost = models.DecimalField(max_digits=6, decimal_places=3,
                                        default=0)
    total_cost = models.DecimalField(max_digits=6, decimal_places=3,
                                        default=0)

    def __str__(self):
        return f'{self.id}, {self.vehicle}, {self.charger}, {self.state}'
