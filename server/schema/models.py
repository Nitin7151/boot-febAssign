# models.py
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError

class Organization(models.Model):
    name = models.CharField(max_length=200, unique=True)
    description = models.TextField(blank=True)
    address = models.TextField()
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Employee(models.Model):
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('INTERN', 'Intern')
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='employees')
    joining_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.get_role_display()})'

    @property
    def is_admin(self):
        return self.role == 'ADMIN'

class Assignment(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('IN_PROGRESS', 'In Progress'),
        ('SUBMITTED', 'Submitted'),
        ('EVALUATED', 'Evaluated'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='assignments')
    created_by = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='created_assignments')
    assigned_to = models.ManyToManyField(Employee, related_name='assigned_assignments')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    submission_text = models.TextField(null=True, blank=True)
    submission_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def is_overdue(self):
        """Check if the assignment is overdue"""
        if self.end_date and self.status not in ['SUBMITTED', 'EVALUATED']:
            return timezone.now() > self.end_date
        return False

    @property
    def time_remaining(self):
        """Get the time remaining until deadline"""
        if self.end_date and self.status not in ['SUBMITTED', 'EVALUATED']:
            now = timezone.now()
            if now < self.end_date:
                return self.end_date - now
        return None

    def __str__(self):
        return self.title

    def clean(self):
        if self.created_by and not self.created_by.is_admin:
            raise ValidationError("Only admin employees can create assignments")
        
        if self.end_date and self.start_date and self.end_date < self.start_date:
            raise ValidationError("End date must be after start date")

    def submit(self, submission_text):
        if self.status != 'IN_PROGRESS':
            raise ValidationError("Can only submit assignments that are in progress")
        self.submission_text = submission_text
        self.submission_date = timezone.now()
        self.status = 'SUBMITTED'
        self.save()

class AssignmentEvaluation(models.Model):
    assignment = models.OneToOneField(Assignment, on_delete=models.CASCADE, related_name='evaluation')
    score = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    feedback = models.TextField()
    evaluation_date = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Evaluation for {self.assignment}'

    def clean(self):
        if self.score < 0 or self.score > 100:
            raise ValidationError("Score must be between 0 and 100")
        
        if self.assignment.status != 'SUBMITTED':
            raise ValidationError("Can only evaluate submitted assignments")
        
        if not self.assignment.created_by.is_admin:
            raise ValidationError("Only the admin who created the assignment can evaluate it")
        
    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
        self.assignment.status = 'EVALUATED'
        self.assignment.save()