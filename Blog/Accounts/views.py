from django.shortcuts import render , redirect , HttpResponseRedirect
from django.contrib.auth.models import User 
from django.contrib.auth import login , authenticate , logout 
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import SignupForm , PasswordChangeForm


def CreateUser(request):
  if request.method == 'POST':
    form = SignupForm(request.POST)
    
    if form.is_valid():
      username = form.cleaned_data['username']
      email = form.cleaned_data['email']
      password = form.cleaned_data['password']
      user = User.objects.create_user(username = username , email = email , password = password)
      user.save()  
      messages.success(request , 'Account is succesfully created')
      return redirect('login')
    
  else:
    form = SignupForm()
    
  return render (request , 'Accounts/signup.html', {'form' : form})  
      
  
def LoginView(request):
  if request.method == 'POST':
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request , username = username , password = password)
    if user is not None :
      login(request , user)
      return HttpResponseRedirect('http://localhost:3000/')
    
    else :
      messages.error(request,"Invalid username or password")
      return redirect('login')
     
  return render (request , 'Accounts/login.html')  

def LogoutView(request):
    logout(request)
    messages.success(request , 'You have succesfully logged out ,Thanks for visiting :)')
    return redirect('signup')
  

@login_required
def ChangePassword(request):
  if request.method == 'POST':
    form = PasswordChangeForm(request.POST)
    
    if form.is_valid(): 
      old_password = form.cleaned_data['old_password']
      new_password = form.cleaned_data['new_password']
      user = request.user
      
      if user.check_password(old_password):
        user.set_password(new_password)
        user.save()
        messages.success(request, "Your password has succesfully changed")
        login(request,user)
        return redirect('http://localhost:3000/')
      
      else :
        messages.error(request , 'Use a valid password')
        
    else:
      messages.error(request, 'please check the fields')  
      
  else:
    form = PasswordChangeForm()  
  return render(request , 'Accounts/change-password.html', {'form' : form})
        