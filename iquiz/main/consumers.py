
import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User,AnonymousUser
from .models import Room,Profile


from oauth2_provider.models import AccessToken as SocialToken
from rest_framework_simplejwt.tokens  import AccessToken as JWToken


from channels.db import database_sync_to_async

@database_sync_to_async
def get_user(username):
    """
    ### one way is to find user with TOKEN
    
    try:
        user_name = JWToken(token)["username"]
        return User.objects.get(username=user_name)
   
    except:
        try:
            user_name = SocialToken.objects.get(token=token).user
            return User.objects.get(username=user_name)

        except:
            return AnonymousUser
    """

    try:
        return User.objects.get(username=username)
   
    except:
        return AnonymousUser

class QueryAuthMiddleware:
    """
    Custom middleware (insecure) that takes user IDs from the query string.
    """

    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # Look up user from query string (you should also do things like
        # checking if it is a valid user ID, or if scope["user"] is already
        # populated).
        
        scope['user'] = await get_user(scope["query_string"].decode('utf-8')[6:])
        
        return await self.app(scope, receive, send)



class RoomConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]
        
        self.room_name = f"room_{self.room_id}"
        self.user = self.scope["user"]
        room = await self.get_room(self.room_id)

        if room:
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name
            )


            await self.accept()

    async def disconnect(self, close_code):
        print("disconnected: ",close_code)
        await self.leave_room(self.room_id)


        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        try:
            user = self.user.username
        except:
            user = self.user
        message = text_data_json["message"]
        
        command = message.split(" ")
        if "/kickplayer" in command[0]:
            player_to_kick = command[-1]
            user_to_kick = await self.get_user_from_id_or_name(player_to_kick)
            
            kick_message = f"/kickplayer {user_to_kick}"

            await self.channel_layer.group_send(
                self.room_name,
                {
                    'type': 'kick_message',
                    'message': kick_message,
                }
            )
            return

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_name,
            {
                'type': 'chat_message',
                'message': message,
                "user":user
            }
        )


    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        user = event["user"]
        
        if message == "NewUserJoined":
            await self.send(text_data=json.dumps({
                "message": str(user) + " has joined the server"
            }))
            return
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            "user":user
        }))


    async def kick_message(self, event):
        message = event['message']
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
        }))

   
    @database_sync_to_async
    def get_room(self, room_id):
        
        room = Room.objects.get(id=room_id)
        if not room:
            return None
        profile = Profile.objects.filter(user=self.user).first()
        room.profile.add(profile)
        return room

        


    @database_sync_to_async
    def leave_room(self,room_id):

        room = Room.objects.filter(id=room_id).first()
        if not room:
            return None
        profile = Profile.objects.filter(user=self.user).first()
        room.profile.remove(profile)
        return room
       

    @database_sync_to_async
    def get_user_from_id_or_name(self, identificator):
        try:
            return  Profile.objects.get(id=identificator).user.username
        except:
            return User.objects.get(username=identificator).username