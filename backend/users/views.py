from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from charging_operator.settings import DEFAULT_FROM_EMAIL, EMAIL_TO
from users.body_parameters import AUTHENTICATION_HEADER
from users.decorators import operator_required, owner_required
from users.serializers import (RegistrationOperatorSerializer,
                               RegistrationOwnerSerializer)


@swagger_auto_schema(
    methods=['POST'],
    responses={
        200: RegistrationOperatorSerializer,
        403: 'Registration Failed'
    }
)
@api_view(['POST', ])
def register_operator(request):
    """Register a user (operator or owner)

    Returns:
        Response: Status HTTP_200_OK if registration is successful, else
            returns HTTP_403_FORBIDDEN
    """
    if 'owner' in request.data:
        serializer = RegistrationOwnerSerializer(data=request.data)
    else:
        serializer = RegistrationOperatorSerializer(data=request.data)

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
    """Logout a user by deleting the token from the database

    Returns:
        Response: Status HTTP_200_OK if user was logged in and logout is
            successful, else returns HTTP_401_UNAUTHORIZED
    """
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
@operator_required
def validate_token_operator(_):
    """Endpoint used to validate that a user's token is actually valid
    and that this user is an operator

    Returns:
        Response: Status HTTP_200_OK if token is valid, else
            returns HTTP_401_UNAUTHORIZED
    """
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
@owner_required
def validate_token_owner(_):
    """Endpoint used to validate that a user's token is actually valid
    and that this user is an owner

    Returns:
        Response: Status HTTP_200_OK if token is valid, else
            returns HTTP_401_UNAUTHORIZED
    """
    return Response(status=status.HTTP_200_OK)


@api_view(['POST', ])
def contact(request):
    """Endpoint ot be used by frontend when a form is submitted
    """
    send_mail(
        'Charging Operator - Contact Form',
        f"""
        Email: {request.data["email"]}

        Fullname: {request.data["fullname"]}

        Message: {request.data["message"]}

        """,
        DEFAULT_FROM_EMAIL,
        [EMAIL_TO],
        fail_silently=False,
    )
    return Response(status=status.HTTP_200_OK)
