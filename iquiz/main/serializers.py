from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from .models import Profile, Room
from django.contrib.auth.models import User


class RoomSerializer(ModelSerializer):
    owner = serializers.CharField()
    profile = serializers.StringRelatedField(many=True,required=False)

    class Meta:
        model = Room
        fields = "__all__"

    def create(self, validated_data):
        user = User.objects.get(username=validated_data["owner"])
        profile = Profile.objects.get(user=user)
        validated_data["owner"] = profile
        room = Room.objects.create(**validated_data)
        room.save()
        return room



class ProfileSerizaliter(ModelSerializer):
    user = serializers.CharField()

    class Meta:
        model = Profile
        fields = ["id","user"]

    