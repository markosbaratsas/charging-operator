from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from stations.useful_functions import (add_charger, add_pricing_group,
                                get_user_station)

from stations.models import Station
from stations.serializers import (DashboardStationSerializer,
                        StationInformationSerializer, StationMarkersSerializer)


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


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def create_station(request):
    """Create a new Station

    Returns:
        data, status: if successful returns a message that specifies success
            along with HTTP_200_OK status. If an error occurred it returns the
            the step in which the error occured, along with a
            HTTP_400_BAD_REQUEST status
    """

    if ('station' not in request.data
            or 'step1' not in request.data['station']
            or 'step2' not in request.data['station']
            or 'step3' not in request.data['station']):
        return Response({
                    "error": "step1, ste2, step3"
                },status=status.HTTP_400_BAD_REQUEST)

    # step1
    if ('name' not in request.data['station']['step1']
            or 'address' not in request.data['station']['step1']
            or 'latitude' not in request.data['station']['step1']
            or 'longitude' not in request.data['station']['step1']
            or 'phone' not in request.data['station']['step1']):
        return Response({
                    "error": "step1"
                },status=status.HTTP_400_BAD_REQUEST)

    station = Station.objects.create(
        name=request.data['station']['step1']['name'],
        address=request.data['station']['step1']['address'],
        latitude=request.data['station']['step1']['latitude'],
        longitude=request.data['station']['step1']['longitude'],
        phone=request.data['station']['step1']['phone']
    )
    station.operators.add(request.user)

    # step3
    if ('charger_groups' not in request.data['station']['step3']):
        return Response({
                    "error": "step3"
                },status=status.HTTP_400_BAD_REQUEST)

    pricing_groups = {}
    for group in request.data['station']['step3']['charger_groups']:
        new_group = add_pricing_group(group, station)
        if new_group == None:
            return Response({
                    "error": "step3"
                },status=status.HTTP_400_BAD_REQUEST)

        pricing_groups[new_group.name] = new_group

    # step2
    if ('chargers' not in request.data['station']['step2']):
        return Response({
                    "error": "step2"
                },status=status.HTTP_400_BAD_REQUEST)

    for charger in request.data['station']['step2']['chargers']:
        if (charger['charger_group'] not in pricing_groups):
            return Response({
                        "error": "step2"
                    },status=status.HTTP_400_BAD_REQUEST)

        this_chargers_group = pricing_groups[charger['charger_group']]
        if add_charger(charger, this_chargers_group) == None:
            return Response({
                        "error": "step2"
                    },status=status.HTTP_400_BAD_REQUEST)

    return Response({
            "success": "Successfully created a new station!"
        }, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_station(request):
    """Get Station information

    Returns:
        data, status: if successful returns station's information along with
            HTTP_200_OK status, else it returns an error message along with
            an HTTP_401_UNAUTHORIZED status
    """
    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    serializer = StationInformationSerializer(station)

    return Response(serializer.data, status=status.HTTP_200_OK)
