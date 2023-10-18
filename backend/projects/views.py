from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.views import APIView
from django.http import HttpResponse
from django.db.models import Min, Max
from rest_framework.response import Response
from reportlab.lib.pagesizes import letter
from django.utils.timezone import now
from reportlab.lib import pdfencrypt
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from rest_framework import permissions
from django.db.models import Prefetch
from django.core.mail import send_mail
from .serializers import *
from .models import *
from django.http import HttpResponse
from django.views import View
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


class CommentCreateView(CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class AttachFileAPIView(CreateAPIView):
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = (permissions.IsAuthenticated, )


class StartTaskAPIView(UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskCreateSerializer

    def perform_update(self, serializer):
        serializer.save(start_date=now().date())

class FinishTaskAPIView(UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskCreateSerializer

    def perform_update(self, serializer):
        serializer.save(end_date=now().date())
        project = instance.project
        if not project.end_date or instance.end_date > project.end_date:
            project.end_date = task.end_date

class GenerateReportView(APIView):
    def get(self, request, *args, **kwargs):
        project_id = request.GET.get('proj_id')
        project = Project.objects.get(id=project_id)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename=report.pdf'

        doc = SimpleDocTemplate(response, pagesize=letter)
        story = []

        styles = getSampleStyleSheet()
        title_style = styles['Title']
        heading_style = styles['Heading2']
        normal_style = styles['Normal']

        story.append(Paragraph(f'<u>{project.name} Report</u>', title_style))

        story.append(Paragraph('Project Details', heading_style))
        story.append(Paragraph(f'<b>Name:</b> {project.name}', normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f'<b>Description:</b> {project.description}', normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f'<b>Creator:</b> {project.creator.first_name} {project.creator.last_name}', normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f'<b>Start Date:</b> {project.startDate}', normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f'<b>Deadline:</b> {project.deadline}', normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f'<b>Extended Deadline:</b> {project.extendedDeadline}', normal_style))
        story.append(Spacer(1, 10))
        story.append(Paragraph(f'<b>End Date:</b> {project.end_date}', normal_style))
        story.append(PageBreak())

        # Team details
        story.append(Paragraph('Team Details', heading_style))
        story.append(Paragraph(f'<b>Name:</b> {project.team.name}', normal_style))
        story.append(Paragraph(f'<b>Description:</b> {project.team.description}', normal_style))
        members = project.team.members.all()
        for member in members:
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Member:</b> {member.user.first_name} {member.user.last_name}', normal_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Role:</b> {member.role}', normal_style))
            story.append(Spacer(1, 20))
        story.append(PageBreak())

        # Task details
        story.append(Paragraph('Task Details', heading_style))
        tasks = Task.objects.filter(project=project)
        for task in tasks:
            story.append(Paragraph(f'<b>Task:</b> {task.name}', normal_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Description:</b> {task.description}', normal_style))
            story.append(Spacer(1, 10))
            if task.is_recurring:
                story.append(Paragraph(f'<b>Recurrence Cycle:</b> Every {task.cycle} day(s)', normal_style))
                story.append(Spacer(1, 10))
            if task.is_subtask:
                story.append(Paragraph(f'<b>Subtask of:</b> {task.parent.name}', normal_style))
                story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Start Date:</b> {task.start_date}', normal_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Deadline:</b> {task.deadline}', normal_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Extended Deadline:</b> {task.extended_deadline}', normal_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>End Date:</b> {task.end_date}', normal_style))
            story.append(Spacer(1, 30))
        story.append(PageBreak())

        # Member details and assigned tasks
        story.append(Paragraph('Member Details', heading_style))
        members = project.team.members.all()
        for member in members:
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Member:</b> {member.user.first_name} {member.user.last_name}', normal_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f'<b>Role:</b> {member.role}', normal_style))
            assigned_tasks = Task.objects.filter(assignees__member=member)
            if assigned_tasks.exists():
                story.append(Paragraph('<b>Assigned Tasks:</b>', normal_style))
                for task in assigned_tasks:
                    story.append(Paragraph(f'- {task.name}', normal_style))

        doc.build(story)

        return response



class ProjectCreateView(CreateAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ProjectSerializer
    
    def perform_create(self, serializer):
        instance = serializer.save(creator=self.request.user)


class ProjectDetailView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = ProjectLoadSerializer

    def get_queryset(self):
        return Project.objects.prefetch_related(
        'tasks__subtasks'
    ).filter(team__members__user=self.request.user)


class ProjectDeleteView(DestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class TaskCreateView(CreateAPIView):
    queryset = Task.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = TaskSerializer

    def perform_create(self, serializer):
        task = serializer.save()

        assignees_data = self.request.data.get('assignees', [])
        assignees_data = assignees_data.split(',')

        for assignee_data in assignees_data:
            assignee_serializer = AssigneeSerializer(data={'member': assignee_data, 'task': task.id})
            if assignee_serializer.is_valid():
                assignee_serializer.save()

        if self.request.data.get('is_dependent'):
            dependees_data = self.request.data.get('dependees', [])
            for dependee_data in dependees_data:
                dependee_serializer = DependeeSerializer(data={'dependee': dependee_data, 'task': task.id})
                if dependee_serializer.is_valid():
                    dependee_serializer.save()            

        file = self.request.FILES.get('file')
        if file:
            file_serializer = FileSerializer(data={'task': task.id, 'file': file})
            if file_serializer.is_valid():
                file_serializer.save()

        assignees = [member.user.id for member in Member.objects.filter(id__in=assignees_data)]
        email_addresses = UserAccount.objects.filter(member__id__in=assignees).values_list('email', flat=True)
        email_subject = f'New Task Assigned: {task.name}'
        email_message = f'''
            Hello,
            
            You have been assigned a new task:
            
            Task: {task.name}
            Description: {task.description}
            Deadline: {task.deadline}
            
            Please complete the task accordingly.
            
            Best regards,
            TeamTrek
        '''
        for email in email_addresses:
            send_mail(email_subject, email_message, 'your-email@example.com', [email], fail_silently=False)
        
        project = task.project
        tasks = project.tasks.exclude(id=task.id)

        # Update project start time if it is not set or the new task's start time is earlier
        if not project.startDate or task.start_date < project.startDate or not tasks.exists():
            project.startDate = task.start_date
        else:
            earliest_start_time = tasks.aggregate(earliest_start=Min('start_date'))['earliest_start']
            if task.start_date < earliest_start_time:
                project.startDate = task.start_date

        project.save()


class TaskListView(ListAPIView):
    permission_classes = (permissions.IsAuthenticated, )
    serializer_class = TaskLoadSerializer

    def get_queryset(self):
        return Task.objects.filter(assignees__member__user = self.request.user)