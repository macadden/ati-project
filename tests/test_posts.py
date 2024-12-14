import os
import django
import pytest
from django.conf import settings
from rest_framework import status
from rest_framework.test import APIClient
from apps.user.models import User
from apps.post.models import Post, Comment
from mixer.backend.django import mixer
from django.urls import reverse
from .conftests import user, post

os.environ['DJANGO_SETTINGS_MODULE'] = 'core.settings'
django.setup()

@pytest.mark.django_db
class TestPostAPI:

    @pytest.fixture(autouse=True)
    def setup(self, db):
        # Limpia la base de datos antes de cada test
        Post.objects.all().delete()
    
    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authenticated_client(self, user):
        client = APIClient()
        client.force_authenticate(user=user)
        return client
    
    @pytest.fixture
    def setup_posts(self, user):
        Post.objects.all().delete()
        mixer.blend(Post, author=user, content='Post 1', created_at='2023-10-01')
        mixer.blend(Post, author=user, content='Post 2', created_at='2023-10-02')

    def test_create_post(self, authenticated_client):
        response = authenticated_client.post('/api/posts/', {'content': 'New post content'})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['content'] == 'New post content'
        assert Post.objects.count() == 1

    def test_get_posts(self, authenticated_client, user):
        post1 = mixer.blend(Post, author=user, content='Post 1')
        post2 = mixer.blend(Post, author=user, content='Post 2')

        response = authenticated_client.get('/api/posts/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 2

    @pytest.mark.parametrize("author_id, from_date, to_date, expected_count", [
        (None, None, None, 2),
        (None, '2023-10-01', None, 2),
        (None, None, '2023-10-02', 2),
        (None, '2023-10-01', '2023-10-01', 1),
        (None, '2023-10-02', '2023-10-02', 1),
    ])
    def test_get_posts_with_filters(self, authenticated_client, setup_posts, author_id, from_date, to_date, expected_count):
        params = {}
        if author_id:
            params['author_id'] = author_id
        if from_date:
            params['from_date'] = from_date
        if to_date:
            params['to_date'] = to_date

        response = authenticated_client.get('/api/posts/', params)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == expected_count

    def test_get_post_details(self, authenticated_client, user):
        post = mixer.blend(Post, author=user, content='Post with comments')
        mixer.blend(Comment, author=user, post=post, content='First comment')
        mixer.blend(Comment, author=user, post=post, content='Second comment')

        response = authenticated_client.get(f'/api/posts/{post.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] == 'Post with comments'
        assert len(response.data['comments']) == 2

    def test_add_comment_to_post(self, authenticated_client, user):
        post = mixer.blend(Post, author=user)

        response = authenticated_client.post(f'/api/posts/{post.id}/comments/', {'content': 'Great post!'})
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['content'] == 'Great post!'

    def test_get_comments_of_post(self, authenticated_client, user):
        post = mixer.blend(Post, author=user)
        mixer.blend(Comment, author=user, post=post, content='First comment')
        mixer.blend(Comment, author=user, post=post, content='Second comment')

        response = authenticated_client.get(f'/api/posts/{post.id}/comments/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2

    def test_create_post_view(self, client, user):
        client.force_authenticate(user=user)
        response = client.post(reverse('post-list'), {'content': 'New post content'})
        assert response.status_code == status.HTTP_201_CREATED
        assert Post.objects.count() == 1
        assert Post.objects.first().content == 'New post content'

    def test_get_posts_view(self, authenticated_client, setup_posts):
        response = authenticated_client.get(reverse('post-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 4

    def test_get_post_details_view(self, authenticated_client, post):
        response = authenticated_client.get(reverse('post-detail', args=[post.id]))
        assert response.status_code == status.HTTP_200_OK
        assert response.data['content'] == post.content

    def test_add_comment_to_post_view(self, client, post, user):
        client.force_authenticate(user=user)
        response = client.post(reverse('comment-list', args=[post.id]), {'content': 'Great post!'})
        assert response.status_code == status.HTTP_201_CREATED
        assert post.comments.count() == 1
        assert post.comments.first().content == 'Great post!'

    def test_get_comments_of_post_view(self, authenticated_client, post, user):
        mixer.blend(Comment, author=user, post=post, content='First comment')
        mixer.blend(Comment, author=user, post=post, content='Second comment')

        response = authenticated_client.get(reverse('comment-list', args=[post.id]))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
