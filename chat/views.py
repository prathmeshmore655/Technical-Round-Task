from django.http import JsonResponse
from django.shortcuts import redirect, render, HttpResponse
from django.contrib.auth import authenticate, login, logout  
from django.contrib.auth.models import User
import json

# Create your views here.

def index(request):
    return render(request, 'index.html', {"message": ''})





def home(request):


        user = request.user
        l_user = User.objects.get(username=user)
        all_users = User.objects.exclude(username=user)


        id_or_what = request.user.id

        return render(request, 'home.html', {"users": all_users, "l_user": l_user , "user" : id_or_what})



def create_account(request):
    return render(request, 'create_account.html')





def login_view(request):  
    if request.method == 'POST':


        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
          

            login(request, user)


            return JsonResponse({"message": "Login successful"})
        else:
            message = 'Incorrect Username or Password'
            return JsonResponse({"message": message})

    return redirect('index')






def account_creation(request):


    data = json.loads(request.body)



    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    password = data.get('password')



    if User.objects.filter(username=username).exists():

        return JsonResponse({"message": "Username already exists"}, status=400)
    


    user = User.objects.create(username=username, first_name=first_name, last_name=last_name)

    user.set_password(password)

    user.save()



    return JsonResponse({"data": "Account Created Successfully"})
