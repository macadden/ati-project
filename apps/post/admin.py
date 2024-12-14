from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'thumbnail', 'created_at')  # Agregar 'thumbnail' aquí
    search_fields = ('content',)
    list_filter = ('created_at', 'author')  # TODO: add published
    actions = ['list_recent_with_comments', 'filter_by_author_action', 'filter_by_date_range_action']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if 'recent' in request.GET:
            return Post.objects.recent_with_comments()
        return qs

    def list_recent_with_comments(self, request, queryset):
        recent_posts = Post.objects.recent_with_comments()
        count = recent_posts.count()
        self.message_user(request, f"Found {count} recent posts with comments.")
        return recent_posts

    list_recent_with_comments.short_description = "List recent posts with comments"

    def filter_by_author_action(self, request, queryset):
        # Add a filter by author using a form in the admin
        author_id = request.GET.get('author_id')
        if author_id:
            queryset = Post.objects.filter_by_author(author_id)
            self.message_user(request, f"Filtered by author ID: {author_id}")
        else:
            self.message_user(request, 'No author ID provided.')
        return queryset

    def filter_by_date_range_action(self, request, queryset):
        # Add a filter by date range using a form in the admin
        from_date = request.GET.get('from_date')
        to_date = request.GET.get('to_date')
        if from_date and to_date:
            queryset = Post.objects.filter_by_date_range(from_date, to_date)
            self.message_user(request, f"Filtered by date range from {from_date} to {to_date}")
        else:
            self.message_user(request, 'No date range provided.')
        return queryset

    def get_actions(self, request):
        actions = super().get_actions(request)
        actions['filter_by_author_action'] = (self.filter_by_author_action, 'filter_by_author_action', 'Filter by author')
        actions['filter_by_date_range_action'] = (self.filter_by_date_range_action, 'filter_by_date_range_action', 'Filter by date range')
        return actions