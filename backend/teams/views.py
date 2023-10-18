from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework import status
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.response import Response
from rest_framework import permissions
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from teams.models import Team

class TeamCreateView(CreateAPIView):
	permission_classes = (permissions.IsAuthenticated, )
	serializer_class = TeamSerializer
 
	def perform_create(self, serializer):
		instance = serializer.save(creator=self.request.user)


class TeamLoadView(ListAPIView):
	permission_classes = (permissions.IsAuthenticated, )
	serializer_class = TeamLoadSerializer

	def get_queryset(self):
		return Team.objects.filter(members__user=self.request.user)


class TeamDeleteView(DestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class MemberCreateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = MemberCreateSerializer

    def post(self, request, *args, **kwargs):
        if not request.data.get('role'):
            emails = request.data.get('emails', [])
            team_id = request.data.get('team')
            team = Team.objects.get(id=team_id)
            created_members = []
            
            for email in emails:
                try:
                    user = User.objects.get(email=email)
                except User.DoesNotExist:
                    return Response({'error': f"User '{email}' does not exist. Users listed after couldn't be invited."}, status=status.HTTP_400_BAD_REQUEST)

                member = Member(user=user, team=team)
                member.save()
                created_members.append(member)

                send_member_invite_email(email, team.name, Member.objects.filter(team_id=team_id).exclude(user=user))

            serializer = self.get_serializer(instance=created_members, many=True)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            email = request.data.get('email')
            role = request.data.get('role')
            team_id = request.data.get('team')
            team = Team.objects.get(id=team_id)

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({'error': 'User with the specified email does not exist.'}, status=status.HTTP_400_BAD_REQUEST)

            member = Member(user=user, role=role, team=team)
            member.save()

            existing_members = Member.objects.filter(team_id=team_id).exclude(user=user)

            serializer = self.get_serializer(instance=member)
            send_member_invite_email(email, team.name, existing_members)

            return Response(serializer.data, status=status.HTTP_201_CREATED)


def send_member_invite_email(email, team_name, existing_members):
    subject = 'Invitation to join the team'

    # Compose the email body
    email_body = f"Hello,\n\nYou have been invited to join the team '{team_name}'.\n\n"
    email_body += "Existing team members:\n"
    for member in existing_members:
        email_body += f"- {member.user.first_name} {member.user.last_name}\n"
    email_body += "\nPlease register and join the team.\n\nBest regards,\nThe Team"

    send_mail(
        subject=subject,
        message=email_body,
        from_email='your-email@example.com',
        recipient_list=[email],
    )
