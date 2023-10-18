from rest_framework import serializers
from .models import *
from teams.serializers import *
from accounts.serializers import *


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class CommentsSerializer(serializers.ModelSerializer):
    user = UserLoadSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class AssigneeLoadSerializer(serializers.ModelSerializer):
    member = MemberLoadSerializer()

    class Meta:
        model = Assignee
        fields = ('id', 'task', 'member')


class AssigneeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignee
        fields = '__all__'


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'


class TSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('name', )


class DSerializer(serializers.ModelSerializer):
    dependee = TSerializer()

    class Meta:
        model = Dependee
        fields = '__all__'


class DependeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dependee
        fields = '__all__'


class TaskSerializer(serializers.ModelSerializer):
    assignees = AssigneeSerializer(many=True, read_only=True)
    files = FileSerializer(many=True, read_only=True)
    dependees = DSerializer(many=True, read_only=True)
    comments = CommentsSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'is_recurring', 'dependees', 'is_dependent', 'cycle', 'is_subtask', 'parent', 'deadline', 'start_date', 'end_date', 'project', 'assignees', 'comments', 'files']


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'


class ProjSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'deadline']


class TaskLoadSerializer(serializers.ModelSerializer):
    project = ProjSerializer()
    files = FileSerializer(many=True, read_only=True)
    comments = CommentsSerializer(many=True, read_only=True)
    dependees = DSerializer(many=True, read_only=True)
    assignees = AssigneeLoadSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ('id', 'name', 'project', 'files', 'description', 'assignees', 'dependees', 'is_recurring', 'cycle', 'is_subtask', 'is_dependent', 'start_date', 'deadline', 'extended_deadline', 'end_date', 'parent', 'comments')


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        exclude = ['creator']


class ProjectLoadSerializer(serializers.ModelSerializer):
    tasks = TaskLoadSerializer(many=True)
    team = TeamLoadSerializer()
    
    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'startDate', 'end_date', 'date_created', 'team', 'deadline', 'extendedDeadline', 'sharedFile',  'creator', 'tasks')