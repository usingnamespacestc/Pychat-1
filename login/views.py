# login/views.py
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.models import User
from django.contrib import auth
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from linkdb.models import User as UserModel
from linkdb.models import GroupUser as GroupUser
import json
import hashlib
from django.http import JsonResponse
from django.core import serializers
from rest_framework.renderers import JSONRenderer



def create(request):
    data = json.loads(request.body.decode('utf-8'))
    username = data['regUsername']
    password = data['regPassword']
    print(username, password)
    password = password.encode('utf-8')
    print(password)
    password = hashlib.sha1(password).hexdigest()
    print(username, password)
    try:
        user1 = UserModel.objects.get(user_id=username)
        user2 = User.objects.get(username=username)
        print('failed')
        return JsonResponse({'error':'用户名已存在'})
    except UserModel.DoesNotExist:
        print('success')
        user1 = UserModel.objects.create(user_id=username, pwd=password, nickname=username, description="这个人很懒，啥也没写。", icon="https://file.stc.ldby.site:12345/data/User/pychat/home/icon/6.jpg")
        print(user1)
        print('success1')
        user2 = User.objects.create_user(username=username, password=password)
        print('success2')
        token, created = Token.objects.get_or_create(user=user2)
        print('success3')
        AllQ = UserModel.objects.raw("select user_id, nickname from user")
        AllList = []
        for p in AllQ:
            user_dict = {k: getattr(p, k) for k in ['user_id', 'nickname']}
            user_dict['value'] = "{}({})".format(user_dict['user_id'], user_dict['nickname'])
            del user_dict["user_id"]
            AllList.append(user_dict)
        return JsonResponse({'success':True, 'uid':username, 'Authorization': 'Token {}'.format(token.key), 'nickname': username, 'description': "这个人很懒，啥也没写。", 
        "icon":"https://file.stc.ldby.site:12345/data/User/pychat/home/icon/6.jpg", "friendsList": [], "allList":AllList}, safe=False)



def index(request):
    # print(request.POST['data'])
    data = json.loads(request.body.decode('utf-8'))
    print(data)
    # return HttpResponse(request.POST.items())
    username = data['logUsername']
    password = data['logPassword']
    password = password.encode('utf-8')
    # print(pas)
    password = hashlib.sha1(password).hexdigest()
    print(username, password)
    
    try:
        user1 = UserModel.objects.get(user_id=username, pwd=password)
        selfIcon = getattr(user1, 'icon')
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
        nickname = getattr(user1, 'nickname')
        descrip = getattr(user1, 'description')
        print('Token {}'.format(token.key))
        AllQ = UserModel.objects.raw("select user_id, nickname from user")
        L = UserModel.objects.raw("select * from user, user_user where user_user.main_user_id = \"%s\" and user_user.vice_user_id = user.user_id" % username)
        friends = []
        AllList = []
        groupList = []
        for p in AllQ:
            user_dict = {k: getattr(p, k) for k in ['user_id', 'nickname']}
            user_dict['value'] = "{}({})".format(user_dict['user_id'], user_dict['nickname'])
            del user_dict["user_id"]
            AllList.append(user_dict)
        for p in L:
            user_dict = {k: getattr(p, k) for k in ['user_id', 'nickname', 'description', 'remark', 'type', 'icon']}
            friends.append(user_dict)
        gl = GroupUser.objects.raw("select * from group_user where group_user.user_id = \"%s\"" % username)
        for p in gl:
            group_dict = {k: getattr(p, k) for k in ['group_id']}
            groupList.append(group_dict)
        return JsonResponse({'Authorization': 'Token {}'.format(token.key), 'success':True, 'uid':username, 
        'nickname':nickname, 'description': descrip, 'friendsList':friends, 'icon': selfIcon, 'allList':AllList, 'groupList':groupList})
    except UserModel.DoesNotExist:
        print('failed')
        return JsonResponse({'error':'用户名或密码错误'})