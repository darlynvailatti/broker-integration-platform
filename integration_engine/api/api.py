import statistics
import django_filters as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import MessageSerializer, DynamicModelSerializer
from core.models import Message, Integration, TransactionType, Partner, Route, Integration, ConnectionSettings, GatewaySettings
from core.constants import MessageHeader
from django.db import models
from django.db.models.functions import TruncMinute, TruncSecond
from django.db.models import Count


class MessageFilter(filters.FilterSet):
    integration_name = filters.CharFilter(
        field_name="message_integration__name", lookup_expr="icontains"
    )
    transaction_type = filters.CharFilter(
        field_name=f"headers__{MessageHeader.TRANSACTION_TYPE}", lookup_expr="icontains"
    )
    status = filters.CharFilter(
        field_name=f"headers__{MessageHeader.STATUS}", lookup_expr="icontains"
    )
    partner_name = filters.Filter(method="partner_name_filter")

    class Meta:
        model = Message
        fields = ["message_integration", "headers", "partner_name"]
        filter_overrides = {
            models.JSONField: {
                "filter_class": filters.CharFilter,
                "extra": lambda f: {
                    "lookup_expr": "icontains",
                },
            },
        }

    def partner_name_filter(self, queryset, name, value):
        return queryset.filter(
            models.Q(message_integration__source__name__icontains=value)
            | models.Q(message_integration__target__name__icontains=value)
        )


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all().order_by('-created_at')
    serializer_class = MessageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MessageFilter


class MetricsView(APIView):
    def get(self, request, format=None):
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        transaction_type_totals = []
        for trasanction in TransactionType.objects.all():
            total = 0
            for message in Message.objects.all():
                if (
                    message.headers.get(MessageHeader.TRANSACTION_TYPE)
                    == trasanction.code
                ):
                    total += 1
            transaction_type_totals.append(
                {
                    "transaction_type": trasanction.code,
                    "total": total,
                }
            )

        messages = (
            Message.objects.annotate(timestamp_minute=TruncMinute("created_at"))
            .values("timestamp_minute")
            .annotate(count=Count("id"))
            .order_by("timestamp_minute")
        )

        messages_by_minute = messages.values_list("count", flat=True)

        messages_by_second = (
            Message.objects.annotate(timestamp_second=TruncSecond("created_at"))
            .values("timestamp_second")
            .annotate(count=Count("id"))
            .order_by("timestamp_second")
            .values_list("count", flat=True)
        )

        
        failed_messages = (Message.objects
            .annotate(timestamp_minute=TruncMinute("created_at"))
            .values("timestamp_minute")
            .annotate(count=Count("id"))
            .filter(**{f"headers__{MessageHeader.STATUS}": Message.Status.FAILED})
        )
        metrics = {
            "total_integrations": Integration.objects.count(),
            "total_messages": Message.objects.count(),
            "message_latency": {
                "per_minute": statistics.mode(messages_by_minute),
                "per_second": statistics.mode(messages_by_second),
            },
            "failures": {"totals": failed_messages.count(), "messages": failed_messages},
            "transaction_type_totals": transaction_type_totals,
            "messages": messages
        }
        return Response(metrics)


class TransactionTypeViewSet(viewsets.ModelViewSet):
    queryset = TransactionType.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["code", "description"]
    serializer_class = DynamicModelSerializer

    def get_serializer_class(self):
        clz = DynamicModelSerializer
        clz.Meta.model = self.queryset.model
        return clz
    
class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["name"]
    serializer_class = DynamicModelSerializer

    def get_serializer_class(self):
        clz = DynamicModelSerializer
        clz.Meta.model = self.queryset.model
        return clz
    
class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["code"]
    serializer_class = DynamicModelSerializer

    def get_serializer_class(self):
        clz = DynamicModelSerializer
        clz.Meta.model = self.queryset.model
        return clz
    
class IntegrationViewSet(viewsets.ModelViewSet):
    queryset = Integration.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["name", "source__name", "target__name"]
    serializer_class = DynamicModelSerializer

    def get_serializer_class(self):
        clz = DynamicModelSerializer
        clz.Meta.model = self.queryset.model
        return clz
    
class ConnectionsViewSet(viewsets.ModelViewSet):
    queryset = ConnectionSettings.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["name", "owner__name", "protocol"]
    serializer_class = DynamicModelSerializer

    def get_serializer_class(self):
        clz = DynamicModelSerializer
        clz.Meta.model = self.queryset.model
        return clz

class GatewaysViewSet(viewsets.ModelViewSet):
    queryset = GatewaySettings.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["name"]
    serializer_class = DynamicModelSerializer

    def get_serializer_class(self):
        clz = DynamicModelSerializer
        clz.Meta.model = self.queryset.model
        return clz
    
