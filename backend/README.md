# Charging Operator Backend

## Technologies used:
* Django
* Django REST Framework
* Django Celery Beat for periodic fetching of Grid Price
* Redis as the message broker for Celery

### How to set up Django Celery Beat

```
# redis
redis-server --daemonize yes

# check redis is ok
redis-cli ping

# start celery beat and workers
celery -A charging_operator beat -l info --logfile=celery.beat.log --detach
celery -A charging_operator worker -l info --logfile=celery.log --detach
```

To restart celery:
```
# kill all celery processes
kill -9 $(ps aux | grep celery | grep -v grep | awk '{print $2}' | tr '\n'  ' ')

# and then run again the commands to start celery beat and workers
```
