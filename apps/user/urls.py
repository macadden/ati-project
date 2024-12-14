from django.urls import path
from .views import (
    FollowUser,
    UnfollowUser,
    UserList,
    UserDetail,
    UserProfile,
)

urlpatterns = [
    path('', UserList.as_view(), name='user-list'),
    path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('<int:user_id>/follow/<int:follow_id>/', FollowUser.as_view(), name='follow-user'),
    path('<int:user_id>/unfollow/<int:follow_id>/', UnfollowUser.as_view(), name='unfollow-user'),
    path('auth/user/', UserProfile.as_view(), name='user-profile'),
]
