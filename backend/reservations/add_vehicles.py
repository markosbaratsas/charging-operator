# to run the script: python3 manage.py shell < reservations/add_vehicles.py


import json

from charging_operator.settings import BASE_DIR
from reservations.models import Model


with open(str(str(BASE_DIR) + "/reservations/ev_vehicles.json")) as f:
    vehicles = json.load(f)

for vehicle in vehicles:
    Model.objects.get_or_create(
        name=vehicle['model'],
        manufacturer=vehicle['company'],
        battery_capacity=vehicle['battery_capacity']
    )
