
from django.db import models
from django.db.models.signals import post_save

from django.contrib.auth import get_user_model
from django.dispatch import receiver 
# Create your models here.

User = get_user_model()





class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
           

    def __str__(self):
        return self.user.username



class Room(models.Model):
    profile = models.ManyToManyField(Profile,blank=True)
    owner =  models.ForeignKey(Profile, on_delete=models.CASCADE, blank=True, null=True,related_name="room_owner")

    category = models.CharField(max_length=200,null=True,blank=True)
    difficulty = models.CharField(max_length=200,null=True,blank=True)
    type = models.CharField(max_length=200,null=True,blank=True)
    time = models.IntegerField(null=True,blank=True)
    rounds = models.IntegerField(null=True,blank=True)

    def __str__(self):
        return f"{self.id}"


        
@receiver(post_save, sender=User)
def create_profile(created,instance,**kwargs):

    if created:
        profile = Profile.objects.create(user=instance)
        profile.save()
