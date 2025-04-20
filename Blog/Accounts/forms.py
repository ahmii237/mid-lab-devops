from django import forms
from django.contrib.auth.models import User

class SignupForm(forms.Form):
  username = forms.CharField(max_length = 300 , required = True)
  email = forms.EmailField(required = True)
  password = forms.CharField(widget = forms.PasswordInput , required = True)
  
  def clean_username(self):
    username = self.cleaned_data.get('username')
    if User.objects.filter(username=username).exists():
        raise forms.ValidationError("Username already exists")
    return username
    

class PasswordChangeForm(forms.Form):
  old_password = forms.CharField(widget = forms.PasswordInput , required = True)
  new_password = forms.CharField(widget = forms.PasswordInput , required = True)
  confirm_password = forms.CharField(widget = forms.PasswordInput , required = True)
  
  def clean(self):
    cleaned_data = super().clean()
    password = cleaned_data.get("new_password")
    confirm = cleaned_data.get("confirm_password")
    
    if password and confirm and password != confirm:
        raise forms.ValidationError("Passwords do not match!")
  