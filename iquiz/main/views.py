import constantly
from django.contrib.auth.models import User
from .models import Room,Profile
from .serializers import RoomSerializer, ProfileSerizaliter
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import Response
from rest_framework import status

from oauth2_provider.models import AccessToken as SocialToken
from rest_framework_simplejwt.tokens  import AccessToken as JWToken

# Create your views here.

def get_user_by_token(token):
    try:
        user_name = JWToken(token)["username"]
        return User.objects.get(username=user_name)    
    except:    
        user_name = SocialToken.objects.get(token=token).user
        return User.objects.get(username=user_name)


@permission_classes([IsAuthenticated])
@api_view(["GET","POST"])
def create_room_view(request):
    
    if request.method == "GET":
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms,many=True)
        return Response(serializer.data)

    if request.method == "POST":

        serializer = RoomSerializer(data=request.data)
       
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)

        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@permission_classes([IsAuthenticated])
@api_view(["GET","POST", "DELETE"])
def room_view(request,id):
    room = Room.objects.get(id=id)
    
    if request.method == "GET":
        serializer = RoomSerializer(room)
        return Response(serializer.data)

    if request.method == "POST":
        try:
            game_started = request.data["is_started"] == "True"
            room.is_started = game_started
            room.save()

            serializer = RoomSerializer(room)
            return Response(serializer.data)
        except:
            username = request.data["user"]
            profile = User.objects.get(username=username).profile

            if str(request.user) == str(room.owner):
                room.profile.remove(profile)
        
            serializer = RoomSerializer(room)
            return Response(serializer.data)
    
    if request.method == "DELETE":
        print("deleting...")
        room.delete()
        return Response("Room is Deleted")    
    


@permission_classes([IsAuthenticated])
@api_view(["GET"])
def room_users(request,id):
    if request.method == "GET":
        room = Room.objects.get(id=id)
        users = room.profile.all()
        if room:
            serializer = ProfileSerizaliter(users,many=True)
            return Response(serializer.data)




