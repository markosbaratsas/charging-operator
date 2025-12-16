from django.core.exceptions import ObjectDoesNotExist
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from charging_operator.settings import (DEFAULT_FROM_EMAIL, EMAIL_TO,
                                        GOOGLE_CREDENTIALS_FILE_PATH)
from charging_operator.send_email import send_email
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
    if request.data == None: 
        return Response(status=status.HTTP_400_BAD_REQUEST)

    form_potential_fields = [
        'email',
        'fullname',
        'message',
        'first_name',
        'last_name',
        'business_name',
        'business_category',
        'location',
        'expected_number_of_reservations_per_day',
        'phone',
        'notes',
    ]
    text_content = ''
    for form_item in form_potential_fields:
        if form_item in request.data:
            text_content += f'\nEmail: {request.data[form_item]}\n'

    subject = 'Charging Operator - Contact Form'
    if  "email_subject" in request.data:
        subject = request.data["email_subject"]

    send_email(
        credentials_file=GOOGLE_CREDENTIALS_FILE_PATH,
        subject=subject,
        from_email=DEFAULT_FROM_EMAIL,
        to=[EMAIL_TO],
        bcc=[],
        text_content=text_content,
        reply_to=[],
    )
    return Response(status=status.HTTP_200_OK)
