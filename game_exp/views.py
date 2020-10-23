from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Instance
from user_exp.models import User, Playthrough
import datetime
# import bcrypt


# def backhome(request):
#     return redirect('/')
# global logged_in_user

def homepage(request):
    if 'userid' in request.session:
        # return redirect('/game')
        pass
    return render(request, "game.html")


def gameStart(request):
    # need to make a creative way to prevent page refresh from being advantageous to player.
    if not 'userid' in request.session:
        return redirect('/')
    else:
        logged_in_user = User.objects.get(email=request.session['userid'])
    # Instance.objects.create(gold=2000, score=0, round_count=1, )   Only useful if we fully integrate ajax
    context = {
        'logged_in_user': logged_in_user
    }
    return redirect('/game', context)


def updateScoreboard(request):
    if request.method == 'POST':
        if 'score' in request.POST:
            if not 'userid' in request.session:
                return redirect('/')
            else:
                logged_in_user = User.objects.get(
                    email=request.session['userid'])
            Playthrough.objects.create(user_id = logged_in_user, score = request.POST['score'], round_count=request.POST['round'])
            return request
    return redirect('/')
