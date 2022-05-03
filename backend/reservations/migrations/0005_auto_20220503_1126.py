# Generated by Django 3.2.13 on 2022-05-03 11:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0004_alter_reservation_vehicle_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='smart_vtg',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='state',
            field=models.CharField(choices=[('Charging', 'Charging'), ('Canceled', 'Canceled'), ('Success', 'Success'), ('Failure', 'Failure'), ('Reserved', 'Reserved')], default='', max_length=31),
        ),
    ]