import logging
from rest_framework import (
    status,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from utils.pagination import SmallSetPagination
from utils.permissions import IsAuthenticated
from .models import User
from .serializers import (
    FollowSerializer,
    UserSerializer,
)
 
from apps.user import serializers
# from apps.user.tasks import send_welcome_email

logger = logging.getLogger(__name__)


class UserList(APIView):

    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_403_FORBIDDEN)

        try:
            paginator = SmallSetPagination()
            search_query = request.query_params.get('search', None)
            if search_query:
                users = User.objects.filter(
                    Q(username__icontains=search_query) | Q(email__icontains=search_query)
                )
            else:
                users = User.objects.all()

            paginated_users = paginator.paginate_queryset(users, request)
            serializer = UserSerializer(paginated_users, many=True)
            return paginator.get_paginated_response(serializer.data)

        except Exception as e:
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            logger.info("Creación de usuario con ID #%s OK.", user.id)

            # send_welcome_email.delay(user.id)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        logger.error("Error al devolver la data")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            serializer = UserSerializer(user)
            logger.info("sucess getting user %s", user.id)
            return Response(serializer.data)
        except User.DoesNotExist:
            logger.error("User %s not found", pk)
            return Response({'error': f'User {pk} not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)

            if user != request.user:
                return Response({"error": "You can only update your own profile."}, status=status.HTTP_403_FORBIDDEN)

            serializer = UserSerializer(user, data=request.data, partial=True)

            if serializer.is_valid():
                if 'profile_image' in request.data:
                    user.profile_image = request.data['profile_image']
                if 'cover_image' in request.data:
                    user.cover_image = request.data['cover_image']

                user.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response({'error': 'Internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserProfile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            logger.info(f"Request to get profile of user {request.user.id}")
            user = request.user
            serializer = UserSerializer(user)
            logger.info(f"Successfully retrieved profile for user {user.id}")
            return Response(serializer.data)        
        except Exception as e:
            logger.error(f"Error retrieving profile for user {request.user.id}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FollowUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, follow_id):
        try:
            logger.info(f"Request to follow user: {user_id} following {follow_id}")

            serializer = FollowSerializer(data={'follow_id': follow_id}, context={'request': request})
            serializer.is_valid(raise_exception=True)
            
            follow_id = serializer.validated_data['follow_id']
            user_to_follow = User.objects.get(id=follow_id)
            
            request.user.following.add(user_to_follow)
            request.user.save()
            
            logger.info(f"User {request.user.id} successfully followed user {follow_id}")
            return Response({'success': f'Now following user {user_to_follow.username}'}, status=status.HTTP_200_OK)
        
        except serializers.ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except User.DoesNotExist:
            logger.error(f"User not found: follow_id={follow_id}")
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Internal server error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UnfollowUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id, follow_id):
        try:
            logger.info(f"Request to unfollow user: {user_id} unfollowing {follow_id}")

            user_to_unfollow = User.objects.get(id=follow_id)
            
            if not request.user.following.filter(id=user_to_unfollow.id).exists():
                return Response({'error': 'You are not following this user.'}, status=status.HTTP_400_BAD_REQUEST)

            request.user.following.remove(user_to_unfollow)
            request.user.save()
            
            logger.info(f"User {request.user.id} successfully unfollowed user {follow_id}")
            return Response({'success': f'You have unfollowed user {user_to_unfollow.username}'}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            logger.error(f"User not found: follow_id={follow_id}")
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"Internal server error: {str(e)}")
            return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
