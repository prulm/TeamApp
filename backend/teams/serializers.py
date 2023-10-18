from rest_framework import serializers
from .models import *
from accounts.serializers import *

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        exclude = ['team']

class MemberCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'

class MemberLoadSerializer(serializers.ModelSerializer):
    user = UserLoadSerializer(read_only=True)

    class Meta:
        model = Member
        fields = ['id', 'user', 'role', 'has_joined']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        exclude = ['creator']


class TeamLoadSerializer(serializers.ModelSerializer):
    members = MemberLoadSerializer(many=True)

    class Meta:
        model = Team
        fields = ('id', 'name', 'description', 'date_created', 'creator', 'members')