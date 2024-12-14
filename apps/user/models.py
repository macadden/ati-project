from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.db import models
from .managers import UserManager

def user_profile_image_directory(instance, filename):
    return f'users/{instance.username}/profile/{filename}'

def user_cover_image_directory(instance, filename):
    return f'users/{instance.username}/cover/{filename}'


class User(AbstractUser, PermissionsMixin):
    followers = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
    profile_image = models.ImageField(upload_to=user_profile_image_directory, max_length=500, blank=True, null=True)
    cover_image = models.ImageField(upload_to=user_cover_image_directory, max_length=500, blank=True, null=True)

    objects = UserManager() 

    def __str__(self):
        return self.username
