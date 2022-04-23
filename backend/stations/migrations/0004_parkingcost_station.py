# Generated by Django 3.2.13 on 2022-04-23 17:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('stations', '0003_station_pricing_groups'),
    ]

    operations = [
        migrations.AddField(
            model_name='parkingcost',
            name='station',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='stations.station'),
            preserve_default=False,
        ),
    ]