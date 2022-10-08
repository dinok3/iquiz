from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView
)
from .views import MyTokenObtainPairView,getRoutes,RegiserUserView,GetRoutes,get_user
from main.views import create_room_view,room_users,room_view

urlpatterns = [
    path("routes/",GetRoutes.as_view(),name="routes"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("token/blacklist/",TokenBlacklistView.as_view(),name="blacklist_view"), #not needed

    path("register/",RegiserUserView.as_view(),name="register"),
    path("user/",get_user,name="get-user"),

    path("create_room/",create_room_view,name="create_room"),
    path("room_users/<int:id>/",room_users,name="room_users"),
    path("room/<int:id>/",room_view,name="room")

]