from datetime import datetime
from django.test import TestCase
from django.utils.timezone import make_aware

from gridprice.models import GridPrice, Location
from gridprice.useful_functions import get_grid_price


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
        self.datetime3 = make_aware(
            datetime.strptime("2022-05-14 03:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime4 = make_aware(
            datetime.strptime("2022-05-14 04:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime5 = make_aware(
            datetime.strptime("2022-05-14 05:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime6 = make_aware(
            datetime.strptime("2022-05-14 06:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime7 = make_aware(
            datetime.strptime("2022-05-14 07:00:00", "%Y-%m-%d %H:%M:%S"))

        self.datetime6_prev1 = make_aware(
            datetime.strptime("2022-05-13 06:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime6_prev2 = make_aware(
            datetime.strptime("2022-05-12 06:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime7_prev1 = make_aware(
            datetime.strptime("2022-05-13 07:00:00", "%Y-%m-%d %H:%M:%S"))
        self.datetime7_prev2 = make_aware(
            datetime.strptime("2022-05-12 07:00:00", "%Y-%m-%d %H:%M:%S"))

        self.price1 = 1
        self.price2 = 2
        self.price3 = 3
        self.price4 = 4
        self.price5 = 5

        self.location = Location.objects.create(name='Test Location')
        # past prices, that will be used by gridprice.forecast.simple_forecase
        GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime6_prev1,
            end_time=self.datetime7_prev1,
            price=self.price1
        )
        GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime6_prev2,
            end_time=self.datetime7_prev2,
            price=self.price2
        )

        # past prices, that will be used by
        # gridprice.useful_functions.find_average_grid_price
        GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime2,
            end_time=self.datetime3,
            price=self.price3
        )
        GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime3,
            end_time=self.datetime4,
            price=self.price4
        )
        GridPrice.objects.create(
            location=self.location,
            start_time=self.datetime4,
            end_time=self.datetime5,
            price=self.price5
        )


    def test_get_grid_price(self):
        """Test get_grid_price function
        """
        price = get_grid_price(self.datetime2, self.datetime3,
                               self.location)
        # we multiply with 1000 to convert from MWh to KWh
        self.assertEquals(price*1000, self.price3)

        price = get_grid_price(self.datetime2, self.datetime4,
                               self.location)
        self.assertEquals(price*1000, (self.price3+self.price4)/2)

        price = get_grid_price(self.datetime2, self.datetime5,
                               self.location)
        self.assertEquals(price*1000, (self.price3+self.price4+self.price5)/3)

        price = get_grid_price(self.datetime6, self.datetime7,
                               self.location)
        self.assertEquals(price*1000, (self.price1+self.price2)/2)
