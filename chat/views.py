# chat/views.py
from django.shortcuts import render, redirect, reverse
from django.contrib.auth.models import User
from django.contrib import auth
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

# @api_view(['GET'])
# @permission_classes((IsAuthenticated, ))
def index(request):
	return render(request, "index.html")
# class ChatView:
# 	permission_classes = (IsAuthenticated,)
# 	def index(request):
# 		return render(request, "index.html")
