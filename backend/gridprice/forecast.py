from datetime import timedelta

from gridprice.models import GridPrice


def simple_forecast(start, end):
    """Function to return a simple forecast regarding the average price of a
    datetime period. It simply finds the average of the prices for every hour
    of the most recent days, and then based on the given period it returns the
    average price for all the hours of this day.

    Args:
        start (datetime): the given start datetime
        end (datetime): the given end datetime

    Returns:
        float: the predicted price
    """
    # get the most recent prices from the past 2 days
    latest_prices = GridPrice.objects.all().order_by("-start_time")[:48]

    # 24 hours in a day
    times = {i: 0.0 for i in range(24)}

    for price in latest_prices:
        hour = price.end_time.hour
        if hour not in times.keys():
            continue

        times[price.end_time.hour] += float(price.get_kw_price())

    for key in times.keys():
        times[key] /= 2

    # now in times[i] we have the average price of the past 2 days in the
    # i'th hour

    if start == end:
        return times[start.hour]

    mean_forecasted_price = 0
    counter = start
    while counter < end:
        mean_forecasted_price += times[counter.hour]
        counter += timedelta(hours=1)

    hours = ((end - start).total_seconds())//3600

    return mean_forecasted_price / hours
