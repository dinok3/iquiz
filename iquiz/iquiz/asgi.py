"""
ASGI config for iquiz project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.auth import AuthMiddlewareStack
from main.consumers import QueryAuthMiddleware
from django.urls import path
from main.consumers import RoomConsumer
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'iquiz.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
   "http":django_asgi_app,
    "websocket":AllowedHostsOriginValidator(
        AuthMiddlewareStack(
        QueryAuthMiddleware(
            URLRouter(
                [
                    path("ws/<int:room_id>/", RoomConsumer.as_asgi()),
                ]
            )
        
        ))
    )
})