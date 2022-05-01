from chargers.models import (Charger, MethodConstantBool, MethodConstantDecimal,
                             MethodConstantInt, MethodConstantStation,
                             PricingGroup)
from stations.models import Station


def add_pricing_group_constants(pricing_group, group_dict):
    """Add a PricingGroup's Constants

    Args:
        pricing_group (PricingGroup): The given PricingGroup object
        group_dict (dict): The given group dict

    Returns:
        bool: Return True if successful else False
    """
    for variable in group_dict['pricing_method']['variables']:
        if variable['type'] == "int":
            MethodConstantInt.objects.create(
                pricing_group=pricing_group,
                name=variable['name'],
                value=int(variable['value'])
            )

        elif variable['type'] == "float":
            MethodConstantDecimal.objects.create(
                pricing_group=pricing_group,
                name=variable['name'],
                value=float(variable['value'])
            )

        elif variable['type'] == "bool":
            MethodConstantBool.objects.create(
                pricing_group=pricing_group,
                name=variable['name'],
                value=bool(variable['value'])
            )

        elif variable['type'] == "list_of_coordinates":
            for competitor in variable['value']:
                try:
                    this_station = Station.objects.get(id=int(competitor['id']))
                    MethodConstantStation.objects.create(
                        pricing_group=pricing_group,
                        name=variable['name'],
                        value=this_station
                    )
                except:
                    return False

    return True


def add_pricing_group(group, station):
    """Add a PricingGroup to the database along with its Constants

    Args:
        group (dict): The given group dict
        station (stations.models.Station): The station in which the group is to
            be added

    Returns:
        PricingGroup or None: Return the created PricingGroup if created
            successfully, else None if an error occurred
    """

    if ('pricing_method' not in group or 'name' not in group
            or 'name' not in group['pricing_method']
            or 'variables' not in group['pricing_method']):
        return None

    this_group = PricingGroup.objects.create(
        station=station,
        name=group['name'],
        method_name=group['pricing_method']['name']
    )

    if not add_pricing_group_constants(this_group, group):
        return None

    return this_group


def add_charger(charger, group):
    """Create a new Charger

    Args:
        charger (dict): The given charger dict
        group (PricingGroup): The ChargingGroup in which the charger belongs

    Returns:
        Charger or None: Return the created Charger if created successfully,
            else None if an error occurred
    """
    
    if ('charger_name' not in charger
            or 'connector_type' not in charger
            or 'power' not in charger
            or 'current' not in charger):
        return None
    
    charger = Charger.objects.create(
        name=charger['charger_name'],
        connector_type=charger['connector_type'],
        power=charger['power'],
        current=charger['current'],
        pricing_group=group
    )
    return charger


def get_user_station(user, station_id):
    try:
        station = Station.objects.get(id=station_id)
        if user not in station.operators.all():
            return None
        return station

    except:
        return None
