from rest_framework import serializers
from datetime import datetime
from chargers.serializers import ChargerReservationSerializer

from reservations.models import Model, Owner, Reservation, Vehicle, VehicleState
from stations.serializers import StationInformationSerializer


class VehiclesChargingNowSerializer(serializers.ModelSerializer):
    model = serializers.SerializerMethodField()
    license_plate = serializers.SerializerMethodField()
    charging_in = serializers.SerializerMethodField()
    arrival = serializers.SerializerMethodField()
    expected_departure = serializers.SerializerMethodField()
    current_battery = serializers.SerializerMethodField()
    desired_final_battery = serializers.SerializerMethodField()

    class Meta:
        model = VehicleState
        fields = ['id', 'model', 'license_plate', 'charging_in', 'arrival',
                  'expected_departure', 'current_battery',
                  'desired_final_battery']

    def get_model(self, obj):
        return f'{obj.vehicle.model.manufacturer} {obj.vehicle.model.name}'

    def get_license_plate(self, obj):
        return obj.vehicle.license_plate

    def get_charging_in(self, obj):
        return obj.charger.name

    def get_arrival(self, obj):
        r = Reservation.objects.get(vehicle_state=obj)
        return r.actual_arrival.strftime("%d/%m/%Y %H:%M")

    def get_expected_departure(self, obj):
        r = Reservation.objects.get(vehicle_state=obj)
        return r.expected_departure.strftime("%d/%m/%Y %H:%M")

    def get_current_battery(self, obj):
        return obj.current_battery

    def get_desired_final_battery(self, obj):
        return obj.desired_final_battery


class ReservationSerializer(serializers.ModelSerializer):
    vehicle_name = serializers.SerializerMethodField()
    model = serializers.SerializerMethodField()
    license_plate = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()
    owner_phone = serializers.SerializerMethodField()
    charger = serializers.SerializerMethodField()
    expected_arrival = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    actual_arrival = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    expected_departure = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    actual_departure = serializers.DateTimeField(format="%d/%m/%Y %H:%M")
    station = serializers.SerializerMethodField()

    class Meta:
        model = Reservation
        fields = ['id', 'model', 'license_plate', 'owner', 'state',
                    'expected_arrival', 'actual_arrival', 'expected_departure',
                    'actual_departure', 'price_per_kwh', 'parking_cost',
                    'parking_cost_extra', 'energy_cost', 'total_cost',
                    'charger', 'total_energy_transmitted', 'vehicle_name',
                    'owner_phone', 'station']

    def get_vehicle_name(self, obj):
        return obj.vehicle.name

    def get_model(self, obj):
        return f'{obj.vehicle.model.manufacturer} {obj.vehicle.model.name}'

    def get_license_plate(self, obj):
        return obj.vehicle.license_plate

    def get_owner(self, obj):
        if not obj.vehicle.owner:
            return "Uknown Owner's name"
        return obj.vehicle.owner.name

    def get_owner_phone(self, obj):
        if not obj.vehicle.owner.phone:
            return "Uknown Owner's phone"
        return str(obj.vehicle.owner.phone)

    def get_charger(self, obj):
        return ChargerReservationSerializer(
                    obj.charger,
                    context={
                        'arrival_time': obj.actual_arrival,
                        'departure_time': obj.actual_departure,
                    }).data

    def get_station(self, obj):
        return StationInformationSerializer(obj.station).data


class ModelSerializer(serializers.ModelSerializer):

    class Meta:
        model = Model
        fields = ['id', 'name', 'manufacturer', 'battery_capacity']


class OwnerSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = Owner
        fields = ['id', 'name', 'phone', 'email', 'username']

    def get_username(self, obj):
        return obj.user.username


class VehicleSerializer(serializers.ModelSerializer):
    model = serializers.SerializerMethodField()
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Vehicle
        fields = ['id', 'owner', 'name', 'model', 'license_plate', 'default']

    def get_model(self, obj):
        return ModelSerializer(obj.model).data

    def get_owner(self, obj):
        return OwnerSerializer(obj.owner).data
