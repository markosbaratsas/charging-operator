from drf_yasg import openapi


AUTHENTICATION_HEADER = openapi.Parameter(
    'Authorization',
    openapi.IN_HEADER,
    description="Authentication Header",
    type=openapi.TYPE_STRING
)
