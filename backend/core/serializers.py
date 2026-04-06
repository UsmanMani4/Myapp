from rest_framework import serializers
from .models import Note, Task, Prayer

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

class PrayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prayer
        fields = '__all__'