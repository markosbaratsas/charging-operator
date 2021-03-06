from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from reservations.useful_functions import str_to_datetime, validate_dates
from stations.useful_functions import (add_charger, add_pricing_group,
                                       find_parking_costs, get_user_station)

from stations.models import (ParkingCost, ParkingCostSnapshot, Station,
                             StationRequests)
from stations.serializers import (DashboardStationSerializer,
                                  ParkingCostSerializer,
                                  StationInformationSerializer,
                                  StationRequestSerializer)
from gridprice.models import Location
from users.body_parameters import AUTHENTICATION_HEADER
from users.decorators import operator_required


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: DashboardStationSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
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


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: StationInformationSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_station_markers(_):
    """Return stations markers, to be rendered on map

    Returns:
        data, status: if successful returns a list of station markers, with an
            HTTP_200_OK status
    """
    stations = Station.objects.all()
    serializer = StationInformationSerializer(stations, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id'],
        properties={
            'station_id': openapi.TYPE_INTEGER
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def add_station(request):
    """Create a StationRequest for an operator to be added to a station

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an Error message along with an error status
    """
    given_id = int(request.data['station_id'])
    try:
        station = Station.objects.get(id=given_id)
    except:
        return Response(data={
            "error": "No station with this id"
        }, status=status.HTTP_406_NOT_ACCEPTABLE)

    station_req, _ = StationRequests.objects.get_or_create(
        station=station,
        operator=request.user
    )

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_request_id'],
        properties={
            'station_request_id': openapi.TYPE_INTEGER
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success',
        401: 'Not Authorized',
        406: 'No station request with this id'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def answer_station_request(request):
    """Endpoint so that an operator can accept/reject a user's request to join
    a station

    Returns:
        data, status: if successful returns an HTTP_200_OK status, else it
            returns an Error message along with an error status
    """
    given_id = int(request.data['station_request_id'])
    try:
        station_req = StationRequests.objects.get(id=given_id)
    except:
        return Response(data={
            "error": "No station request with this id"
        }, status=status.HTTP_406_NOT_ACCEPTABLE)

    if request.user not in station_req.station.operators.all():
        return Response(data={
            "error": "Not Authorized"
        }, status=status.HTTP_401_UNAUTHORIZED)

    state = request.data['state']

    if state == "Approve":
        station_req.station.operators.add(station_req.operator)
        station_req.station.save()

    station_req.delete()

    return Response(status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: StationRequestSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def get_station_requests(request):
    """Get StationRequests for all the stations that a user belongs to. This
    endpoint is used so that operators can retrieve all the StationRequests
    that they are authorized to accept/reject.

    Returns:
        data, status: returns a list with all the StationRequests for this
            operator, along with an HTTP_200_OK status
    """
    user_stations = Station.objects.filter(operators__id=request.user.id)

    station_requests = []
    for i in user_stations:
        for req in StationRequests.objects.filter(station=i):
            station_requests.append(req)

    serializer = StationRequestSerializer(station_requests, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: StationRequestSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def get_personal_station_requests(request):
    """Get StationRequests that an operator has requested

    Returns:
        data, status: returns a list with all the StationRequests for this
            operator, along with an HTTP_200_OK status
    """
    reqs = StationRequests.objects.filter(operator=request.user)
    serializer = StationRequestSerializer(reqs, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station'],
        properties={
            'station': openapi.TYPE_OBJECT
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Successfully created a new station!',
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
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

    try:
        location = Location.objects.get(
            id=int(request.data['station']['step1']['location_id'])
        )
    except:
        return Response({
            "error": "step1"
        },status=status.HTTP_400_BAD_REQUEST)

    station = Station.objects.create(
        name=request.data['station']['step1']['name'],
        address=request.data['station']['step1']['address'],
        latitude=request.data['station']['step1']['latitude'],
        longitude=request.data['station']['step1']['longitude'],
        phone=request.data['station']['step1']['phone'],
        location=location,
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

    # Add Parking Cost. For now we have only one Parking Cost per Station,
    # which means every day, every hour we have this specific parking cost,
    # and we set it to last practically forever...
    # However, we could have different parking costs per weekday, hour or
    # whatever...
    # TODO: Implement this functionality
    pcs = ParkingCostSnapshot.objects.create(
        station=station,
        name="Default Parking Cost",
        value=0.0
    )
    ParkingCost.objects.create(
        parking_cost_snapshot=pcs,
        station=station,
        from_datetime="2000-01-01 00:00:00",
        to_datetime="2100-01-01 00:00:00"
    )

    return Response({
            "success": "Successfully created a new station!"
        }, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id'],
        properties={
            'station_id': openapi.TYPE_INTEGER
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: StationInformationSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
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


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'from_datetime', 'to_datetime'],
        properties={
            'station_id': openapi.TYPE_INTEGER,
            'from_datetime': openapi.TYPE_STRING,
            'to_datetime': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: ParkingCostSerializer,
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def get_parking_costs(request):
    """Get Station's parking cost for a specific date range

    Returns:
        data, status: if successful returns station's information along with
            HTTP_200_OK status, else it returns an error message along with
            an HTTP_401_UNAUTHORIZED status
    """
    if ('station_id' not in request.data
            or 'from_datetime' not in request.data
            or 'to_datetime' not in request.data
            or not validate_dates(request.data["from_datetime"],
                               "%Y-%m-%d %H:%M:%S")
            or not validate_dates(request.data["to_datetime"],
                               "%Y-%m-%d %H:%M:%S")):
        return Response({
                "error": "Invalid format."
            }, status=status.HTTP_400_BAD_REQUEST)

    from_datetime = str_to_datetime(request.data["from_datetime"])
    to_datetime = str_to_datetime(request.data["to_datetime"])

    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    parking_costs = find_parking_costs(station, from_datetime, to_datetime)
    serializer = ParkingCostSerializer(parking_costs, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['station_id', 'parking_cost_value'],
        properties={
            'station_id': openapi.TYPE_INTEGER,
            'parking_cost_value': openapi.TYPE_INTEGER
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: "Success",
        400: 'Bad Request',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
@operator_required
def set_parking_cost(request):
    """Set the default parking cost

    Returns:
        data, status: if successful returns station's information along with
            HTTP_200_OK status, else it returns an error message along with
            an HTTP_401_UNAUTHORIZED status
    """
    if ('station_id' not in request.data
            or 'parking_cost_value' not in request.data):
        return Response({
                "error": "Invalid format."
            }, status=status.HTTP_400_BAD_REQUEST)

    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    pcss = ParkingCostSnapshot.objects.filter(station=station)
    for i in pcss:
        i.delete()
    # the correspondent ParkingCost objects is deleted automatically due to
    # on_delete=models.CASCADE

    try:
        pcs = ParkingCostSnapshot.objects.create(
            station=station,
            name="Default Parking Cost",
            value=float(request.data["parking_cost_value"])
        )
        ParkingCost.objects.create(
            parking_cost_snapshot=pcs,
            station=station,
            from_datetime="2000-01-01 00:00:00",
            to_datetime="2100-01-01 00:00:00"
        )
    except:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_200_OK)
