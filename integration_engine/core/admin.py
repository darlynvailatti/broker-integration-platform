from django.contrib import admin
from .models import Message, Integration, Partner, ConnectionSettings, MessageBody, GatewaySettings, Route, TransactionType

# Register your models here.
admin.site.register(Message)
admin.site.register(Integration)
admin.site.register(Partner)
admin.site.register(ConnectionSettings)
admin.site.register(MessageBody)
admin.site.register(GatewaySettings)
admin.site.register(Route)
admin.site.register(TransactionType)