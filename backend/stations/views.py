from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from stations.models import Station
from stations.serializers import DashboardStationSerializer


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
