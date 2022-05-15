from datetime import datetime
from django.test import TestCase
from django.utils.timezone import make_aware

from chargers.models import Charger, MethodConstantDecimal, PricingGroup
from reservations.models import Reservation, Vehicle
from reservations.useful_functions import get_station_available_chargers
from stations.models import Station


class TestReservations(TestCase):
    """Class created to test the reservations app
    """

    def setUp(self):
        """Set up environment to be used in all of the tests
        """
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
        self.charger1 = Charger.objects.create(
            pricing_group=self.pricing_group,
            name="My Test Charger 1",
            connector_type="Type 2",
            current="AC",
            power=22.0,
            is_occupied=False
        )
        self.charger2 = Charger.objects.create(
            pricing_group=self.pricing_group,
            name="My Test Charger 2",
            connector_type="Type 2",
            current="AC",
            power=22.0,
            is_occupied=False
        )
        # we dont care about the vehicle info
        vehicle = Vehicle.objects.create()
        self.datetime0 = make_aware(
            datetime.strptime("2022-05-14 00:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime1 = make_aware(
            datetime.strptime("2022-05-14 01:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime2 = make_aware(
            datetime.strptime("2022-05-14 02:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime3 = make_aware(
            datetime.strptime("2022-05-14 03:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime4 = make_aware(
            datetime.strptime("2022-05-14 04:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime5 = make_aware(
            datetime.strptime("2022-05-14 05:00:00", "%Y-%m-%d %H:%M:%S"))

        # let's create 2 reservations
        Reservation.objects.create(
            vehicle=vehicle,
            charger=self.charger1,
            station=self.station,
            expected_arrival=self.datetime1,
            actual_arrival=self.datetime1,
            expected_departure=self.datetime3,
            actual_departure=self.datetime3,
            state='Reserved',
            price_per_kwh=0.0
        )
        Reservation.objects.create(
            vehicle=vehicle,
            charger=self.charger2,
            station=self.station,
            expected_arrival=self.datetime2,
            actual_arrival=self.datetime2,
            expected_departure=self.datetime4,
            actual_departure=self.datetime4,
            state='Reserved',
            price_per_kwh=0.0
        )


    def test_get_station_available_chargers(self):
        """Test get_station_available_chargers function
        """
        nr_chargers = len(get_station_available_chargers(self.station,
                                                         self.datetime0,
                                                         self.datetime0))
        self.assertEquals(nr_chargers, 2)

        nr_chargers = len(get_station_available_chargers(self.station,
                                                         self.datetime0,
                                                         self.datetime1))
        self.assertEquals(nr_chargers, 1)

        nr_chargers = len(get_station_available_chargers(self.station,
                                                         self.datetime1,
                                                         self.datetime3))
        self.assertEquals(nr_chargers, 0)

        nr_chargers = len(get_station_available_chargers(self.station,
                                                         self.datetime5,
                                                         self.datetime5))
        self.assertEquals(nr_chargers, 2)
