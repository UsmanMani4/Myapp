from rest_framework import viewsets
from .models import Note, Task, Prayer
from .serializers import NoteSerializer, TaskSerializer, PrayerSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('is_completed', '-created_at')
    serializer_class = TaskSerializer

class PrayerViewSet(viewsets.ModelViewSet):
    queryset = Prayer.objects.all().order_by('-date')
    serializer_class = PrayerSerializer