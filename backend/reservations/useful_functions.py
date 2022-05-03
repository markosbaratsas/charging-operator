from datetime import datetime
from django.db.models import Q
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
        from_datetime (str): The given from datetime
        to_datetime (str): The given to datetime

    Returns:
        list of Chargers or None: if successful return the available chargers,
            else if an error occurs return None
    """
    # validate that dates have the expected format
    validate_dates(from_datetime, "%Y-%m-%d %H:%M:%S")
    validate_dates(to_datetime, "%Y-%m-%d %H:%M:%S")

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
