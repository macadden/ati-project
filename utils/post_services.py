from apps.post.models import Post


def change_post_status(post_id, new_status):
    try:
        post = Post.objects.get(pk=post_id)
        post.status = new_status
        post.save()
        return post
    except Post.DoesNotExist:
        return None
