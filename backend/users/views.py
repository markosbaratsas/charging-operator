from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.serializers import RegistrationSerializer

@api_view(['POST', ])
def register_user(request):
    serializer = RegistrationSerializer(data=request.data)
    data = {}
    if serializer.is_valid():
        user = serializer.save()
        data['response'] = 'Successfully created a new user.'
        data['username'] = user.username
        data['token'] = Token.objects.get(user=user).key
        return Response(data, status=status.HTTP_200_OK)
    else:
        data = serializer.errors
        return Response(data, status=status.HTTP_403_FORBIDDEN)

@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def delete_token(request):
    try:
        request.user.auth_token.delete()
    except (AttributeError, ObjectDoesNotExist):
        pass

    return Response(status=status.HTTP_200_OK)
