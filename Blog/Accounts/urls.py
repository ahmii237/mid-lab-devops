from django.urls import path
from . import views

urlpatterns = [
  path('signup/', views.CreateUser, name='signup'),
  path('login/', views.LoginView, name='login'),
  path('logout/', views.LogoutView, name='logout'),
  path('change-password/', views.ChangePassword, name='change_password'),
]