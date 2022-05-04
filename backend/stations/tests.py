from datetime import datetime
from django.test import TestCase
from django.utils.timezone import make_aware
from django.contrib.auth.models import User

from chargers.models import Charger, MethodConstantDecimal, PricingGroup
from stations.models import ParkingCost, ParkingCostSnapshot, Station
from stations.useful_functions import (calculate_parking_cost,
                                       find_parking_costs)


class TestStations(TestCase):

    def setUp(self):
        self.operator = User.objects.create(
            username="test_operator",
            password="1234"
        )
        self.station = Station.objects.create(
            name="Test Station",
            latitude=23.333,
            longitude=23.333
        )
        self.pricing_group = PricingGroup.objects.create(
            station=self.station,
            name="Test PricingGroup",
            method_name="Fixed Pricing"
        )
        c = MethodConstantDecimal.objects.create(
            pricing_group=self.pricing_group,
            name="c",
            value=0.3
        )
        self.charger = Charger.objects.create(
            pricing_group=self.pricing_group,
            name="My Test Charger 1",
            connector_type="Type 2",
            current="AC",
            power=22.0,
            is_occupied=False
        )
        self.pcs = ParkingCostSnapshot.objects.create(
            station=self.station,
            name="Test Parking Cost",
            value=1.0
        )
        self.pc = ParkingCost.objects.create(
            parking_cost_snapshot=self.pcs,
            station=self.station,
            from_datetime=make_aware(datetime.strptime("2000-01-01 00:00:00",
                                                       "%Y-%m-%d %H:%M:%S")),
            to_datetime=make_aware(datetime.strptime("2100-01-01 00:00:00",
                                                     "%Y-%m-%d %H:%M:%S"))
        )


    def test_calculate_parking_cost(self):
        actual_arival_str = make_aware(
            datetime.strptime("2022-05-04 00:00:00", "%Y-%m-%d %H:%M:%S"))
        actual_departure_str = make_aware(
            datetime.strptime("2022-05-05 00:00:00", "%Y-%m-%d %H:%M:%S"))
        pcs = find_parking_costs(self.station,
                                 actual_arival_str,
                                 actual_departure_str)
        cost = calculate_parking_cost(pcs,
                               actual_arival_str,
                               actual_departure_str)

        self.assertEquals(cost, 24.0)

        actual_arival_str = make_aware(
            datetime.strptime("2022-05-04 00:00:00", "%Y-%m-%d %H:%M:%S"))
        actual_departure_str = make_aware(
            datetime.strptime("2022-05-04 13:00:00", "%Y-%m-%d %H:%M:%S"))
        pcs = find_parking_costs(self.station,
                                 actual_arival_str,
                                 actual_departure_str)
        cost = calculate_parking_cost(pcs,
                               actual_arival_str,
                               actual_departure_str)
        self.assertEquals(cost, 13.0)

        actual_arival_str = make_aware(
            datetime.strptime("2022-05-04 00:00:00", "%Y-%m-%d %H:%M:%S"))
        actual_departure_str = make_aware(
            datetime.strptime("2022-05-04 17:00:00", "%Y-%m-%d %H:%M:%S"))
        pcs = find_parking_costs(self.station,
                                 actual_arival_str,
                                 actual_departure_str)
        cost = calculate_parking_cost(pcs,
                               actual_arival_str,
                               actual_departure_str)
        self.assertEquals(cost, 17.0)
