from datetime import datetime, timedelta
from django.utils.timezone import make_aware
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from reservations.models import Reservation
from reservations.useful_functions import str_to_datetime
from stations.models import Station

from users.body_parameters import AUTHENTICATION_HEADER


@swagger_auto_schema(
    methods=['POST'],
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['from_date', 'to_date'],
        properties={
            'from_date': openapi.TYPE_STRING,
            'to_date': openapi.TYPE_STRING
        },
    ),
    manual_parameters=[AUTHENTICATION_HEADER],
    responses={
        200: 'Success along with list of statistics',
        401: 'Not Authorized'
    }
)
@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_reservations(request):
    """Get reservations' statistics for a specified period organized per day

    Returns:
        data, status: if successful returns a list of stations, with an
            HTTP_200_OK status
    """
    if 'from_date' not in request.data or 'to_date' not in request.data:
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    from_date = str_to_datetime(request.data["from_date"])
    to_date = str_to_datetime(request.data["to_date"])

    # validate that dates have the expected format
    if (from_date == None or to_date == None):
        return Response({
                "error": "Invalid format"
            }, status=status.HTTP_400_BAD_REQUEST)

    # beginning of the day
    from_date = make_aware(datetime(from_date.year,
                                    from_date.month,
                                    from_date.day,
                                    0,0,0))

    # end of the day
    to_date = make_aware(datetime(to_date.year,
                                    to_date.month,
                                    to_date.day,
                                    23,59,59))

    stations = Station.objects.filter(operators__id=request.user.id)

    reservations_stats = []

    while from_date < to_date:

        day_dict = {
            "day": f"{from_date.day} {from_date.strftime('%B')}"
        }
        next_day = from_date + timedelta(days=1)

        for station in stations:
            reservations = Reservation.objects.filter(
                                station=station,
                                actual_departure__range=[from_date,
                                                        next_day])

            day_dict[f"{station.id}_number_reservations"] = len(reservations)
            day_dict[f"{station.id}_all"] = sum(
                                    [float(i.total_cost)
                                    for i in reservations])
            day_dict[f"{station.id}_parking"] = sum(
                                    [float(i.parking_cost+i.parking_cost_extra)
                                    for i in reservations])
            day_dict[f"{station.id}_energy"] = sum(
                                    [float(i.energy_cost)
                                    for i in reservations])

        reservations_stats.append(day_dict)
        from_date = next_day

    return Response(reservations_stats, status=status.HTTP_200_OK)
