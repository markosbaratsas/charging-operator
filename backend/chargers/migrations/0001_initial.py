# Generated by Django 3.2.13 on 2022-04-25 17:20

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('stations', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PricingGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('method_name', models.CharField(choices=[('Fixed Price', 'Fixed Price'), ('Fixed Profit', 'Fixed Profit'), ('Demand-centered Profit', 'Demand'), ('Competitor-centered Profit', 'Competitors')], default='', max_length=31)),
                ('description', models.CharField(default='', max_length=255)),
                ('station', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='stations.station')),
            ],
        ),
        migrations.CreateModel(
            name='MethodConstantPricingGroup',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=31)),
                ('pricing_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pricing_group', to='chargers.pricinggroup')),
                ('value', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='value', to='chargers.pricinggroup')),
            ],
        ),
        migrations.CreateModel(
            name='MethodConstantInt',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=31)),
                ('value', models.IntegerField(default=0)),
                ('pricing_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chargers.pricinggroup')),
            ],
        ),
        migrations.CreateModel(
            name='MethodConstantDecimal',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=31)),
                ('value', models.DecimalField(decimal_places=5, default=0, max_digits=8)),
                ('pricing_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chargers.pricinggroup')),
            ],
        ),
        migrations.CreateModel(
            name='MethodConstantBool',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=31)),
                ('value', models.BooleanField(default=True)),
                ('pricing_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chargers.pricinggroup')),
            ],
        ),
        migrations.CreateModel(
            name='Charger',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(default='', max_length=31)),
                ('type', models.CharField(default='', max_length=63)),
                ('current', models.CharField(choices=[('DC', 'Dc'), ('AC', 'Ac')], default='', max_length=63)),
                ('power', models.DecimalField(decimal_places=4, default=0, max_digits=8)),
                ('description', models.CharField(default='', max_length=255)),
                ('is_occupied', models.BooleanField(default=False)),
                ('pricing_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chargers.pricinggroup')),
            ],
        ),
    ]
