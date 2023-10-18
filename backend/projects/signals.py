from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import Task, Project



@receiver(pre_delete, sender=Task)
def update_project_timeline_on_delete(sender, instance, **kwargs):
    project = instance.project

    # Get the earliest start time and latest end time among the remaining tasks
    tasks = project.task_set.exclude(id=instance.id)
    earliest_start_time = tasks.order_by('start_time').first().start_time if tasks.exists() else None
    latest_end_time = tasks.order_by('-end_time').first().end_time if tasks.exists() else None

    # Update project start time and end time
    project.start_time = earliest_start_time
    project.end_time = latest_end_time
    project.save()
