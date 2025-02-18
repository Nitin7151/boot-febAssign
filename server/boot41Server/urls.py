"""
URL configuration for boot41Server project.
"""
from django.urls import path, include

urlpatterns = [
    path('', include('schema.urls')),
]
