from rest_framework.routers import DefaultRouter
from .views import NoteViewSet, TaskViewSet, PrayerViewSet

router = DefaultRouter()
router.register(r'notes', NoteViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'prayers', PrayerViewSet)

urlpatterns = router.urls