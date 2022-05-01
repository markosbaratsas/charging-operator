from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from reservations.models import Reservation
from reservations.serializers import ReservationSerializer, VehiclesChargingNowSerializer
from reservations.useful_functions import validate_dates
from stations.useful_functions import get_user_station


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_vehicle_states(request):
    """Get Vehicle States

    Returns:
        data, status: if successful returns VehicleStates along with
            an HTTP_200_OK status, else it returns an error message along
            with an HTTP_401_UNAUTHORIZED status
    """
    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    reservations = Reservation.objects.filter(station=station,
                                              state='Charging')
    vehicle_states = []
    for i in reservations:
        if i.vehicle_state:
            vehicle_states.append(i.vehicle_state)

    serializer = VehiclesChargingNowSerializer(vehicle_states, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_reservations(request):
    """Get Reservations of a station, for a specific period specified in
    request data

    Returns:
        data, status: if successful returns requested Reservations along with
            an HTTP_200_OK status, else it returns an error message along
            with an HTTP_401_UNAUTHORIZED status
    """
    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    from_datetime = request.data["from"]
    to_datetime = request.data["to"]

    # validate that dates have the expected format
    validate_dates(from_datetime, "%Y-%m-%d %H:%M:%S")
    validate_dates(to_datetime, "%Y-%m-%d %H:%M:%S")

    reservations = Reservation.objects.filter(
                                station=station,
                                state='Charging',
                                expected_arrival__range=[from_datetime,
                                                         to_datetime])
    serializer = ReservationSerializer(reservations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
