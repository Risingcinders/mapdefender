from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    path('gamestart', views.gameStart),
    path('updatescoreboard', views.updateScoreboard)
]
