# Generated by Django 3.2.13 on 2022-04-29 11:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0002_auto_20220429_1019'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='total_power_transmited',
            field=models.DecimalField(decimal_places=3, default=0, max_digits=7),
        ),
    ]