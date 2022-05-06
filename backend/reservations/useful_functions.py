from datetime import datetime
from django.db.models import Q
from django.utils.timezone import make_aware
from pytz import timezone

from reservations.models import Reservation


def validate_dates(dt, given_format):
    """Function used to validate that dates have the expected format

    Args:
        dt (str): String to be validated

    Returns:
        bool: True if in expected format, else False
    """
    try:
        datetime.strptime(dt, given_format).replace(tzinfo=timezone('UTC'))
    except:
        return False
    
    return True

def get_station_available_chargers(station, from_datetime, to_datetime):
    """Get a station's available chargers for a given date range

    Args:
        station (Station): Given Station Object
        from_datetime (datetime): The given from datetime
        to_datetime (datetime): The given to datetime

    Returns:
        list of Chargers or None: if successful return the available chargers,
            else if an error occurs return None
    """

    try:
        reservations = set(Reservation.objects.filter((
            (
                Q(actual_arrival__range=[from_datetime, to_datetime])
                | Q(actual_departure__range=[from_datetime, to_datetime])
            ) | (
                (Q(actual_arrival__lte=from_datetime)
                & Q(actual_departure__gte=to_datetime)
            ))),
            station=station
        ))

        reserved_chargers = set()

        for i in reservations:
            reserved_chargers.add(i.charger)

        chargers = station.get_chargers()

        available_chargers = []
        for charger in chargers:
            if charger not in reserved_chargers:
                available_chargers.append(charger)

        return available_chargers

    except:
        return None

def str_to_datetime(given_datetime, given_format="%Y-%m-%d %H:%M:%S"):
    """Function that accepts a string and returns a datetime object
    that is aware of the DJANGO Timezone

    Args:
        given_datetime (str): The given str datetime
        given_format (str, optional): The format in which the str datetime is

    Returns:
        datetime or None: The aware datetime or None if the datetime is not in
            the expected format
    """
    try:
        return make_aware(datetime.strptime(given_datetime, given_format))
    except:
        return None
