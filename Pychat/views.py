from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib import auth


def home(request):
    if request.method == 'GET':
        return render(request, 'index.html')
    elif request.method == 'POST':
        try:
            user_name = request.POST['Username']
            password1 = request.POST['Password1']
            password2 = request.POST['Password2']
        except BaseException:
            user_name3 = request.POST['Username3']
            password3 = request.POST['Password3']
            user = auth.authenticate(username=user_name3, password=password3)
            if user is None:
                return render(request, 'index.html', {'错误': '用户名或密码错误'})
        else:
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
