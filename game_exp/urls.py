from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage),
    # path('register', views.register),
    # path('login', views.login),
    # path('logout', views.logout),
    # path('quotes', views.quotelist),
    # path('quotes/addquote', views.addquote),
    # path('quotes/<int:quoteid>/delete', views.quotedelete),
    # path('quotes/<int:quoteid>/addlike', views.addlike),
    # path('quotes/<int:quoteid>/unlike', views.unlike),
    # path('myaccount/<int:userid>', views.myaccount),
    # path('myaccount/<int:userid>/update', views.userupdate),
    # path('user/<int:userid>', views.userdetail)
]
