# login/views.py
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.models import User
from django.contrib import auth
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
import json
from django.http import JsonResponse


def create(request):
    user_name = request.POST['Username']
    password1 = request.POST['Password1']
    password2 = request.POST['Password2']
    user = auth.authenticate(username=user_name, password=password1)
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



def index(request):
    # print(request.POST['data'])
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    # return HttpResponse(request.POST.items())
    username = data['logUsername']
    password = data['logPassword']
    print(username, password)
    user = auth.authenticate(username=username, password=password)
    if user is not None:
        request.session['member_id'] = user.id
        token, created = Token.objects.get_or_create(user=user)
        print('Token {}'.format(token.key))
        print('success')
        return JsonResponse({'Authorization': 'Token {}'.format(token.key), 'success':True})
    else:
        print('failed')
        return JsonResponse({'error':'用户名或密码错误'})