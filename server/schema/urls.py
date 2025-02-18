# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, EmployeeViewSet, AssignmentViewSet, AssignmentEvaluationViewSet

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'assignments', AssignmentViewSet)
router.register(r'evaluations', AssignmentEvaluationViewSet)

urlpatterns = router.urls