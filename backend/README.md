# Charging Operator Backend

## Technologies used:
* Django
* Django REST Framework
* Django Celery Beat for periodic fetching of Grid Price
* Redis as the message broker for Celery

### How to set up Django Celery Beat

```
celery -A charging_operator beat -l info --logfile=celery.beat.log --detach
celery -A charging_operator worker -l info --logfile=celery.log --detach
```
