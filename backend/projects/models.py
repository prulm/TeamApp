import datetime
from django.db import models
from teams.models import Team, Member
from accounts.models import UserAccount


class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    creator = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='my_projects')
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='projects')
    startDate = models.DateField(null=True, blank=True)
    deadline = models.DateField()
    extendedDeadline = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    sharedFile = models.FileField(null=True, blank=True)
    date_created = models.DateTimeField(default=datetime.datetime.now())
    
    
class Task(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    is_recurring = models.BooleanField(default=False)
    cycle = models.IntegerField(blank=True)
    is_subtask = models.BooleanField(default=False)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subtasks')
    is_dependent = models.BooleanField(default=False)
    start_date = models.DateField(null=True, blank=True)
    deadline = models.DateField()
    extended_deadline = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    
class Assignee(models.Model):
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='tasks')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignees')

    class Meta:
        unique_together = ('member', 'task')


class File(models.Model):
    file = models.FileField(null=True, blank=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='files')


class Dependee(models.Model):
    dependee = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='dependers')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='dependees')


class Comment(models.Model):
    content = models.CharField(max_length=500)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, related_name='comments')
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    time = models.DateTimeField(default=datetime.datetime.now())