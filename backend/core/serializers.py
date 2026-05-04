from rest_framework import serializers
from .models import Note, Task, Prayer, FastingLog, Finance, HabitLog, CoCAccount, Builder

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

class FastingLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FastingLog
        fields = '__all__'

class FinanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finance
        fields = '__all__'

class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = '__all__'

class CoCAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoCAccount
        fields = '__all__'

class BuilderSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)
    class Meta:
        model = Builder
        fields = '__all__'