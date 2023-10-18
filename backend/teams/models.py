from django.db import models
import datetime
from accounts.models import UserAccount

class Team(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    date_created = models.DateTimeField(default=datetime.datetime.now())
    creator = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='teams')


class Member(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    role = models.CharField(max_length=255, default='Member')
    has_joined = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'team')
