from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    path('register', views.register),
    path('login', views.login),
    path('instruction',views.instruction),
    path('logout', views.logout),
    path('landing', views.landing),
    path('edit_user_info/<int:user_id>',views.edit_user),
    path('submit',views.submit),
    path('scoreboard', views.scoreboard),
    # path('fakedata/<int:score>/<int:round_count>', views.fakedata)
]
