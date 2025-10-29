from django.urls import path
from . import api_views

# API endpoints with JWT authentication
urlpatterns = [
    path('signup/', api_views.signup, name='api_signup'),
    path('login/', api_views.login_user, name='api_login'),
    path('current-user/', api_views.current_user, name='current_user'),
]
