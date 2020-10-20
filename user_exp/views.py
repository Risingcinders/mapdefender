from django.shortcuts import render, redirect
from django.contrib import messages
from .models import User, Playthrough
import datetime
import bcrypt



def backhome(request):
    return redirect('/')

def homepage(request):
    if 'userid' in request.session:
        return redirect('/landing')
    return render(request, "index.html")


def register(request):
    if request.method != 'POST':
        return redirect('/')
    errors = User.objects.registration_validator(request.POST)
    if len(errors) > 0:
        for key, value in errors.items():
            messages.error(request, value, extra_tags=key)
        return redirect('/')
    else:
        pw_hash = bcrypt.hashpw(
            request.POST['password'].encode(), bcrypt.gensalt()).decode()
        User.objects.create(username=request.POST['username'],
                            password=pw_hash, email=request.POST['email'])
        request.session['userid'] = request.POST['email']
    return redirect('/game')


def login(request):
    if request.method != 'POST':
        return redirect('/')
    login_errors = User.objects.login_validator(request.POST)
    if len(login_errors) > 0:
        for key, value in login_errors.items():
            messages.error(request, value, extra_tags=key)
        return redirect('/')
    if 'userid' in request.session:
        return redirect('/landing')
    checkuser = User.objects.filter(email=request.POST['email'])
    if checkuser:
        loggeduser = checkuser[0]
        if bcrypt.checkpw(request.POST['password'].encode(), loggeduser.password.encode()):
            request.session['userid'] = request.POST['email']
            return redirect('/landing')
        else:
            messages.error(request, "Invalid Email or Password.",
                           extra_tags='loginerr')
    return redirect('/')


def logout(request):
    if not 'userid' in request.session:
        return redirect('/')
    del request.session['userid']
    return redirect('/')


def landing(request):
    if not 'userid' in request.session:
        return redirect('/')
    else:
        global logged_in_user
        logged_in_user = User.objects.get(email=request.session['userid'])
    context = {
        'all_users': User.objects.all(),
        'logged_in_user':logged_in_user,
    }
    return render(request, "myaccount.html",context)

def scoreboard(request):
    if not 'userid' in request.session:
        return redirect('/')
    else:
        logged_in_user = User.objects.get(email=request.session['userid'])
    context  = {
        'logged_in_user' : logged_in_user,
        'scores' : Playthrough.objects.all(),
    }
    return render(request, 'scoreboard.html', context)

def fakedata(request, score, round_count):
    if not 'userid' in request.session:
        return redirect('/')
    else:
        global logged_in_user
        logged_in_user = User.objects.get(email=request.session['userid'])
    print(f"created entry with {score} and {round_count} ")
    Playthrough.objects.create(score = score, round_count = round_count, user_id = logged_in_user)
    return redirect('/landing')

def edit_user(request,user_id):
    if not 'userid' in request.session:
        return redirect('/')
    else:
        logged_in_user = User.objects.get(email=request.session['userid'])
    context={
        'logged_in_user':logged_in_user
    }
    return render(request,"edit_user_info.html",context)
def submit(request):
    if request.method == "POST":
        errors = User.objects.edit_validator(request.POST,request.session)
        if len(errors)> 0:
            for key,value in errors.items():
                messages.error(request,value,extra_tags=key)
            return redirect('/edit_user_info')
    
        update = User.objects.get(id=logged_in_user.id)
        update.username=request.POST['username']
        update.email=request.POST['email']
        update.save()
        request.session['userid'] = update.email
        return redirect('/landing')
    else:
        return redirect ('/logout')
