from django.urls import re_path
from .consumers import RoomConsumer


websocket_urlpatterns = [
    re_path(r'ws/(?P<room_name>\w+)/$', RoomConsumer.as_asgi()),
]
