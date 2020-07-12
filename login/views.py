# login/views.py
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.models import User
from django.contrib import auth
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from linkdb.models import User as UserModel
import json
import hashlib
from django.http import JsonResponse


def create(request):
    data = json.loads(request.body.decode('utf-8'))
    username = data['regUsername']
    password = data['regPassword']

    password = password.encode('utf-8')
    password = hashlib.sha1(password).hexdigest()
    print(username, password)
    try:
        user1 = UserModel.objects.get(user_id=username)
        user2 = User.objects.get(username=username)
        print('failed')
        return JsonResponse({'error':'用户名已存在'})
    except UserModel.DoesNotExist:
        print('success')
        user1 = UserModel.objects.create(user_id=username, pwd=password)
        print(user1)
        print('success1')
        user2 = User.objects.create_user(username=username, password=password)
        print('success2')
        token, created = Token.objects.get_or_create(user=user2)
        print('success3')
        return JsonResponse({'success':True, 'uid':username, 'Authorization': 'Token {}'.format(token.key)}, safe=False)



def index(request):
    # print(request.POST['data'])
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    # return HttpResponse(request.POST.items())
    username = data['logUsername']
    password = data['logPassword']
    password = password.encode('utf-8')
    password = hashlib.sha1(password).hexdigest()
    print(username, password)
    
    try:
        user1 = UserModel.objects.get(user_id=username, pwd=password)
        print("findsuccess1")
        user = auth.authenticate(username=username, password=password)
        print("findsuccess2")
        user2 = User.objects.get_or_create(username=user.username)
        print("findsuccess3")
        
        print('success')
        print(user1)
        print(user2)
        print(user)
        token, created = Token.objects.get_or_create(user=user)
        print('Token {}'.format(token.key))
        return JsonResponse({'Authorization': 'Token {}'.format(token.key), 'success':True, 'uid':user.id})
    except UserModel.DoesNotExist:
        print('failed')
        return JsonResponse({'error':'用户名或密码错误'})