from apps.post.models import Post
import pytest
from django.contrib.auth import get_user_model

@pytest.fixture
def user(db):
    User = get_user_model()
    return User.objects.create_user(
        username='testuser',
        email='testuser@example.com',
        password='testpass',
    )

@pytest.fixture
def post(db, user):
    return Post.objects.create(content='Content', author=user)
