import json

class RequestHandler:
    def __init__(self):
        self.self.handlers = {}
        self.register_command("message", self.handle_message)

    def register_command(self, type:str, handler):
        self.handlers[type] = handler

    def handle_requst(self, protocol:str):
        protocol = json.loads(protocol)
        version = protocol.get("version")
        event = protocol.get("event")
        data = protocol.get("data")
        '''
        data is a dictionary like this:
            user_id: "3800d555-50d3-5596-8bcc-d614a9a36601",
            room_id: "054692d1-0c09-59d2-89b1-254d9878f0e2",
            msg_id: "630eb68f-e0fa-5ecc-887a-7c7a62614681",
            msg_type: "text",
            content: {
                text: "test text"
            }
        '''
        if version == "1.0":
            return self.handlers[event](data)
        
    async def handle_message(self, data):
        pass