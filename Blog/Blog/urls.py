from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.generic import RedirectView

def api_root(request):
    """Root endpoint showing available API endpoints"""
    return JsonResponse({
        'message': 'Blog API - Use the React frontend at http://localhost:3000',
        'endpoints': {
            'posts': '/api/posts/',
            'signup': '/api/auth/signup/',
            'login': '/api/auth/login/',
            'current_user': '/api/auth/current-user/',
            'admin': '/admin/',
        },
        'frontend': 'http://localhost:3000',
        'documentation': 'See DOCKER_SETUP.md for full API documentation'
    })

urlpatterns = [
    path('', api_root, name='api_root'),  # Root endpoint with API info
    path('admin/', admin.site.urls),
    path('api/auth/', include('Accounts.urls')),  # Authentication endpoints
    path('api/', include('HomeApp.urls')),  # Posts endpoints
]


