from rest_framework import serializers
from core.models import Message, MessageBody
from core.constants import MessageHeader

class MessageSerializer(serializers.ModelSerializer):

    transaction_type = serializers.SerializerMethodField()
    source = serializers.SerializerMethodField()
    target = serializers.SerializerMethodField()
    integration_name = serializers.SerializerMethodField()
    body_history = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'
        depth = 1

    def get_transaction_type(self, obj):
        # return the value for the property
        return obj.headers.get(MessageHeader.TRANSACTION_TYPE)
    
    def get_source(self, obj):
        # return the value for the property
        return obj.message_integration.source.name
    
    def get_target(self, obj):
        # return the value for the property
        return obj.message_integration.target.name
    
    def get_integration_name(self, obj):
        # return the value for the property
        return obj.message_integration.name
    
    def get_body_history(self, obj):
        body_history = []
        for body in MessageBody.objects.filter(message=obj).order_by('-timestamp'):
            body_history.append({
                'created_at': body.timestamp,
                'body': body.body.tobytes().decode('utf-8'),
                'content_type': body.content_type
            })
        
        return body_history
    
class DynamicModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = None  # This will be set dynamically
        fields = '__all__'