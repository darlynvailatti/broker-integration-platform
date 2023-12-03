from django.conf import settings
from rest_framework.routers import DefaultRouter, SimpleRouter
from django.urls import path

from api.api import MessageViewSet, MetricsView, TransactionTypeViewSet, PartnerViewSet, RouteViewSet, IntegrationViewSet, ConnectionsViewSet, GatewaysViewSet
from api.gateway import GatewayView

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("messages", MessageViewSet)
router.register("transaction_types", TransactionTypeViewSet)
router.register("partners", PartnerViewSet)
router.register("routes", RouteViewSet)
router.register("integrations", IntegrationViewSet)
router.register("connections", ConnectionsViewSet)
router.register("gateways", GatewaysViewSet)

app_name = "api"
urlpatterns = router.urls + [
    path('gateway/<str:id>/', GatewayView.as_view(), name='gateway'),
    path('metrics/', MetricsView.as_view(), name='metrics'),
]