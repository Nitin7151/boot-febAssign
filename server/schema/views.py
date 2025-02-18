# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Organization, Employee, Assignment, AssignmentEvaluation
from .serializers import (
    OrganizationSerializer, EmployeeSerializer, AssignmentSerializer,
    AssignmentSubmissionSerializer, AssignmentEvaluationSerializer
)

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    
    @action(detail=False, methods=['get'])
    def admins(self, request):
        admins = Employee.objects.filter(role='ADMIN')
        serializer = self.get_serializer(admins, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def interns(self, request):
        interns = Employee.objects.filter(role='INTERN')
        serializer = self.get_serializer(interns, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_organization(self, request):
        org_id = request.query_params.get('organization_id')
        if not org_id:
            return Response(
                {"error": "organization_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        employees = Employee.objects.filter(organization_id=org_id)
        serializer = self.get_serializer(employees, many=True)
        return Response(serializer.data)

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    
    @action(detail=True, methods=['patch'])
    def mark_as_in_progress(self, request, pk=None):
        assignment = self.get_object()
        if assignment.status != 'PENDING':
            return Response(
                {"error": "Only pending assignments can be marked as in progress"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assignment.status = 'IN_PROGRESS'
        assignment.save()
        serializer = self.get_serializer(assignment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        assignment = self.get_object()
        serializer = AssignmentSubmissionSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            assignment.submit(serializer.validated_data['submission_text'])
            return Response(
                AssignmentSerializer(assignment).data,
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=False, methods=['get'])
    def by_employee(self, request):
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response(
                {"error": "employee_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            employee = Employee.objects.get(id=employee_id)
            if employee.is_admin:
                # For admins, show both created and assigned assignments
                assignments = Assignment.objects.filter(
                    Q(created_by=employee) | Q(assigned_to=employee)
                ).distinct()
            else:
                # For interns, show only assigned assignments
                assignments = employee.assigned_assignments.all()
            
            serializer = self.get_serializer(assignments, many=True)
            return Response(serializer.data)
        except Employee.DoesNotExist:
            return Response(
                {"error": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def by_organization(self, request):
        org_id = request.query_params.get('organization_id')
        if not org_id:
            return Response(
                {"error": "organization_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        assignments = Assignment.objects.filter(organization_id=org_id)
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        assignments = Assignment.objects.filter(status='PENDING')
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def in_progress(self, request):
        assignments = Assignment.objects.filter(status='IN_PROGRESS')
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def submitted(self, request):
        assignments = Assignment.objects.filter(status='SUBMITTED')
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def evaluated(self, request):
        assignments = Assignment.objects.filter(status='EVALUATED')
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def deadline_approaching(self, request):
        now = timezone.now()
        # Get assignments ending within the next 3 days but not yet ended
        three_days_later = now + timezone.timedelta(days=3)
        assignments = Assignment.objects.filter(
            end_date__gte=now,
            end_date__lte=three_days_later,
            status__in=['PENDING', 'IN_PROGRESS']
        )
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def overdue(self, request):
        now = timezone.now()
        assignments = Assignment.objects.filter(
            end_date__lt=now,
            status__in=['PENDING', 'IN_PROGRESS']
        )
        serializer = self.get_serializer(assignments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def my_assignments(self, request):
        """Get assignments for the current employee"""
        employee_id = request.query_params.get('employee_id')
        if not employee_id:
            return Response({"error": "employee_id is required"}, status=400)
            
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
            
        assignments = self.queryset.filter(assigned_to=employee)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update assignment status for an employee"""
        assignment = self.get_object()
        employee_id = request.data.get('employee_id')
        new_status = request.data.get('status')
        
        if not employee_id or not new_status:
            return Response({"error": "employee_id and status are required"}, status=400)
            
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response({"error": "Employee not found"}, status=404)
            
        if employee not in assignment.assigned_to.all():
            return Response({"error": "Employee is not assigned to this assignment"}, status=403)
            
        if new_status not in ['IN_PROGRESS', 'SUBMITTED']:
            return Response({"error": "Invalid status. Must be IN_PROGRESS or SUBMITTED"}, status=400)
            
        # Check deadline
        if new_status == 'SUBMITTED' and assignment.end_date and timezone.now() > assignment.end_date:
            return Response({"error": "Assignment deadline has passed"}, status=400)
            
        assignment.status = new_status
        if new_status == 'SUBMITTED':
            assignment.submission_date = timezone.now()
            assignment.submission_text = request.data.get('submission_text', '')
        assignment.save()
        
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)

class AssignmentEvaluationViewSet(viewsets.ModelViewSet):
    queryset = AssignmentEvaluation.objects.all()
    serializer_class = AssignmentEvaluationSerializer
    
    @action(detail=False, methods=['get'])
    def by_assignment(self, request):
        assignment_id = request.query_params.get('assignment_id')
        if not assignment_id:
            return Response(
                {"error": "assignment_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            evaluation = AssignmentEvaluation.objects.get(assignment_id=assignment_id)
            serializer = self.get_serializer(evaluation)
            return Response(serializer.data)
        except AssignmentEvaluation.DoesNotExist:
            return Response(
                {"error": "Evaluation for this assignment not found"},
                status=status.HTTP_404_NOT_FOUND
            )