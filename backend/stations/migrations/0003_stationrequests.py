# Generated by Django 3.2.13 on 2022-05-09 07:23

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('stations', '0002_station_location'),
    ]

    operations = [
        migrations.CreateModel(
            name='StationRequests',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('operator', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('station', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stations.station')),
            ],
        ),
    ]