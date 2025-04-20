from django.urls import path , include
from .views import PostViewSet , CommentViewSet
from rest_framework import routers

router = routers.DefaultRouter() 
router.register(r'posts', PostViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
  path('',include(router.urls)),
]
