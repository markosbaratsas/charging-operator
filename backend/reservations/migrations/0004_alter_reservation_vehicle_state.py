# Generated by Django 3.2.13 on 2022-04-29 14:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0003_reservation_total_power_transmited'),
    ]

    operations = [
        migrations.AlterField(
            model_name='reservation',
            name='vehicle_state',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='reservations.vehiclestate'),
        ),
    ]
