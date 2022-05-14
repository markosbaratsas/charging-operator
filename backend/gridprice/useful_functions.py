

from datetime import datetime
from django.db.models import Q
from pytz import timezone
import pytz

from gridprice.forecast import simple_forecast
from gridprice.models import GridPrice, Location
from stations.useful_functions import get_user_station


def get_location(request):
    """Return a location for a given location_id or for a given station with
    a station_id.

    Args:
        request (request): The request object

    Returns:
        Location Object: The location for the specific station_id or for the
            specific location_id
    """
    location = None
    if 'station_id' in request.data:
        station = get_user_station(request.user, request.data['station_id'])
        if station == None:
            return None

        location = station.location

    else:
        try:
            location_id = int(request.data['location_id'])
            location = Location.objects.get(id=location_id)
        except:
            return None
    
    return location


def find_average_grid_price(start, end, location):
    """Find the average price for an existing period that the prices exist on
    the database

    Args:
        start (datetime): The start datetime of the period
        end (datetime): The end datetime of the period
        location (Location): The location to search for its grid price

    Returns:
        float: the average grid price for the given period that exists in the
            database
    """
    prices = [float(i.get_kw_price())
              for i in GridPrice.objects.filter((Q(start_time__gte=start)
                                                 & Q(end_time__lte=end)),
                                                location=location)]
    if len(prices) > 0:
        return sum(prices)/len(prices)
    else:
        try:
            price = float(GridPrice.objects.get(start_time=start).get_kw_price())
            return price
        except:
            return -123.0
    

def get_grid_price(start_time, end_time, location):
    """Return the mean of grid prices that apply to the given time period

    Args:
        start_datetime (datetime): The start datetime of the period
        end_datetime (datetime): The end datetime of the period
        location (Location): The location to search for its grid price

    Returns:
        float: the average grid price for the given period
    """
    if end_time < start_time:
        return -123.0

    time_zone = pytz.timezone('UTC')
    start_time = start_time.astimezone(time_zone)
    end_time = end_time.astimezone(time_zone)

    start = datetime(
        start_time.year,
        start_time.month,
        start_time.day,
        start_time.hour,
        0, 0, 0).replace(tzinfo=timezone('UTC'))
    end = datetime(
        end_time.year,
        end_time.month,
        end_time.day,
        end_time.hour,
        0, 0, 0).replace(tzinfo=timezone('UTC'))

    first = GridPrice.objects.all().order_by("start_time")[0].start_time
    latest = GridPrice.objects.all().order_by("-start_time")[0].end_time

    if start < first and end < first:
        return simple_forecast(start, end, location)

    elif (start < first and first < end and end < latest):
        t1 = start.timestamp()
        t2 = first.timestamp()
        t3 = end.timestamp()
        all = t3 - t1
        return ( 
            ((t2-t1)/all) * simple_forecast(start, first, location)
            + ((t3-t2)/all) * find_average_grid_price(first, end, location)
        )

    elif (first <= start and start < latest
            and first < end and end <= latest):
        return find_average_grid_price(start, end, location)

    elif (start < first and latest < end):
        t1 = start.timestamp()
        t2 = first.timestamp()
        t3 = latest.timestamp()
        t4 = end.timestamp()
        all = t4 - t1
        return (
            ((t2-t1)/all) * simple_forecast(start, first, location)
            + ((t3-t2)/all) * find_average_grid_price(first, latest, location)
            + ((t4-t3)/all) * simple_forecast(latest, end, location)
        )

    elif (first < start and start < latest 
            and first < end and end < latest):
        return find_average_grid_price(start, end, location)

    elif (first < start and start < latest and latest < end):
        t1 = start.timestamp()
        t2 = latest.timestamp()
        t3 = end.timestamp()
        all = t3 - t1
        return (
            ((t2-t1)/all) * find_average_grid_price(start, latest, location)
            + ((t3-t2)/all) * simple_forecast(latest, end, location)
        )

    else:
        return simple_forecast(start, end, location)
