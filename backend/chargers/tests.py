from datetime import datetime
from django.test import TestCase
from django.utils.timezone import make_aware
from chargers.models import Charger, MethodConstantBool, MethodConstantDecimal, MethodConstantInt, PricingGroup
from chargers.useful_functions import get_charging_price

from gridprice.models import GridPrice, Location
from gridprice.useful_functions import get_grid_price
from reservations.models import Reservation
from stations.models import Station


class TestGridprice(TestCase):
    """Class created to test the gridprice app
    """

    def setUp(self):
        """Set up environment to be used in all of the tests
        """
        self.datetime0 = make_aware(
            datetime.strptime("2022-05-14 00:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime1 = make_aware(
            datetime.strptime("2022-05-14 01:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime2 = make_aware(
            datetime.strptime("2022-05-14 02:00:00", "%Y-%m-%d %H:%M:%S"))

        self.price1 = 1
        self.price2 = 2

        self.location = Location.objects.create(name='Test Location')

        self.grid_price1 = GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime0,
            end_time=self.datetime1,
            price=self.price1
        )
        self.grid_price2 = GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime1,
            end_time=self.datetime2,
            price=self.price2
        )

        self.station = Station.objects.create(
            name="Test Station",
            latitude=23.333,
            longitude=23.333,
            location=self.location
        )

        self.group1 = PricingGroup.objects.create(
            station=self.station,
            name="Test PricingGroup1",
            method_name="Fixed Price"
        )
        self.group1_c = MethodConstantDecimal.objects.create(
            pricing_group=self.group1,
            name="c",
            value=0.3
        )

        self.group2 = PricingGroup.objects.create(
            station=self.station,
            name="Test PricingGroup2",
            method_name="Fixed Profit"
        )
        self.group2_c = MethodConstantDecimal.objects.create(
            pricing_group=self.group2,
            name="c",
            value=0.3
        )
        self.group2_all_expenses = MethodConstantDecimal.objects.create(
            pricing_group=self.group2,
            name="all_expenses",
            value=0.2
        )
        self.group2_grid_price = MethodConstantBool.objects.create(
            pricing_group=self.group2,
            name="grid_price",
            value=True
        )

        self.group3 = PricingGroup.objects.create(
            station=self.station,
            name="Test PricingGroup3",
            method_name="Demand-centered Profit"
        )
        self.group3_c1 = MethodConstantDecimal.objects.create(
            pricing_group=self.group3,
            name="c1",
            value=0.3
        )
        self.group3_c2 = MethodConstantDecimal.objects.create(
            pricing_group=self.group3,
            name="c2",
            value=0.3
        )
        self.group3_n = MethodConstantInt.objects.create(
            pricing_group=self.group3,
            name="n",
            value=1
        )
        self.group3_all_expenses = MethodConstantDecimal.objects.create(
            pricing_group=self.group3,
            name="all_expenses",
            value=0.2
        )
        self.group3_grid_price = MethodConstantBool.objects.create(
            pricing_group=self.group3,
            name="grid_price",
            value=True
        )

        self.charger = Charger.objects.create(
            pricing_group=self.group3,
            name="My Test Charger",
            connector_type="Type 2",
            current="AC",
            power=22.0,
            is_occupied=False
        )

    def test_get_charging_price(self):
        """Test get_charging_price function
        """
        price = get_charging_price(self.group1,
                                   set(),
                                   self.datetime0,
                                   self.datetime1)
        expected_price = self.group1_c.value
        self.assertEquals(price, expected_price)

        price = get_charging_price(self.group2,
                                   set(),
                                   self.datetime0,
                                   self.datetime1)
        expected_price = (self.group2_c.value + self.group2_all_expenses.value
                          + self.grid_price1.get_kw_price())
        self.assertAlmostEqual(price, expected_price)

        price = get_charging_price(self.group3,
                                   set(),
                                   self.datetime0,
                                   self.datetime1)
        expected_price = (self.group3_c1.value + self.group3_all_expenses.value
                          + self.grid_price1.get_kw_price())
        self.assertAlmostEqual(price, expected_price)

        # create a reservation so that we have an occupied charger
        Reservation.objects.create(
            charger=self.charger,
            station=self.station,
            expected_arrival=self.datetime0,
            actual_arrival=self.datetime0,
            expected_departure=self.datetime2,
            actual_departure=self.datetime2,
            state='Reserved',
            price_per_kwh=0.0
        )
        price = get_charging_price(self.group3,
                                   set(),
                                   self.datetime0,
                                   self.datetime1)
        expected_price = (self.group3_c1.value + self.group3_all_expenses.value
                          + self.grid_price1.get_kw_price()
                          + self.group3_c2.value * (1**1)/1)
        self.assertAlmostEqual(price, expected_price)
