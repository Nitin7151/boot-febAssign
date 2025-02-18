# serializers.py
from rest_framework import serializers
from .models import Organization, Employee, Assignment, AssignmentEvaluation
from datetime import datetime, timedelta

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'description', 'address', 'contact_email', 'contact_phone', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class EmployeeSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'role', 'organization', 
                  'organization_name', 'joining_date', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class EmployeeListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Employee
        fields = ['id', 'full_name', 'role']
    
    def get_full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'

class AssignmentSerializer(serializers.ModelSerializer):
    created_by = EmployeeListSerializer(read_only=True)
    assigned_to = EmployeeListSerializer(many=True, read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    employee_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=True
    )
    created_by_id = serializers.IntegerField(write_only=True, required=True)
    is_overdue = serializers.BooleanField(read_only=True)
    time_remaining = serializers.DurationField(read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'description', 'organization', 'organization_name',
                  'created_by', 'created_by_id', 'assigned_to', 'employee_ids', 'start_date',
                  'end_date', 'status', 'submission_text', 'submission_date', 'created_at', 
                  'updated_at', 'is_overdue', 'time_remaining']
        read_only_fields = ['created_at', 'updated_at', 'submission_date']
    
    def validate(self, data):
        if self.instance is None:  # Creating new assignment
            try:
                creator = Employee.objects.get(id=data.get('created_by_id'))
                if not creator.is_admin:
                    raise serializers.ValidationError("Only admin employees can create assignments")
            except Employee.DoesNotExist:
                raise serializers.ValidationError("Creator employee not found")
        
        if data.get('end_date') and data.get('start_date') and data.get('end_date') < data.get('start_date'):
            raise serializers.ValidationError("End date must be after start date")
        
        # Validate status transitions
        if self.instance and 'status' in data:
            new_status = data['status']
            current_status = self.instance.status
            
            # Only assigned employees can submit
            if new_status == 'SUBMITTED' and current_status != 'SUBMITTED':
                if not self.instance.assigned_to.filter(id__in=[e.id for e in self.instance.assigned_to.all()]).exists():
                    raise serializers.ValidationError("Only assigned employees can submit assignments")
        
        return data
    
    def create(self, validated_data):
        employee_ids = validated_data.pop('employee_ids')
        created_by_id = validated_data.pop('created_by_id')
        
        # Get the creator employee
        try:
            created_by = Employee.objects.get(id=created_by_id)
        except Employee.DoesNotExist as e:
            raise serializers.ValidationError(str(e))
        
        # Create the assignment
        assignment = Assignment.objects.create(
            created_by=created_by,
            **validated_data
        )
        
        # Add assigned employees
        for employee_id in employee_ids:
            try:
                employee = Employee.objects.get(id=employee_id)
                assignment.assigned_to.add(employee)
            except Employee.DoesNotExist:
                # Skip invalid employee ids
                pass
        
        return assignment
    
    def update(self, instance, validated_data):
        if 'employee_ids' in validated_data:
            employee_ids = validated_data.pop('employee_ids')
            instance.assigned_to.clear()
            
            for employee_id in employee_ids:
                try:
                    employee = Employee.objects.get(id=employee_id)
                    instance.assigned_to.add(employee)
                except Employee.DoesNotExist:
                    # Skip invalid employee ids
                    pass
        
        # Remove write-only fields
        if 'created_by_id' in validated_data:
            validated_data.pop('created_by_id')
        
        return super().update(instance, validated_data)

class AssignmentSubmissionSerializer(serializers.Serializer):
    submission_text = serializers.CharField(required=True)

class AssignmentEvaluationSerializer(serializers.ModelSerializer):
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    
    class Meta:
        model = AssignmentEvaluation
        fields = ['id', 'assignment', 'assignment_title', 'score', 'feedback',
                  'evaluation_date', 'created_at', 'updated_at']
        read_only_fields = ['evaluation_date', 'created_at', 'updated_at']
    
    def validate(self, data):
        assignment = data.get('assignment')
        
        if assignment.status != 'SUBMITTED':
            raise serializers.ValidationError("Can only evaluate submitted assignments")
        
        if not assignment.created_by.is_admin:
            raise serializers.ValidationError("Only the admin who created the assignment can evaluate it")
        
        if data.get('score', 0) < 0 or data.get('score', 0) > 100:
            raise serializers.ValidationError("Score must be between 0 and 100")
        
        return data