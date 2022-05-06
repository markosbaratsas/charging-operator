

from datetime import datetime
from django.utils.timezone import make_aware

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


def find_average_grid_price(start, end):
    prices = [float(i.get_kw_price()) for i in
                GridPrice.objects.filter(start_time=start, end_time=end)]
    if len(prices) > 0:
        return sum(prices)/len(prices)
    else:
        try:
            price = float(GridPrice.objects.get(start_time=start).get_kw_price())
            return price
        except:
            return -123
    

def get_grid_price(start_time, end_time):
    """Return the mean of grid prices that apply to the given time period

    Args:
        start_datetime (datetime): The start datetime of the period
        end_datetime (datetime): The end datetime of the period
    """
    if end_time < start_time:
        return -123

    start = make_aware(datetime(
        start_time.year,
        start_time.month,
        start_time.day,
        start_time.hour,
        0, 0, 0))
    end = make_aware(datetime(
        end_time.year,
        end_time.month,
        end_time.day,
        end_time.hour,
        0, 0, 0))

    first = GridPrice.objects.all().order_by("start_time")[0].start_time
    latest = GridPrice.objects.all().order_by("-start_time")[0].end_time

    if start < first and end < first:
        return simple_forecast(start, end)

    elif (start < first and first < end and end < latest):
        t1 = start.timestamp()
        t2 = first.timestamp()
        t3 = end.timestamp()
        all = t3 - t1
        return ( 
                ((t2-t1)/all) * simple_forecast(start, first)
                + ((t3-t2)/all) * find_average_grid_price(first, end)
        )

    elif (first < start and start < latest
            and first < end and end < latest):
        return find_average_grid_price(start, end)

    elif (start < first and latest < end):
        t1 = start.timestamp()
        t2 = first.timestamp()
        t3 = latest.timestamp()
        t4 = end.timestamp()
        all = t4 - t1
        return (
                ((t2-t1)/all) * simple_forecast(start, first)
                + ((t3-t2)/all) * find_average_grid_price(first, latest)
                + ((t4-t3)/all) * simple_forecast(latest, end)
        )

    elif (first < start and start < latest 
            and first < end and end < latest):
        return find_average_grid_price(start, end)

    elif (first < start and start < latest and latest < end):
        t1 = start.timestamp()
        t2 = latest.timestamp()
        t3 = end.timestamp()
        all = t3 - t1
        return (
                ((t2-t1)/all) * find_average_grid_price(start, latest)
                + ((t3-t2)/all) * simple_forecast(latest, end)
        )

    elif (latest < start and latest < end):
        return simple_forecast(start, end)

    # TODO: find better values to return
    return -123
