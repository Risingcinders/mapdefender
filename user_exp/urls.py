from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    path('register', views.register),
    path('login', views.login),
    path('logout', views.logout),
    path('landing', views.landing),
    path('scoreboard', views.scoreboard),
    path('fakedata/<int:score>/<int:round_count>', views.fakedata)
]
