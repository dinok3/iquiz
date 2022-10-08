from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Profile, Room
from django.contrib.auth.models import User


class RoomSerializer(ModelSerializer):
    owner = serializers.CharField()
    class Meta:
        model = Room
        fields = "__all__"

    def create(self, validated_data):
        profile_id = validated_data["owner"]
        validated_data["owner"] = Profile.objects.get(id=profile_id)
        
        return super().create(validated_data)



class ProfileSerizaliter(ModelSerializer):
    user = serializers.CharField()

    class Meta:
        model = Profile
        fields = ["id","user"]

    