from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chargers.models import Charger, PricingGroup
from chargers.serializers import (PricingGroupInfoSerializer,
                                PricingGroupPricesSerializer)
from stations.useful_functions import get_user_station


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_pricing_groups(request):
    """Get PricingGroup Information for a specific station

    Returns:
        data, status: if successful returns PricingGroup's information along
            with HTTP_200_OK status, else it returns an error message along
            with an HTTP_401_UNAUTHORIZED status
    """
    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    pricing_groups = PricingGroup.objects.filter(station=station)
    serializer = PricingGroupInfoSerializer(pricing_groups, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST', ])
@permission_classes((IsAuthenticated,))
def get_pricing_groups_prices(request):
    """Get a station's PricingGroups prices

    Returns:
        data, status: if successful returns PricingGroups' prices along
            with HTTP_200_OK status, else it returns an error message along
            with an HTTP_401_UNAUTHORIZED status
    """
    station = get_user_station(request.user, request.data["station_id"])

    if station == None:
        return Response({
                "error": "You do not have access to this station"
            }, status=status.HTTP_401_UNAUTHORIZED)

    pricing_groups = PricingGroup.objects.filter(station=station)
    serializer = PricingGroupPricesSerializer(pricing_groups, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)
