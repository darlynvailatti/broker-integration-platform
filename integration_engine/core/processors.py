import json
from datetime import datetime
from dicttoxml import dicttoxml
from core.models import Message, MessageBody
from core.constants import MessageHeader

class AbstractProcessor:

    code: str

    def accepts(self, message: Message):
        raise NotImplemented("This method must be implemented")

    def process(self, message: Message):
        raise NotImplemented("This method must be implemented")
    

class ConvertFromJsonToXML(AbstractProcessor):

    code = "convert-from-json-to-xml"

    def accepts(self, message: Message):
        return message.headers.get('Content-Type') == 'application/json'
    
    def process(self, message: Message):
        message.log("Converting from JSON to XML...")
        last_message_body = MessageBody.objects.order_by("timestamp").first()

        data = json.loads(last_message_body.body.tobytes().decode())
        xml = dicttoxml(data)

        # Create a new MessageBody
        MessageBody.objects.create(
            message=message,
            body=xml,
            timestamp=datetime.now().isoformat(),
            content_type='application/xml'
        )

        message.log("Succefully converted from JSON to XML")
        message.headers['Content-Type'] = 'application/xml'
        return message
    
class SendOut(AbstractProcessor):

    code = "send-out"

    def accepts(self, message: Message):
        return True
    
    def process(self, message: Message):
        message.log("Sending out...")
        message.headers[MessageHeader.STATUS] = Message.Status.DELIVERED
        print(f"Send out: {message.headers}")
        return message

processors = (
    ConvertFromJsonToXML,
    SendOut
)