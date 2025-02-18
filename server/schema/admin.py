# server/schema/admin.py
from django.contrib import admin
from .models import Organization, Employee, Assignment, AssignmentEvaluation

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'contact_email', 'contact_phone', 'created_at')
    search_fields = ('name', 'contact_email')

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'role', 'organization', 'joining_date', 'is_active')
    list_filter = ('role', 'organization', 'is_active')
    search_fields = ('first_name', 'last_name', 'email')

    def full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'
    full_name.short_description = 'Full Name'

@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'organization', 'created_by', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'organization', 'created_by')
    filter_horizontal = ('assigned_to',)
    search_fields = ('title', 'description')
    raw_id_fields = ('created_by',)

@admin.register(AssignmentEvaluation)
class AssignmentEvaluationAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'score', 'evaluation_date')
    list_filter = ('assignment__status',)
    search_fields = ('assignment__title', 'feedback')
    raw_id_fields = ('assignment',)