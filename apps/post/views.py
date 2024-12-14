import logging
from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from datetime import datetime

from utils.pagination import SmallSetPagination
from utils.permissions import IsAuthenticated
from utils.post_services import change_post_status
from .models import Comment, Post
from .serializers import PostSerializer, CommentSerializer, PostStatusSerializer

logger = logging.getLogger(__name__)

class PostList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            author_id = request.query_params.get('author_id', None)
            from_date = request.query_params.get('from_date', None)
            to_date = request.query_params.get('to_date', None)
            status = request.query_params.get('status', None)

            if from_date:
                try:
                    # Convierte a datetime a medianoche
                    from_date = datetime.combine(datetime.strptime(from_date, '%Y-%m-%d').date(), datetime.min.time())
                    # from_date = datetime.strptime(from_date, '%Y-%m-%d').date()
                except ValueError as err:
                    logger.error(f"{str(err)}")
                    return Response({'error': 'Invalid from_date format, should be YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)
            if to_date:
                try:
                    # Convierte a datetime a fin del día
                    to_date = datetime.combine(datetime.strptime(to_date, '%Y-%m-%d').date(), datetime.max.time())
                    # to_date = datetime.strptime(to_date, '%Y-%m-%d').date()
                except ValueError as err:
                    logger.error(f"{str(err)}")
                    return Response({'error': 'Invalid to_date format, should be YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

            queryset = Post.objects.select_related('author').order_by('-created_at')
            if author_id:
                queryset = queryset.filter(author_id=author_id)
            if from_date:
                queryset = queryset.filter(created_at__gte=from_date)
            if to_date:
                queryset = queryset.filter(created_at__lte=to_date)
            if status:
                queryset = queryset.filter(status=status)

            paginator = SmallSetPagination()
            page = paginator.paginate_queryset(queryset, request)
            serializer = PostSerializer(page, many=True)

            logger.info("Posts retrieved successfully")
            return paginator.get_paginated_response(serializer.data)
        except ValidationError as ve:
            logger.error(f"Validation error: {str(ve)}")
            return Response({'error': f'Validation error: {str(ve)}'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            if not request.user.is_authenticated:
                return Response({'error': 'Authentication credentials were not provided.'}, status=status.HTTP_401_UNAUTHORIZED)

            data = request.data.copy()
            data['status'] = data.get('status', 'draft')

            serializer = PostSerializer(data=data)
            if serializer.is_valid():
                serializer.save(author=request.user)
                logger.info(f"Post created successfully by user {request.user.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except ValidationError as ve:
            logger.error(f"Validation error: {str(ve)}")
            return Response({'error': f'Validation error: {str(ve)}'}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PostDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            post = Post.objects.select_related('author').prefetch_related('comments__author').get(pk=pk)
            serializer = PostSerializer(post)
            logger.info(f"obteniendo detalles del posts #{pk}")
            return Response(serializer.data)
        except Post.DoesNotExist:
            logger.error(f"Post not found: #{pk}")
            return Response({'error': f'Post #{pk} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            data = request.data.copy()
            serializer = PostSerializer(post, data=data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Post.DoesNotExist:
            logger.error(f"Post not found: #{pk}")
            return Response({'error': f'Post #{pk} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PublishBlogPostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, format=None):
        try:
            serializer = PostStatusSerializer(data=request.data)
            if serializer.is_valid():
                change_post_status(pk, 'published')
                return Response({'success': 'Post published successfully'})

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Post.DoesNotExist:
            logger.error(f"Post not found: #{pk}")
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DraftBlogPostView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk, format=None):
        try:
            serializer = PostStatusSerializer(data=request.data)
            if serializer.is_valid():
                change_post_status(pk, 'draft')
                return Response({'success': 'Post saved as draft'})

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Post.DoesNotExist:
            logger.error(f"Post not found: #{pk}")
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DeleteBlogPostView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        try:
            post = Post.objects.get(pk=pk)
            logger.warning(f"Trying to delete post: #{pk}")
            post.delete()

            return Response({'success': 'Post deleted successfully'})
        except Post.DoesNotExist:
            logger.error(f"Post not found: #{pk}")
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommentList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            post = Post.objects.prefetch_related('comments__author').get(pk=pk)
            comments = post.comments.all()
            serializer = CommentSerializer(comments, many=True)
            return Response(serializer.data)
        except Post.DoesNotExist:
            logger.error(f"Post not found: #{pk}")
            return Response({'error': f'Post #{pk} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, pk):
        data = request.data.copy()
        data['post'] = pk
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, post_pk, comment_pk, format=None):
        try:
            print(f"Eliminando comentario {comment_pk} del post {post_pk}")
            post = Post.objects.get(pk=post_pk)
            comment = Comment.objects.get(pk=comment_pk, post=post)  # Obtener el comentario asociado a este post

            if comment.author != request.user:
                return Response({'error': 'You can only delete your own comments'}, status=status.HTTP_403_FORBIDDEN)

            comment.delete()
            return Response({'success': 'Comment deleted successfully'}, status=status.HTTP_200_OK)

        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
