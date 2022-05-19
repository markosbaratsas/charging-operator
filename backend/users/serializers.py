from rest_framework import serializers
from reservations.models import Owner
from users.models import MyUser


class RegistrationOperatorSerializer(serializers.ModelSerializer):
    """Registration serializer, used when a new operator is registered
    """
    password2 = serializers.CharField(style={'input_type': 'password'},
                                      write_only=True)

    class Meta:
        model = MyUser
        fields = ['username', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = MyUser(
            username=self.validated_data['username'],
            is_operator=True,
            is_owner=False
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({
                'password': 'Passwords should match.'
            })

        user.set_password(password)
        user.save()

        return user

class RegistrationOwnerSerializer(serializers.ModelSerializer):
    """Registration serializer, used when a new vehcile owner is registered
    """
    password2 = serializers.CharField(style={'input_type': 'password'},
                                      write_only=True)
    phone = serializers.CharField()
    name = serializers.CharField()

    class Meta:
        model = MyUser
        fields = ['username', 'password', 'password2', 'phone', 'name']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def save(self):
        user = MyUser(
            username=self.validated_data['username'],
            is_operator=False,
            is_owner=True
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({
                'password': 'Passwords should match.'
            })

        user.set_password(password)
        user.save()

        Owner.objects.create(
            name=self.validated_data['name'],
            phone=self.validated_data['phone'],
            user=user
        )

        return user
