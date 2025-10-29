from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Post
from .serializers import PostSerializer


class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of a post to edit/delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author of the post
        return obj.author == request.user


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            # Only authenticated users can create, update, or delete posts
            permission_classes = [permissions.IsAuthenticated, IsAuthorOrReadOnly]
        else:
            # Anyone can view posts (list, retrieve)
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        # Automatically set the author to the current user
        serializer.save(author=self.request.user)
