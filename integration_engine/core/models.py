from datetime import datetime
from django.db import models
from django.db.models import JSONField
from uuid import uuid4
from enum import Enum
from .constants import MessageHeader


class AbstractEntity(models.Model):
    __abstract__ = True
    id =  models.UUIDField(primary_key=True, default=uuid4, editable=False)

class HistoryAwareSeverityLogLevel(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"

class HistoryAware(AbstractEntity):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    logs = JSONField(blank=True, null=True)

    def log(self, message: str, severity: HistoryAwareSeverityLogLevel = HistoryAwareSeverityLogLevel.INFO):
        if self.logs is None:
            self.logs = []
        self.logs.append({
            "message": message,
            "severity": str(severity.value),
            "timestamp": datetime.now().isoformat()
        })

class TransactionType(AbstractEntity):
    code = models.CharField(max_length=255, unique=True)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.code

class Partner(AbstractEntity):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Integration(AbstractEntity):
    name = models.CharField(max_length=255)
    source = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='source_integrations')  # Added related_name
    target = models.ForeignKey(Partner, on_delete=models.CASCADE, related_name='target_integrations')  # Added related_name

class Message(HistoryAware):
    message_integration = models.ForeignKey(Integration, on_delete=models.CASCADE, related_name='messages')  # Renamed field
    headers = JSONField()

    @property
    def transaction_type(self):
        return self.headers.get(MessageHeader.TRANSACTION_TYPE)

    class Status:
        PENDING = "pending"
        RECEIVED = "received"
        PROCESSED = "processed"
        FAILED = "failed"
        DELIVERED = "delivered"

class MessageBody(AbstractEntity):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    body = models.BinaryField()
    timestamp = models.DateTimeField()
    content_type = models.CharField(max_length=255)

class Protocol(Enum):
    HTTP = "http"
    MQTT = "mqtt"
    AMQP = "amqp"

class ConnectionSettings(AbstractEntity):
    name = models.CharField(max_length=255)
    settings = JSONField()
    protocol = models.CharField(
        max_length=20,
        choices=[(tag.name, tag.value) for tag in Protocol]
    )
    owner = models.ForeignKey(Partner, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return self.name

class GatewaySettings(AbstractEntity):
    name = models.CharField(max_length=255)
    settings = JSONField()
    connection = models.ForeignKey(ConnectionSettings, on_delete=models.CASCADE)
    gateway_integration = models.ForeignKey(Integration, on_delete=models.CASCADE, related_name='gatewaysettings')  # Renamed field

    def __str__(self) -> str:
        return self.name

class Route(AbstractEntity):
    code = models.CharField(max_length=255, unique=True)
    settings = JSONField()

    def __str__(self) -> str:
        return self.code