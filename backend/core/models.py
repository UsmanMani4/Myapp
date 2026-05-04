from django.db import models

class Note(models.Model):
    title = models.CharField(max_length=200, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    is_completed = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title or '(Untitled Note)'

    class Meta:
        ordering = ['-created_at']


class Task(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    priority = models.CharField(max_length=20, default='Medium')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['is_completed', '-created_at']


class Prayer(models.Model):
    date = models.DateField(unique=True)

    fajr = models.BooleanField(default=False)
    dhuhr = models.BooleanField(default=False)
    asr = models.BooleanField(default=False)
    maghrib = models.BooleanField(default=False)
    isha = models.BooleanField(default=False)

    is_submitted = models.BooleanField(default=False)

    def __str__(self):
        return str(self.date)

    class Meta:
        ordering = ['-date']


class FastingLog(models.Model):
    date = models.DateField(unique=True)
    did_fast = models.BooleanField(default=False)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.date} - Fasted: {self.did_fast}"

    class Meta:
        ordering = ['-date']


class Finance(models.Model):
    TYPE_CHOICES = (
        ('income', 'Income'),
        ('expense', 'Expense'),
    )
    date = models.DateField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.date} - {self.type} - {self.amount}"

    class Meta:
        ordering = ['-date']


class HabitLog(models.Model):
    date = models.DateField()
    habit_name = models.CharField(max_length=100)
    is_done = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.date} - {self.habit_name} - {self.is_done}"

    class Meta:
        ordering = ['-date']

class CoCAccount(models.Model):
    name = models.CharField(max_length=100)
    town_hall_level = models.IntegerField(default=1)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Builder(models.Model):
    account = models.ForeignKey(CoCAccount, on_delete=models.CASCADE)
    builder_number = models.IntegerField()
    is_bob = models.BooleanField(default=False)
    current_task = models.CharField(max_length=200, blank=True)
    finish_time = models.DateTimeField(null=True, blank=True)
    is_free = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.account.name} - Builder {self.builder_number}"