from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('Accounts.urls')),  # Authentication endpoints
    path('api/', include('HomeApp.urls')),  # Posts endpoints
]

