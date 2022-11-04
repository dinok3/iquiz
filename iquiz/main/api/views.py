from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import generics
from rest_framework.permissions import AllowAny,IsAuthenticated

from .serializers import RegisterSerializer
from main.models import User


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod 
    def get_token(cls, user):
        token = super().get_token(user)
        
        token["username"] = user.username
        #for channels scope
        token["user_id"] = user.id
        return token



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    

class GetRoutes(generics.ListAPIView):
    permission_classes  = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getRoutes(request):
    print("req:", request.user)
    data = [
        "api/token/",
        "api/token/refresh/"
    ]
    return Response(data)


class RegiserUserView(generics.CreateAPIView):
    permission_classes = (AllowAny, )
    serializer_class = RegisterSerializer

   


from oauth2_provider.models import AccessToken as SocialToken
from rest_framework_simplejwt.tokens  import AccessToken as JWToken


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user(request):
    data = {
        "user":request.user.username
    }
    return Response(data)