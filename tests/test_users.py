import os
import django
import pytest
from django.conf import settings
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.models import User
from apps.post.models import Post
from mixer.backend.django import mixer
from django.urls import reverse
from .conftests import user

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
django.setup()

@pytest.mark.django_db
class TestUserAPI:
    
    @pytest.fixture
    def client(self):
        return APIClient()

    def test_create_user(self, client):
        response = client.post('/api/users/', {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'password123'})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['username'] == 'newuser'

    def test_follow_user(self, client):
        user1 = mixer.blend(User, username='user1', password='password')
        user2 = mixer.blend(User, username='user2', password='password')
        client.force_authenticate(user=user1)
        
        response = client.post(f'/api/users/{user1.id}/follow/{user2.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert user2 in user1.following.all()

    def test_get_user_details(self, client):
        user = mixer.blend(User)
        Post.objects.create(author=user, content='Test post')
        client.force_authenticate(user=user)
        
        response = client.get(f'/api/users/{user.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username

    def test_get_user_details_unauthenticated(self, client):
        user = mixer.blend(User)
        response = client.get(f'/api/users/{user.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_user_view(self, client):
        response = client.post(reverse('user-list'), {'username': 'newuser', 'email': 'newuser@example.com', 'password': 'password123'})
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.count() == 1

    def test_get_user_details_view(self, client, user):
        client.force_authenticate(user=user)
        response = client.get(reverse('user-detail', args=[user.id]))
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == user.username
