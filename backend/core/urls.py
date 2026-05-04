from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    NoteViewSet, TaskViewSet, PrayerViewSet, FastingLogViewSet, 
    FinanceViewSet, HabitLogViewSet, CoCAccountViewSet, BuilderViewSet,
    FreeBuildersView
)

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'prayers', PrayerViewSet)
router.register(r'fasting', FastingLogViewSet)
router.register(r'finance', FinanceViewSet)
router.register(r'habits', HabitLogViewSet)
router.register(r'coc/accounts', CoCAccountViewSet, basename='coc-accounts')
router.register(r'coc/builders', BuilderViewSet, basename='coc-builders')

urlpatterns = [
    path('coc/free-builders/', FreeBuildersView.as_view(), name='free-builders'),
] + router.urls