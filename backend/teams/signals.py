from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Team, Member

User = get_user_model()


@receiver(post_save, sender=Team)
def add_team_creator_to_member(sender, instance, created, **kwargs):
	if created:
		member = Member(team=instance, user=instance.creator, role='Leader', has_joined=True)
		member.save()