from django.db import models
from django.utils import timezone
from apps.user.models import User
from .managers import PostManager

def blog_thumbnail_directory(instance, filename):
    # Define la carpeta donde se guardarán las imágenes
    return 'blog/{0}/{1}'.format(instance.author.username, filename)

class Post(models.Model):

    DRAFT = 'draft'
    PUBLISHED = 'published'
    POST_STATUS_CHOICES = [
        (DRAFT, 'Draft'),
        (PUBLISHED, 'Published'),
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    thumbnail = models.ImageField(upload_to=blog_thumbnail_directory, max_length=500, blank=True, null=True)
    status = models.CharField(max_length=10, choices=POST_STATUS_CHOICES, default=DRAFT)

    objects = PostManager()

    class Meta:
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['author']),
        ]

    def __str__(self):
        return f"Post by {self.author.username} on {self.created_at}"


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.created_at}"
