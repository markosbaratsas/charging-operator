from django.core.exceptions import ObjectDoesNotExist
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.body_parameters import AUTHENTICATION_HEADER
from users.serializers import RegistrationSerializer


@swagger_auto_schema(
    methods=['POST'],
    responses={
        200: RegistrationSerializer,
        403: 'Registration Failed'
    }
)
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


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def delete_token(request):
    try:
        request.user.auth_token.delete()
    except (AttributeError, ObjectDoesNotExist):
        pass

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def validate_token(_):
    """Endpoint used to validate that a user's token is actually valid

    Returns:
        Ressponse: Status HTTP_200_OK if token is valid, else
            returns HTTP_401_UNAUTHORIZED
    """
    return Response(status=status.HTTP_200_OK)
