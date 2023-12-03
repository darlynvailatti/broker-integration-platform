from core.models import Message, Route, HistoryAwareSeverityLogLevel
from core.processors import processors
from core.constants import MessageHeader

class Router:

    @staticmethod
    def route(message: Message):
        try:
            print(f"Routing message {message.headers}...")
            message.log("Being routed...")
            route_code = message.headers.get(MessageHeader.ROUTE)
            route = Route.objects.get(code=route_code)

            if not route:
                raise Exception("Message does not have a route")

            for step in route.settings.get("steps"):

                try:
                    step_name = step.get("name")
                    message.log(f"Processing step {step_name}...")
                    processor_code = step.get("processor")

                    processor = next((p for p in processors if p.code == processor_code), None)
                    print(f"Processor {processor}...")
                    if processor:
                        processor_instance = processor()
                        if not processor_instance.accepts(message):
                            msg = f"Processor {processor_code} does not accept this message"
                            message.log(msg, severity=HistoryAwareSeverityLogLevel.ERROR)
                            raise Exception(msg)

                        print("Processing...")
                        message = processor_instance.process(message)
                        print(f"Messsage has been processed: {message.headers}...")
                    else:
                        msg = f"Processor {processor_code} does not exist"
                        message.log(msg, severity=HistoryAwareSeverityLogLevel.ERROR)
                        raise Exception(msg)
                except Exception as e:
                    raise e

        except Exception as e:
            message.log(f"Error routing message: {e}", severity=HistoryAwareSeverityLogLevel.ERROR)
            message.headers[MessageHeader.STATUS] = Message.Status.FAILED
        finally:
            message.save()
            return message
        