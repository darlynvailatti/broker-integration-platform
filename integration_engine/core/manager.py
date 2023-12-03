import base64
import logging
import dataclasses
from datetime import datetime
from core.models import GatewaySettings, Message, MessageBody
from core.router import Router
from core.constants import MessageHeader



class GatewayInboundManager:

    def __init__(self) -> None:
        # Create a logger
        self.logger = logging.getLogger(__name__)
    
    @dataclasses.dataclass
    class InboundPackage:
        gateway_id: str
        payload: bytes
        headers: dict

    @dataclasses.dataclass
    class Response:
        success: bool
        message: str
        details: dict

    @staticmethod
    def receives(inbound_package: InboundPackage) -> Response:
        return GatewayInboundManager().__do_receive(inbound_package)
        
    def __do_receive(self, inbound_package: InboundPackage):
        try:

            found = GatewaySettings.objects.get(id=inbound_package.gateway_id)
            if not found:
                msg = f"Gateway with id {inbound_package.gateway_id} not found"
                self.logger.error(msg)
                raise Exception(msg)
            
            # Create a new Message
            new_message, _ = Message.objects.update_or_create(
                message_integration=found.gateway_integration,
                headers={
                    MessageHeader.STATUS: Message.Status.PENDING,
                    "created_at": datetime.now().isoformat(),
                    "updated_at": datetime.now().isoformat(),
                    MessageHeader.INBOUND_GATEWAY: str(found.id),
                    MessageHeader.ROUTE: found.settings.get(MessageHeader.ROUTE),
                    MessageHeader.TRANSACTION_TYPE: found.settings.get(MessageHeader.TRANSACTION_TYPE),
                    **inbound_package.headers
                },
            )
            new_message.log("Message has been created...")

            # Create a new MessageBody
            body = inbound_package.payload
            MessageBody.objects.update_or_create(
                message=new_message,
                body=body,
                timestamp=inbound_package.headers.get("timestamp", datetime.now().isoformat()),
                content_type=inbound_package.headers.get("Content-Type", "application/json")
            )

            routed_message = Router.route(new_message)
            print(f"Routed message: {routed_message.headers.get(MessageHeader.STATUS)}")
            routed_message.save()

            return GatewayInboundManager.Response(**{
                "success": True,
                "message": "Message has been received successfully",
                "details": {
                    "message_id": str(routed_message.id),
                    **routed_message.headers
                }
            })
        except Exception as e:
            self.logger.error(f"Error receiving message: {e}")
            import traceback
            traceback.print_exc()
            return GatewayInboundManager.Response(**{
                "success": False,
                "message": "An failure has occurred while receiving the message",
                "details": {
                    "error": str(e)
                }
            })

     
