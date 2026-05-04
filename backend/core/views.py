from django.utils import timezone
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Note, Task, Prayer, FastingLog, Finance, HabitLog, CoCAccount, Builder
from .serializers import NoteSerializer, TaskSerializer, PrayerSerializer, FastingLogSerializer, FinanceSerializer, HabitLogSerializer, CoCAccountSerializer, BuilderSerializer

class NoteViewSet(viewsets.ModelViewSet):
    queryset = Note.objects.all().order_by('-created_at')
    serializer_class = NoteSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('is_completed', '-created_at')
    serializer_class = TaskSerializer

class PrayerViewSet(viewsets.ModelViewSet):
    queryset = Prayer.objects.all().order_by('-date')
    serializer_class = PrayerSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(date=date_param)
        return queryset

class FastingLogViewSet(viewsets.ModelViewSet):
    queryset = FastingLog.objects.all().order_by('-date')
    serializer_class = FastingLogSerializer
    http_method_names = ['get', 'post', 'patch', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(date=date_param)
        return queryset

class FinanceViewSet(viewsets.ModelViewSet):
    queryset = Finance.objects.all().order_by('-date')
    serializer_class = FinanceSerializer
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        date_param = self.request.query_params.get('date')
        type_param = self.request.query_params.get('type')
        if date_param:
            queryset = queryset.filter(date=date_param)
        if type_param:
            queryset = queryset.filter(type=type_param)
        return queryset

class HabitLogViewSet(viewsets.ModelViewSet):
    queryset = HabitLog.objects.all().order_by('-date')
    serializer_class = HabitLogSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        date_param = self.request.query_params.get('date')
        if date_param:
            queryset = queryset.filter(date=date_param)
        return queryset

class CoCAccountViewSet(viewsets.ModelViewSet):
    queryset = CoCAccount.objects.all()
    serializer_class = CoCAccountSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

class BuilderViewSet(viewsets.ModelViewSet):
    queryset = Builder.objects.all()
    serializer_class = BuilderSerializer
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = super().get_queryset()
        account_id = self.request.query_params.get('account_id')
        if account_id:
            queryset = queryset.filter(account_id=account_id)
        return queryset

class FreeBuildersView(APIView):
    def get(self, request):
        now = timezone.now()
        builders = Builder.objects.filter(Q(finish_time__lte=now) | Q(is_free=True)).select_related('account')
        
        grouped_builders = {}
        for builder in builders:
            acc_name = builder.account.name
            if acc_name not in grouped_builders:
                grouped_builders[acc_name] = []
            grouped_builders[acc_name].append({
                'id': builder.id,
                'builder_number': builder.builder_number,
                'is_bob': builder.is_bob,
                'current_task': builder.current_task,
                'finish_time': builder.finish_time,
                'is_free': builder.is_free,
            })
            
        return Response(grouped_builders)