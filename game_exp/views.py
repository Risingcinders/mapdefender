from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Instance
from user_exp.models import User
import datetime
# import bcrypt




# def backhome(request):
#     return redirect('/')

def homepage(request):
    if 'userid' in request.session:
        # return redirect('/game')
        pass
    return render(request, "game.html")

def gameStart(request):
    if not 'userid' in request.session:
        return redirect('/')
    else:
        logged_in_user = User.objects.get(email=request.session['userid'])
    context={
        'logged_in_user':logged_in_user
    }
    Instance.objects.create(gold=2000, score=0,round_count=0)
    return redirect('/game',context)


# def register(request):
#     if request.method != 'POST':
#         return redirect('/')
#     errors = User.objects.registration_validator(request.POST)
#     if len(errors) > 0:
#         for key, value in errors.items():
#             messages.error(request, value, extra_tags=key)
#         return redirect('/')
#     else:
#         pw_hash = bcrypt.hashpw(
#             request.POST['password'].encode(), bcrypt.gensalt()).decode()
#         User.objects.create(first_name=request.POST['first_name'], last_name=request.POST['last_name'],
#                             password=pw_hash, email=request.POST['email'])
#         request.session['userid'] = request.POST['email']
#     return redirect('/quotes')


# def login(request):
#     if request.method != 'POST':
#         return redirect('/')
#     login_errors = User.objects.login_validator(request.POST)
#     if len(login_errors) > 0:
#         for key, value in login_errors.items():
#             messages.error(request, value, extra_tags=key)
#         return redirect('/')
#     if 'userid' in request.session:
#         return redirect('/quotes')
#     checkuser = User.objects.filter(email=request.POST['email'])
#     if checkuser:
#         loggeduser = checkuser[0]
#         if bcrypt.checkpw(request.POST['password'].encode(), loggeduser.password.encode()):
#             request.session['userid'] = request.POST['email']
#             return redirect('/quotes')
#         else:
#             messages.error(request, "Invalid Email or Password.",
#                            extra_tags='loginerr')
#     return redirect('/')


# def logout(request):
#     if not 'userid' in request.session:
#         return redirect('/')
#     del request.session['userid']
#     return redirect('/')


# def quotelist(request):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     context = {
#         "logged_in_user": logged_in_user,
#         "quotes": Quote.objects.all()
#     }
#     return render(request, "quotes.html", context)


# def addquote(request):
#     if request.method != 'POST':
#         return redirect('/')
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     quote_errors = Quote.objects.quote_validator(request.POST)
#     if len(quote_errors) > 0:
#         for key, value in quote_errors.items():
#             messages.error(request, value, extra_tags=key)
#         return redirect('/quotes')
#     Quote.objects.create(
#         author=request.POST['author'], quote_text=request.POST['quote_text'], uploaded_by=logged_in_user)
#     newquote = Quote.objects.last()
#     newquote.liked_by.set([logged_in_user])
#     return redirect('/quotes')


# def quotedelete(request, quoteid):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     thisquote = Quote.objects.get(id=quoteid)
#     if not thisquote.uploaded_by.id == logged_in_user.id:
#         messages.error(request, "You cannot delete this quote.",
#                        extra_tags='quoteowner')
#         return redirect('/quotes')
#     else:
#         thisquote.delete()
#     return redirect('/quotes')


# def addlike(request, quoteid):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     thisquote = Quote.objects.get(id=quoteid)
#     thisquote.liked_by.add(logged_in_user)
#     return redirect('/quotes')


# def unlike(request, quoteid):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     thisquote = Quote.objects.get(id=quoteid)
#     thisquote.liked_by.remove(logged_in_user)
#     return redirect('/quotes')


# def myaccount(request, userid):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     context = {
#         "logged_in_user": logged_in_user
#     }
#     return render(request, "myaccount.html", context)


# def userupdate(request, userid):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     if request.method != 'POST':
#         return redirect('/')
#     thisuser = User.objects.get(id=userid)
#     if logged_in_user.id != thisuser.id:
#         messages.error(request, "You cannot edit other users.",
#                        extra_tags='otheredit')
#         return redirect('/myaccount/' + str(logged_in_user.id))
#     edit_errors = User.objects.edit_validator(request.POST, request.session)
#     if len(edit_errors) > 0:
#         for key, value in edit_errors.items():
#             messages.error(request, value, extra_tags=key)
#         return redirect('/myaccount/' + str(logged_in_user.id))
#     thisuser.first_name = request.POST['first_name']
#     thisuser.last_name = request.POST['last_name']
#     thisuser.email = request.POST['email']
#     thisuser.save()
#     request.session['userid'] = thisuser.email
#     return redirect('/myaccount/' + str(logged_in_user.id))


# def userdetail(request, userid):
#     if not 'userid' in request.session:
#         return redirect('/')
#     else:
#         global logged_in_user
#         logged_in_user = User.objects.get(email=request.session['userid'])
#     thisuser = User.objects.get(id=userid)
#     context = {
#         "thisuser": thisuser,
#         "logged_in_user": logged_in_user,
#         "uploaded_by_list": User.objects.get(id=userid).uploads.all()
#     }
#     return render(request, "userdetail.html", context)
