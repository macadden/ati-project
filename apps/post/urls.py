from django.urls import path
from .views import (
    DeleteCommentView,
    PostList,
    PostDetail,
    CommentList,
    PublishBlogPostView,
    DraftBlogPostView,
    DeleteBlogPostView,
)

urlpatterns = [
    path('', PostList.as_view(), name='post-list'),  # Vista para listar o crear posts
    path('<int:pk>/', PostDetail.as_view(), name='post-detail'),  # Vista para obtener detalles de un post específico
    path('<int:pk>/comments/', CommentList.as_view(), name='comment-list'),  # Comentarios de un post
    path('<int:pk>/publish/', PublishBlogPostView.as_view(), name='post-publish'),  # Publicar un post
    path('<int:pk>/draft/', DraftBlogPostView.as_view(), name='post-draft'),  # Cambiar un post a borrador
    path('<int:pk>/delete/', DeleteBlogPostView.as_view(), name='post-delete'),  # Eliminar un post
    path('<int:post_pk>/comments/<int:comment_pk>/delete/', DeleteCommentView.as_view(), name='comment-delete'),  # Eliminar comentario

]
