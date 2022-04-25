from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from stations.models import Station
from stations.serializers import (DashboardStationSerializer,
                        StationMarkersSerializer)


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_stations(request):
    """Return stations that belong to a user, along with some information
    regarding occupied and non-occupied chargers

    Returns:
        data, status: if successful returns a list of stations, with an
            HTTP_200_OK status
    """
    stations = Station.objects.filter(operators__id=request.user.id)
    serializer = DashboardStationSerializer(stations, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_station_markers(_):
    """Return stations markers, to be rendered on map

    Returns:
        data, status: if successful returns a list of station markers, with an
            HTTP_200_OK status
    """
    stations = Station.objects.all()
    serializer = StationMarkersSerializer(stations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def add_station(request):
    """Add an operator to a station

    Returns:
        data, status: if successful returns a list of station markers, with an
            HTTP_200_OK status
    """
    given_id = int(request.data['station_id'])
    try:
        station = Station.objects.get(id=given_id)
    except:
        return Response(data={
            "error": "No station with this id"
        }, status=status.HTTP_406_NOT_ACCEPTABLE)

    station.operators.add(request.user)
    station.save()

    return Response(status=status.HTTP_200_OK)
