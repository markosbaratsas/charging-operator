from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from chargers.models import Charger

from chargers.serializers import ChargerReservationSerializer
from chargers.useful_functions import get_charging_price
from reservations.models import Owner, Reservation, Vehicle, VehicleState
from reservations.serializers import (ReservationSerializer,
                                      VehiclesChargingNowSerializer)
from reservations.useful_functions import (get_station_available_chargers,
                                           str_to_datetime,
                                           validate_dates)
from stations.useful_functions import (calculate_parking_cost,
                                       find_parking_costs, get_user_station)
from users.body_parameters import AUTHENTICATION_HEADER


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id'],
        properties={
            'station_id': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: VehiclesChargingNowSerializer,
        401: 'Not Authorized'
    }
)
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


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id'],
        properties={
            'station_id': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: VehiclesChargingNowSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_vehicle_state(request):
    """Get Vehicle States

    Returns:
        data, status: if successful returns VehicleStates along with
            an HTTP_200_OK status, else it returns an error message along
            with an HTTP_401_UNAUTHORIZED status
    """
    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this Vehicle State"
            }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        vehicle_state = VehicleState.objects.get(
                                id=request.data["vehicle_state_id"])
        if (vehicle_state.charger.pricing_group.station != station):
            return Response({
                    "error": "You do not have access to this Vehicle State"
                }, status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({
                "error": "You do not have access to this Vehicle State"
            }, status=status.HTTP_401_UNAUTHORIZED)

    serializer = VehiclesChargingNowSerializer(vehicle_state)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id'],
        properties={
            'station_id': openapi.TYPE_STRING,
            'from_arrival': openapi.TYPE_STRING,
            'to_arrival': openapi.TYPE_STRING,
            'from_departure': openapi.TYPE_STRING,
            'to_departure': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: ReservationSerializer,
        400: 'Invalid Format',
        401: 'Not Authorized'
    }
)
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

    from_arrival = str_to_datetime("2000-01-01 00:00:00")
    to_arrival = str_to_datetime("2100-01-01 00:00:00")
    from_departure = str_to_datetime("2000-01-01 00:00:00")
    to_departure = str_to_datetime("2100-01-01 00:00:00")

    if "from_arrival" in request.data:
        from_arrival = str_to_datetime(request.data["from_arrival"])

    if "to_arrival" in request.data:
        to_arrival = str_to_datetime(request.data["to_arrival"])

    if "from_departure" in request.data:
        from_departure = str_to_datetime(request.data["from_departure"])

    if "to_departure" in request.data:
        to_departure = str_to_datetime(request.data["to_departure"])


    # validate that dates have the expected format
    if (from_arrival == None or to_arrival == None
            or from_departure == None or to_departure == None):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    if "states" in request.data:
        reservations = Reservation.objects.filter(
                                    station=station,
                                    state__in=request.data["states"],
                                    expected_arrival__range=[from_arrival,
                                                            to_arrival],
                                    expected_departure__range=[from_departure,
                                                            to_departure])
    else:
        reservations = Reservation.objects.filter(
                                    station=station,
                                    expected_arrival__range=[from_arrival,
                                                            to_arrival],
                                    expected_departure__range=[from_departure,
                                                            to_departure]).\
                                    order_by('expected_departure')

    serializer = ReservationSerializer(reservations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'arrival_time', 'departure_time'],
        properties={
            'station_id': openapi.TYPE_STRING,
            'arrival_time': openapi.TYPE_STRING,
            'departure_time': openapi.TYPE_STRING,
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: ChargerReservationSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_available_chargers(request):
    """Get available chargers based on reservations made on this charger

    Returns:
        data, status: if successful returns available chargers along with
            an HTTP_200_OK status, else it returns an error message along
            with an error status
    """
    station = get_user_station(request.user, request.data["station_id"])
    arrival_time = str_to_datetime(request.data["arrival_time"])
    departure_time = str_to_datetime(request.data["departure_time"])

    if station == None or arrival_time == None or departure_time == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    available_chargers = get_station_available_chargers(station,
                                                        arrival_time,
                                                        departure_time)

    serializer = ChargerReservationSerializer(
        available_chargers,
        many=True,
        context={
            'arrival_time': arrival_time,
            'departure_time': departure_time,
        }
    )

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['reservation'],
        properties={
            'reservation': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def create_reservation(request):
    """Create a new Reservation

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an error message along with an error status
    """
    if 'reservation' not in request.data:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    reservation_dict = request.data["reservation"]

    station = get_user_station(request.user, reservation_dict["station_id"])
    arrival_time = str_to_datetime(reservation_dict["arrival_time"])
    departure_time = str_to_datetime(reservation_dict["departure_time"])

    if station == None or arrival_time == None or departure_time == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    available_chargers = set(get_station_available_chargers(station,
                                                            arrival_time,
                                                            departure_time))
    if available_chargers == None:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    try:
        charger = Charger.objects.get(id=int(reservation_dict["charger_id"]))
    except:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    if charger not in available_chargers:
        return Response({
                "error": "This charger is not available"
            }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # TODO: Perform better checks in given input
        owner = Owner.objects.create(
            name=reservation_dict["owner_name"],
            phone="6912345678"
        )
        vehicle = Vehicle.objects.create(
            owner=owner,
            name=reservation_dict["vehicle_name"],
            model=reservation_dict["vehicle_model"],
            license_plate=reservation_dict["vehicle_license_plate"]
        )
        Reservation.objects.create(
            vehicle=vehicle,
            charger=charger,
            station=station,
            vehicle_state=None,
            expected_arrival=arrival_time,
            actual_arrival=arrival_time,
            expected_departure=departure_time,
            actual_departure=departure_time,
            state="Reserved",
            price_per_kwh=get_charging_price(charger.pricing_group,
                                            set(),
                                            arrival_time,
                                            departure_time),
            smart_vtg=reservation_dict["smart_vtg"]
        )

    except:
        return Response({
                "error": "Something went wrong on reservation creation"
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['reservation'],
        properties={
            'reservation': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def update_reservation(request):
    """Update an existing Reservation

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an error message along with an error status
    """
    if 'reservation' not in request.data:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    reservation_dict = request.data["reservation"]

    station = get_user_station(request.user, reservation_dict["station_id"])
    arrival_time = str_to_datetime(reservation_dict["arrival_time"])
    departure_time = str_to_datetime(reservation_dict["departure_time"])

    if station == None or arrival_time == None or departure_time == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        r = Reservation.objects.get(id=reservation_dict["reservation_id"])
        r.delete()
    except:
        return Response({
                "error": "Something went wrong on reservation update 1"
            }, status=status.HTTP_401_UNAUTHORIZED)

    available_chargers = set(get_station_available_chargers(station,
                                                            arrival_time,
                                                            departure_time))

    try:
        charger = Charger.objects.get(id=int(reservation_dict["charger_id"]))
    except:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    if charger not in available_chargers:
        return Response({
                "error": "This charger is not available"
            }, status=status.HTTP_400_BAD_REQUEST)

    try:
        # TODO: Perform better checks in given input
        owner = Owner.objects.create(
            name=reservation_dict["owner_name"]
        )
        vehicle = Vehicle.objects.create(
            owner=owner,
            name=reservation_dict["vehicle_name"],
            model=reservation_dict["vehicle_model"],
            license_plate=reservation_dict["vehicle_license_plate"]
        )
        Reservation.objects.create(
            vehicle=vehicle,
            charger=charger,
            station=station,
            vehicle_state=None,
            expected_arrival=arrival_time,
            actual_arrival=arrival_time,
            expected_departure=departure_time,
            actual_departure=departure_time,
            state="Reserved",
            price_per_kwh=get_charging_price(charger.pricing_group,
                                            set(),
                                            arrival_time,
                                            departure_time),
            smart_vtg=reservation_dict["smart_vtg"]
        )

    except:
        return Response({
                "error": "Something went wrong on reservation update 2"
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'reservation_id'],
        properties={
            'station_id': openapi.TYPE_STRING,
            'reservation_id': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def delete_reservation(request):
    """Delete an existing Reservation

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an error message along with an error status
    """
    if ('reservation_id' not in request.data
            or 'station_id' not in request.data):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        r = Reservation.objects.get(id=request.data["reservation_id"],
                                    station=station)
        r.delete()
    except:
        return Response({
                "error": "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'reservation_id'],
        properties={
            'station_id': openapi.TYPE_STRING,
            'reservation_id': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def cancel_reservation(request):
    """Cancel an existing Reservation

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an error message along with an error status
    """
    if ('reservation_id' not in request.data
            or 'station_id' not in request.data):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        r = Reservation.objects.get(id=request.data["reservation_id"],
                                    station=station)
        r.state = "Canceled"
        r.save()
    except:
        return Response({
                "error": "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'reservation_id', 'current_battery',
                  'desired_final_battery', 'actual_arrival'],
        properties={
            'station_id': openapi.TYPE_STRING,
            'reservation_id': openapi.TYPE_STRING,
            'current_battery': openapi.TYPE_STRING,
            'desired_final_battery': openapi.TYPE_STRING,
            'actual_arrival': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def vehicle_state(request):
    """Create Vehicle State for a specified reservation

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an error message along with an error status
    """
    if ('reservation_id' not in request.data
            or 'station_id' not in request.data
            or 'current_battery' not in request.data
            or 'desired_final_battery' not in request.data
            or 'actual_arrival' not in request.data):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        r = Reservation.objects.get(id=request.data["reservation_id"],
                                    station=station)
    except:
        return Response({
                "error": "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

    try:
        charger = r.charger
        charger.is_occupied = True
        charger.save()
    except:
        return Response({
                "error": "Something went wrong 2"
            }, status=status.HTTP_400_BAD_REQUEST)

    r.state = "Charging"
    r.actual_arrival = request.data["actual_arrival"]
    r.save()

    try:
        vs = VehicleState.objects.create(
            vehicle=r.vehicle,
            charger=r.charger,
            state="Charging",
            current_battery=request.data["current_battery"],
            desired_final_battery=request.data["desired_final_battery"],
        )
        r.vehicle_state = vs
        r.save()
    except:
        return Response({
                "error": "Something went wrong 3"
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'reservation_id', 'total_energy_transmitted',
                  'actual_departure', 'parking_cost_extra'],
        properties={
            'station_id': openapi.TYPE_STRING,
            'reservation_id': openapi.TYPE_STRING,
            'total_energy_transmitted': openapi.TYPE_STRING,
            'actual_departure': openapi.TYPE_STRING,
            'parking_cost_extra': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: ReservationSerializer,
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def end_reservation(request):
    """Successfully end a reservation

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an error message along with an error status
    """
    if ('reservation_id' not in request.data
            or 'station_id' not in request.data
            or 'total_energy_transmitted' not in request.data
            or 'actual_departure' not in request.data
            or 'parking_cost_extra' not in request.data
            or not validate_dates(request.data['actual_departure'],
                              "%Y-%m-%d %H:%M:%S")):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    try:
        r = Reservation.objects.get(id=request.data["reservation_id"],
                                    station=station)
    except:
        return Response({
                "error": "Something went wrong"
            }, status=status.HTTP_400_BAD_REQUEST)

    if r.vehicle_state != None:
        vs = r.vehicle_state
        vs.state = "Success"

    if r.charger != None:
        charger = r.charger
        charger.is_occupied = False
        charger.save()

    r.state = "Success"
    r.actual_departure = str_to_datetime(request.data["actual_departure"])
    r.total_energy_transmitted = request.data["total_energy_transmitted"]

    pcs = find_parking_costs(station, r.actual_arrival, r.actual_departure)
    r.parking_cost = calculate_parking_cost(pcs, r.actual_arrival, r.actual_departure)
    # Parking Cost extra could be calculated in a different way... However,
    # for now we let the user set it
    r.parking_cost_extra = request.data["parking_cost_extra"]
    r.energy_cost = (float(r.price_per_kwh)
                        * float(request.data["total_energy_transmitted"]))
    r.total_cost = (float(r.energy_cost) + float(r.parking_cost)
                        + float(r.parking_cost_extra))
    r.save()

    serializer = ReservationSerializer(r)

    return Response(serializer.data, status=status.HTTP_200_OK)
