from rest_framework import serializers
from .models import  Comment, Post
from apps.user.serializers import UserSerializer


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'content', 'thumbnail', 'status', 'created_at', 'comments']
    
    def get_comments(self, obj):
        comments = obj.comments.order_by('-created_at')
        return CommentSerializer(comments, many=True).data
    
    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Post content cannot be empty")
        if len(value) < 1:
            raise serializers.ValidationError("Post content must be at least 1 characters long.")
        return value
    
    def update(self, instance, validated_data):
        # Actualiza el estado y la imagen (si la nueva imagen se proporciona)
        thumbnail = validated_data.get('thumbnail', None)
        if thumbnail:
            instance.thumbnail = thumbnail
        instance.status = validated_data.get('status', instance.status)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance
    
class PostStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Post.POST_STATUS_CHOICES)
    
    def update(self, instance, validated_data):
        """
        Cambia el estado del post usando los datos validados.
        """
        instance.status = validated_data['status']
        instance.save()
        return instance


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())
    # TODO: add something like post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.filter(is_published=True))

    class Meta:
        model = Comment
        fields = ['id', 'author', 'post', 'content', 'created_at']

    def validate_content(self, value):
        if not value.strip():
            raise serializers.ValidationError("Comment content cannot be empty")
        if len(value) < 1:
            raise serializers.ValidationError("Post content must be at least 1 characters long.")
        return value
