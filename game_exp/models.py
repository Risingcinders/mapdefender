from django.db import models

# Create your models here.


# class UserManager(models.Manager):
#     def registration_validator(self, postData):
#         errors = {}
#         if len(postData['first_name']) < 2:
#             errors["first_name"] = "First Name must be at least 2 characters"
#         if len(postData['last_name']) < 2:
#             errors["last_name"] = "Last Name must be at least 3 characters"
#         EMAIL_REGEX = re.compile(
#             r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
#         if not EMAIL_REGEX.match(postData['email']):
#             errors['email'] = "Invalid email address!"
#         users = User.objects.all()
#         emaillist = []
#         for user in users:
#             emaillist.append(user.email)
#         if postData['email'] in emaillist:
#             errors['duplicate'] = "That email already exists"
#         if (len(postData['password']) < 8):
#             errors['password'] = "Password must be at least 8 characters"
#         if postData["password2"] != postData["password"]:
#             errors["passwordmatch"] = "Your passwords do not match!"
#         return errors

#     def login_validator(self, postData):
#         login_errors = {}
#         EMAIL_REGEX = re.compile(
#             r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
#         if not EMAIL_REGEX.match(postData['email']):
#             login_errors['email2'] = "Invalid email address!"
#         if (len(postData['password']) < 8):
#             login_errors['password2'] = "Password must be at least 8 characters"
#         return login_errors
    
#     def edit_validator(self, postData, sesData):
#         edit_errors = {}
#         if len(postData['first_name']) < 1:
#             edit_errors["first_name"] = "First Name cannot be blank"
#         if len(postData['last_name']) < 1:
#             edit_errors["last_name"] = "Last Name cannot be blank"
#         users = User.objects.all()
#         emaillist = []
#         for user in users:
#             emaillist.append(user.email)
#         if (postData['email'] in emaillist) and (postData['email'] != sesData['userid']):
#             edit_errors['duplicate'] = "That email already exists"  # this needs to confirm current user can duplicate their name
#         EMAIL_REGEX = re.compile(
#             r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
#         if not EMAIL_REGEX.match(postData['email']):
#             edit_errors['email2'] = "Invalid email address!"
#         return edit_errors


# class QuoteManager(models.Manager):
#     def quote_validator(self, postData):
#         quote_errors = {}
#         if (len(postData['author']) < 3):
#             quote_errors['author'] = "Author names must be longer than 3 characters."
#         if (len(postData['quote_text']) < 10):
#             quote_errors['quote_text'] = "Quotes must be at least 11 characters.  Make em count!"
#         return quote_errors



# class User(models.Model):
#     first_name = models.CharField(max_length=255)
#     last_name = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)
#     email = models.CharField(max_length=255)
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     objects = UserManager()


# class Quote(models.Model):
#     author = models.CharField(max_length=255)
#     quote_text = models.TextField()
#     uploaded_by = models.ForeignKey(User, related_name="uploads", on_delete=models.CASCADE)
#     liked_by = models.ManyToManyField(User, related_name='liked_quotes')
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     objects = QuoteManager()
