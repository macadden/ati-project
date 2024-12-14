from django.db import models

class PostManager(models.Manager):
    def published(self):
        return self.get_queryset().order_by('-created_at')

    def filter_by_author(self, author_id):
        return self.get_queryset().filter(author__id=author_id)

    def filter_by_date_range(self, from_date, to_date):
        return self.get_queryset().filter(created_at__range=[from_date, to_date])

    def recent_with_comments(self):
        queryset = self.published().select_related('author').prefetch_related(
            'comments_set'
        )
        return queryset
