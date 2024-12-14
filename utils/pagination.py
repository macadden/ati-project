from rest_framework.pagination import PageNumberPagination


class SmallSetPagination(PageNumberPagination):
    page_query_param = 'page_number'
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100
