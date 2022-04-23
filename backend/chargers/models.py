from django.db import models


class PricingGroup(models.Model):
    class MethodName(models.TextChoices):
        """These are the possible pricing methods supported
        """
        FIXED_PRICE = 'Fixed Price'
        FIXED_PROFIT = 'Fixed Profit'
        DEMAND = 'Demand-centered Profit'
        COMPETITORS = 'Competitor-centered Profit'

    id = models.AutoField(primary_key=True)
    method_name = models.CharField(max_length=31, default='',
                                    choices=MethodName.choices)
    description = models.CharField(max_length=255, default='')

    def __str__(self):
        return f'{self.id}, {self.method_name}'


class MethodConstantInt(models.Model):
    id = models.AutoField(primary_key=True)
    pricing_group = models.ForeignKey(PricingGroup, on_delete=models.CASCADE)
    name = models.CharField(max_length=31, default='')
    value = models.IntegerField(default=0)

    def __str__(self):
        return f'{self.id}, {self.pricing_group}, {self.name},\
{str(self.value)}'


class MethodConstantDecimal(models.Model):
    id = models.AutoField(primary_key=True)
    pricing_group = models.ForeignKey(PricingGroup, on_delete=models.CASCADE)
    name = models.CharField(max_length=31, default='')
    value = models.DecimalField(max_digits=8, decimal_places=5, default=0)

    def __str__(self):
        return f'{self.id}, {self.pricing_group}, {self.name},\
{str(self.value)}'


class MethodConstantBool(models.Model):
    id = models.AutoField(primary_key=True)
    pricing_group = models.ForeignKey(PricingGroup, on_delete=models.CASCADE)
    name = models.CharField(max_length=31, default='')
    value = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.id}, {self.pricing_group}, {self.name},\
{str(self.value)}'


class MethodConstantPricingGroup(models.Model):
    id = models.AutoField(primary_key=True)
    pricing_group = models.ForeignKey(PricingGroup, on_delete=models.CASCADE,
                                      related_name='pricing_group')
    name = models.CharField(max_length=31, default='')
    value = models.ForeignKey(PricingGroup, on_delete=models.CASCADE,
                              related_name='value')

    def __str__(self):
        return f'{self.id}, {self.pricing_group}, {self.name},\
{str(self.value)}'


class Charger(models.Model):
    class Current(models.TextChoices):
        """These are the possible pricing methods supported
        """
        DC = 'DC'
        AC = 'AC'

    id = models.AutoField(primary_key=True)
    pricing_group = models.ForeignKey(PricingGroup, on_delete=models.CASCADE)
    name = models.CharField(max_length=31, default='')
    type = models.CharField(max_length=63, default='')
    current = models.CharField(max_length=63, default='',
                                    choices=Current.choices)
    power = models.DecimalField(max_digits=8, decimal_places=4, default=0)
    description = models.CharField(max_length=255, default='')
    is_occupied = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.id}, {self.name}, {self.pricing_group}'
