# Generated by Django 3.2.13 on 2022-04-29 10:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('stations', '0001_initial'),
        ('reservations', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='owner',
            name='email',
            field=models.EmailField(default='', max_length=31),
        ),
        migrations.AddField(
            model_name='owner',
            name='phone',
            field=models.CharField(default='', max_length=15),
        ),
        migrations.AddField(
            model_name='reservation',
            name='station',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='stations.station'),
        ),
    ]