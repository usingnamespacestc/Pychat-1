from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib import auth


def home(request):
    return render(request, 'index.html')