from django.db import models
import datetime
import re


class UserManager(models.Manager):
    def registration_validator(self, postData):
        errors = {}
        if len(postData['username']) < 2:
            errors["username"] = "First Name must be at least 2 characters"
        EMAIL_REGEX = re.compile(
            r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
        if not EMAIL_REGEX.match(postData['email']):
            errors['email'] = "Invalid email address!"
        users = User.objects.all()
        emaillist = []
        usernamelist = []
        for user in users:
            emaillist.append(user.email)
            usernamelist.append(user.username)
        if postData['username'] in emaillist:
            errors['duplicate2'] = "That username already exists"
        if postData['email'] in emaillist:
            errors['duplicate'] = "That email already exists"
        if (len(postData['password']) < 8):
            errors['password'] = "Password must be at least 8 characters"
        if postData["password2"] != postData["password"]:
            errors["passwordmatch"] = "Your passwords do not match!"
        return errors

    def login_validator(self, postData):
        login_errors = {}
        EMAIL_REGEX = re.compile(
            r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
        if not EMAIL_REGEX.match(postData['email']):
            login_errors['email2'] = "Invalid email address!"
        if (len(postData['password']) < 8):
            login_errors['password2'] = "Password must be at least 8 characters"
        return login_errors

    # def edit_validator(self, postData, sesData):
    #     edit_errors = {}
    #     if len(postData['username']) < 1:
    #         edit_errors["username"] = "First Name cannot be blank"
    #     users = User.objects.all()
    #     emaillist = []
    #     for user in users:
    #         emaillist.append(user.email)
    #     if (postData['email'] in emaillist) and (postData['email'] != sesData['userid']):
    #         # this needs to confirm current user can duplicate their name
    #         edit_errors['duplicate'] = "That email already exists"
    #     EMAIL_REGEX = re.compile(
    #         r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
    #     if not EMAIL_REGEX.match(postData['email']):
    #         edit_errors['email2'] = "Invalid email address!"
    #     return edit_errors


class User(models.Model):
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()


class Playthrough(models.Model):
    user_id = models.ForeignKey(User, related_name="playthroughs", on_delete = models.CASCADE)
    score = models.IntegerField()
    round_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
