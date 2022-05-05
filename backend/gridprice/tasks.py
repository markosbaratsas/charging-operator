from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import datetime, timedelta
from django.utils.timezone import make_aware
import requests

from charging_operator.settings import FINGRID_API_URL, FINGRID_X_API_KEY
from gridprice.models import GridPrice, Location


@shared_task(name='get_fingrid_prices')
def get_fingrid_prices():
    now = make_aware(datetime.now())
    now_str = now.strftime("%Y-%m-%dT%H:%M:%SZ")

    ago_3_days = now - timedelta(days=3)
    ago_3_days_str = ago_3_days.strftime("%Y-%m-%dT%H:%M:%SZ")

    response = requests.get(FINGRID_API_URL, headers={
        "x-api-key": FINGRID_X_API_KEY
    }, params={
        "start_time": ago_3_days_str,
        "end_time": now_str,
        "response_timezone": "+03:00"
    })

    grid_prices = response.json()

    for i in grid_prices:
        start_time = make_aware(datetime.strptime(i["start_time"],
                                                  "%Y-%m-%dT%H:%M:%S+0300"))
        end_time = make_aware(datetime.strptime(i["end_time"],
                                                "%Y-%m-%dT%H:%M:%S+0300"))
        value = float(i["value"])
        
        print(value, start_time, end_time)
        
        location, _ = Location.objects.get_or_create(
            name="Finland"
        )
        
        if value != 0:
            _, created = GridPrice.objects.get_or_create(
                location=location,
                start_time=start_time,
                end_time=end_time,
                price=value
            )
            
            if not created:
                print("already exists:")
            else:
                print("added")
                
        else:
            print("not_adding")
