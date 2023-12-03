from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import QueryDict
from core.manager import GatewayInboundManager

class GatewayView(APIView):
    def render_receiver_response(self, response: GatewayInboundManager.Response):
        if response.success:
            return Response({
                "message": "Message has been received successfully",
                "details": response.details
            }, status=200)
        else:
            return Response({
                "message": "An failure has occurred while receiving the message",
                "details": response.details
            }, status=400)

    def get(self, request, id=None, format=None):
        return self.post(request, id=id)

    def post(self, request, id=None, format=None):
        body = request.body
        package = GatewayInboundManager.InboundPackage(
            gateway_id=id, payload=body, headers=request.headers
        )
        response = GatewayInboundManager.receives(package)
        return self.render_receiver_response(response)