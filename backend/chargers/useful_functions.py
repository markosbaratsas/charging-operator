from random import random
from unicodedata import name

from chargers.models import Charger, MethodConstantBool, MethodConstantDecimal, MethodConstantInt, MethodConstantStation, PricingGroup


def get_grid_price():
    """Return grid price. For the time being, return a random number, but we
    could hit an external API that would provide us this data.
    
    TODO: Hit external API and use caching in some way
    """
    return 0.123


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


def competitor_method_get_min(group):
    """Get all_expenses + c1 for a a group that used competitor-centered profit
    
    Args:
        group (PricingGroup): The given group
    
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
            price += get_grid_price()
        
        price += float(all_expenses.value) + float(c1.value)
    except:
        print("Something is wrong in competitor_method_get_min")
        return -1

    return price
    


def get_charging_price(group, set_groups):
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
                ret += get_grid_price()

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

            occupied = get_occupied_chargers(group)
            all_chargers = get_all_chargers(group)

            if grid_price.value:
                ret += get_grid_price()

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
                            get_charging_price(this_group, set_groups)
                        )
                    else:   
                        # Avoid infinite loops
                        min_competitor_price = min(
                            min_competitor_price,
                            competitor_method_get_min(this_group)
                        )
                
            ret += max(competitor_method_get_min(group),
                      min_competitor_price + float(c2.value))

    except:
        print("Something is wrong in get_charging_price")
        return -1.0

    return round(ret, 5)
    

    
