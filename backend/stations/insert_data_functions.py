from chargers.models import (Charger, MethodConstantBool, MethodConstantDecimal,
                             MethodConstantInt, MethodConstantStation,
                             PricingGroup)
from stations.models import Station


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

    for variable in group['pricing_method']['variables']:
        if variable['type'] == "int":
            MethodConstantInt.objects.create(
                pricing_group=this_group,
                name=variable['name'],
                value=int(variable['value'])
            )

        elif variable['type'] == "float":
            MethodConstantDecimal.objects.create(
                pricing_group=this_group,
                name=variable['name'],
                value=float(variable['value'])
            )

        elif variable['type'] == "bool":
            MethodConstantBool.objects.create(
                pricing_group=this_group,
                name=variable['name'],
                value=bool(variable['value'])
            )

        elif variable['type'] == "list_of_coordinates":
            for competitor in variable['value']:
                try:
                    this_station = Station.objects.get(id=int(competitor['id']))
                    MethodConstantStation.objects.create(
                        pricing_group=this_group,
                        name="competitor",
                        value=this_station
                    )
                except:
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
