from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from gridprice.models import GridPrice, Location
from gridprice.serializers import GridPriceSerializer, LocationSerializer
from gridprice.useful_functions import get_location
from reservations.useful_functions import str_to_datetime
from users.body_parameters import AUTHENTICATION_HEADER
from users.decorators import operator_required


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'start_time', 'end_time', 'location_id'],
        properties={
            'station_id': openapi.TYPE_INTEGER,
            'start_time': openapi.TYPE_STRING,
            'end_time': openapi.TYPE_STRING,
            'location_id': openapi.TYPE_INTEGER,
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: GridPriceSerializer,
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def get_grid_prices(request):
    """Get grid prices that exist on the database, for a specific datetime
    period specified in the start_time and end_time in `request.data`.
    
    specific station with station_id, or for a specific location with a
    location_id.

    Returns:
        data, status: if successful returns a message that specifies success
            along with HTTP_200_OK status. If an error occurred it returns the
            the step in which the error occured, along with a
            HTTP_400_BAD_REQUEST status
    """
    if ('start_time' not in request.data
            or 'end_time' not in request.data
            or ('station_id' not in request.data
            and 'location_id' not in request.data)):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    location = get_location(request)
    if location == None:
        return Response({
                "error": "Location id is not valid"
            }, status=status.HTTP_400_BAD_REQUEST)

    start_time = str_to_datetime(request.data['start_time'])
    end_time = str_to_datetime(request.data['end_time'])

    if start_time == None or end_time == None:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    prices = GridPrice.objects.filter(
        location=location,
        start_time__gte=start_time,
        end_time__lte=end_time,
    )

    serializer = GridPriceSerializer(prices, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'amount', 'location_id'],
        properties={
            'station_id': openapi.TYPE_INTEGER,
            'amount': openapi.TYPE_INTEGER,
            'location_id': openapi.TYPE_INTEGER,
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: GridPriceSerializer,
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def get_recent_prices(request):
    """Get the most recent grid prices that exist on the database, for a
    specific station with station_id, or for a specific location with a
    location_id.

    Returns:
        data, status: if successful returns a message that specifies success
            along with HTTP_200_OK status. If an error occurred it returns the
            the step in which the error occured, along with a
            HTTP_400_BAD_REQUEST status
    """
    if ('amount' not in request.data
            or ('station_id' not in request.data
            and 'location_id' not in request.data)):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)
    
    location = get_location(request)
    if location == None:
        return Response({
                "error": "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

    amount = int(request.data['amount'])
    prices = list(GridPrice.objects.filter(location=location)\
                                   .order_by("-start_time")[:amount])
    prices.reverse()

    serializer = GridPriceSerializer(prices, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: LocationSerializer,
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def get_locations(_):
    """Get locations

    Returns:
        data, status: returns a list with the locations along with HTTP_200_OK
            status
    """
    locations = Location.objects.all()
    serializer = LocationSerializer(locations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
