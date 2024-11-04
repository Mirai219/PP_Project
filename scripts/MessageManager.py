class MessageManager:
    def __init__(self, room_id: str):
        self.room_id = room_id
        self.message_list = {}

    def add_message(self, message_id: str, user_id: str, type: str, content: str):
        message = Message(message_id, user_id, type, content)
        self.message_list[message_id] = message
        return message
    
    def get_message(self, message_id: str):
        return self.message_list.get(message_id)
    
    def delete_message(self, message_id: str):
        self.message_list.pop(message_id)
        return True
    
    def get_room_id(self):
        return self.room_id

class Message:
    def __init__(self, message_id: str, user_id: str ,type: str, content: str):
        self.message_id = message_id
        self.user_id = user_id
        self.type = type
        self.content = content
    
    def __repr__(self):
        return f"Message({self.message_id}, {self.user_id}, {self.type}, {self.content})"

if __name__ == "__main__":
    message_manager = MessageManager("room_id")
    message = message_manager.add_message("message_id", "user_id", "type", "content")
    print(message_manager.message_list)
    print(message_manager.get_message("message_id").content)
    message_manager.delete_message("message_id")
    print(message_manager.get_message("message_id"))