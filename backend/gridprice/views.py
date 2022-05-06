from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from gridprice.models import GridPrice, Location
from gridprice.serializers import GridPriceSerializer, LocationSerializer
from gridprice.useful_functions import get_location
from reservations.useful_functions import str_to_datetime


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
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


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
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


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_locations(_):
    """Get locations

    Returns:
        data, status: returns a list with the locations along with HTTP_200_OK
            status
    """
    locations = Location.objects.all()
    serializer = LocationSerializer(locations, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
