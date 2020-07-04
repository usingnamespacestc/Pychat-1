from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib import auth


def home(request):
    if request.method == 'GET':
        return render(request, 'index.html')
    elif request.method == 'POST':
        user_name = request.POST['Username']
        password1 = request.POST['Password1']
        password2 = request.POST['Password2']
        if(user_name and password1 and password1):
            try:
                User.objects.get(username=user_name)
                return render(request, 'index.html', {'用户名错误': '该用户名已存在'})
            except User.DoesNotExist:
                if password1 == password2:
                    User.objects.create_user(
                        username=user_name, password=password1)
                    return render(request, 'index.html')
                else:
                    return render(request, 'index.html', {'密码错误': '两次密码不同'})
        