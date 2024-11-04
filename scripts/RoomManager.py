import uuid
from MessageManager import MessageManager

class RoomManager:
    def __init__(self):
        self.rooms = {}

    def add_room(self):
        room_id = str(uuid.uuid4())
        room = Room(room_id)
        self.rooms[room_id] = room
        return room
    
    def get_room(self,room_id:str):
        return self.rooms.get(room_id)

class Room:
    def __init__(self,room_id:str):
        self.room_id = room_id
        self.message_manager = MessageManager(room_id)