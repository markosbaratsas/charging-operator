from chargers.models import (Charger, MethodConstantBool,
                             MethodConstantDecimal, MethodConstantInt,
                             MethodConstantStation, PricingGroup)
from gridprice.useful_functions import get_grid_price
from reservations.useful_functions import get_station_available_chargers


def get_occupied_chargers(group):
    """Get occupied chargers of a PricingGroup
    
    Args:
        group (PricingGroup): The given group to look into
    
    Returns:
        int: the number of occupied chargers
    """
    return int(Charger.objects.filter(pricing_group=group, is_occupied=True).\
                            count())


def get_all_chargers(group):
    """Get occupied chargers of a PricingGroup
    
    Args:
        group (PricingGroup): The given group to look into
    
    Returns:
        int: the number of occupied chargers
    """
    return int(Charger.objects.filter(pricing_group=group).count())


def competitor_method_get_min(group, from_datetime, to_datetime):
    """Get all_expenses + c1 for a a group that used competitor-centered profit
    
    Args:
        group (PricingGroup): The given group
        from_datetime (datetime): the given from datetime
        to_datetime (datetime): the given to datetime
    
    Returns:
        float: (all_expenses + c1) price
    """
    price = 0
    try:
        all_expenses = MethodConstantDecimal.objects.\
                                    filter(pricing_group=group,
                                            name="all_expenses")[0]
        grid_price = MethodConstantBool.objects.\
                                    filter(pricing_group=group)[0]
        c1 = MethodConstantDecimal.objects.filter(pricing_group=group,
                                                    name="c1")[0]

        if grid_price.value:
            price += get_grid_price(from_datetime, to_datetime,
                                    group.station.location)

        price += float(all_expenses.value) + float(c1.value)
    except:
        print("Something is wrong in competitor_method_get_min")
        return -1

    return price
    


def get_charging_price(group, set_groups, from_datetime, to_datetime):
    """Return the charging price of a PricingGroup

    TODO: Find a way to cache those results... Given the fact that grid price
        is changing periodically, those prices do not change unless the grid
        price change.

    Args:
        group (PricingGroup): The PricingGroup of which we want to find the
            price
        set_groups (set of PricingGroups): a set of groups, we have already
            visited. It is used so as to avoid infinite loops in
            `Competitor-centered Profit`
        from_datetime (datetime): the given from datetime
        to_datetime (datetime): the given to datetime

    Returns:
        float: The price of this PricingGroup
    """
    set_groups.add(group)
    ret = 0

    try:
        if group.method_name == "Fixed Price":
            c = MethodConstantDecimal.objects.filter(pricing_group=group)[0]
            ret += float(c.value)

        elif group.method_name == "Fixed Profit":
            c = MethodConstantDecimal.objects.filter(pricing_group=group,
                                                     name="c")[0]
            all_expenses = MethodConstantDecimal.objects.\
                                        filter(pricing_group=group,
                                               name="all_expenses")[0]
            grid_price = MethodConstantBool.objects.\
                                        filter(pricing_group=group)[0]

            if grid_price.value:
                ret += get_grid_price(from_datetime, to_datetime,
                                      group.station.location)

            ret += float(all_expenses.value) + float(c.value)

        elif group.method_name == "Demand-centered Profit":
            all_expenses = MethodConstantDecimal.objects.\
                                        filter(pricing_group=group,
                                               name="all_expenses")[0]
            grid_price = MethodConstantBool.objects.\
                                        filter(pricing_group=group)[0]
            c1 = MethodConstantDecimal.objects.filter(pricing_group=group,
                                                     name="c1")[0]
            c2 = MethodConstantDecimal.objects.filter(pricing_group=group,
                                                     name="c2")[0]
            n = MethodConstantInt.objects.filter(pricing_group=group,
                                                 name="n")[0]

            available_chargers = int(len(get_station_available_chargers(
                                                group.station,
                                                from_datetime,
                                                to_datetime)))
            all_chargers = get_all_chargers(group)
            occupied = all_chargers - available_chargers

            if grid_price.value:
                ret += get_grid_price(from_datetime, to_datetime,
                                      group.station.location)

            ret += (float(all_expenses.value) + float(c1.value)
                        + float(c2.value) * ((occupied) ** int(n.value))/all_chargers)

        elif group.method_name == "Competitor-centered Profit":

            all_expenses = MethodConstantDecimal.objects.\
                                        filter(pricing_group=group,
                                               name="all_expenses")[0]
            grid_price = MethodConstantBool.objects.\
                                        filter(pricing_group=group)[0]
            c1 = MethodConstantDecimal.objects.filter(pricing_group=group,
                                                     name="c1")[0]
            c2 = MethodConstantDecimal.objects.filter(pricing_group=group,
                                                     name="c2")[0]
            competitors = MethodConstantStation.objects.\
                                filter(pricing_group=group)

            min_competitor_price = 100000.0
            for competitor in competitors:
                station = competitor.value
                groups = PricingGroup.objects.filter(station=station)
                
                for this_group in groups:
                    if this_group not in set_groups:
                        min_competitor_price = min(
                            min_competitor_price,
                            get_charging_price(this_group, set_groups,
                                               from_datetime, to_datetime)
                        )
                    else:   
                        # Avoid infinite loops
                        min_competitor_price = min(
                            min_competitor_price,
                            competitor_method_get_min(this_group,
                                                      from_datetime,
                                                      to_datetime)
                        )
                
            ret += max(competitor_method_get_min(group,
                                                 from_datetime,
                                                 to_datetime),
                      min_competitor_price + float(c2.value))

    except:
        print("Something is wrong in get_charging_price")
        return -1.0

    return round(ret, 5)


def update_existing_charger(charger, charger_dict):
    """Update a given Charger

    Args:
        charger (Charger): The Charger object
        charger_dict (dict): The given charger dict

    Returns:
        bool: True if successful update else False
    """
    
    if ('charger_name' not in charger_dict
            or 'connector_type' not in charger_dict
            or 'power' not in charger_dict
            or 'current' not in charger_dict):
        return False

    # TODO: Add extra checks to validate given input

    try:
        charger.name = str(charger_dict['charger_name'])
        charger.connector_type = str(charger_dict['connector_type'])
        charger.power = float(charger_dict['power'])
        charger.current = str(charger_dict['current'])
        charger.save()
    except:
        return False

    return True
