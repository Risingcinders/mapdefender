from django.db import models
from user_exp.models import User

# Create your models here.

class Instance(models.Model):
    gold = models.IntegerField()
    score = models.IntegerField()
    round_count = models.IntegerField()
    defender = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
