from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import datetime, timedelta
from .models import Organization, Employee, Assignment, AssignmentEvaluation

class OrganizationTests(APITestCase):
    def setUp(self):
        # Create test organization
        self.org_data = {
            'name': 'Test Corp',
            'description': 'Test Description',
            'address': 'Test Address',
            'contact_email': 'test@test.com',
            'contact_phone': '+1-555-1234'
        }
        self.org = Organization.objects.create(**self.org_data)

    def test_create_organization(self):
        url = reverse('organization-list')
        data = {
            'name': 'New Corp',
            'description': 'New Description',
            'address': 'New Address',
            'contact_email': 'new@test.com',
            'contact_phone': '+1-555-5678'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Organization.objects.count(), 2)

    def test_get_organizations(self):
        url = reverse('organization-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class EmployeeTests(APITestCase):
    def setUp(self):
        # Create test organization
        self.org = Organization.objects.create(
            name='Test Corp',
            description='Test Description',
            address='Test Address',
            contact_email='test@test.com',
            contact_phone='+1-555-1234'
        )

        # Create test employee
        self.employee_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@test.com',
            'phone': '+1-555-1001',
            'employee_type': 'FULL_TIME',
            'organization': self.org,
            'joining_date': '2024-01-15'
        }
        self.employee = Employee.objects.create(**self.employee_data)

    def test_create_employee(self):
        url = reverse('employee-list')
        data = {
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@test.com',
            'phone': '+1-555-1002',
            'employee_type': 'INTERN',
            'organization': self.org.id,
            'joining_date': '2024-02-01'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Employee.objects.count(), 2)

    def test_filter_employees_by_organization(self):
        url = reverse('employee-list')
        response = self.client.get(f'{url}?organization={self.org.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class AssignmentTests(APITestCase):
    def setUp(self):
        # Create test organization
        self.org = Organization.objects.create(
            name='Test Corp',
            description='Test Description',
            address='Test Address',
            contact_email='test@test.com',
            contact_phone='+1-555-1234'
        )

        # Create test employees
        self.employee1 = Employee.objects.create(
            first_name='John',
            last_name='Doe',
            email='john@test.com',
            phone='+1-555-1001',
            employee_type='FULL_TIME',
            organization=self.org,
            joining_date='2024-01-15'
        )

        self.employee2 = Employee.objects.create(
            first_name='Jane',
            last_name='Smith',
            email='jane@test.com',
            phone='+1-555-1002',
            employee_type='INTERN',
            organization=self.org,
            joining_date='2024-02-01'
        )

        # Create test assignment
        self.assignment = Assignment.objects.create(
            title='Test Project',
            description='Test Description',
            organization=self.org,
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=30),
            status='PENDING'
        )
        self.assignment.assigned_to.add(self.employee1, self.employee2)

    def test_create_assignment(self):
        url = reverse('assignment-list')
        data = {
            'title': 'New Project',
            'description': 'New Description',
            'organization': self.org.id,
            'assigned_to': [self.employee1.id],
            'start_date': timezone.now().isoformat(),
            'end_date': (timezone.now() + timedelta(days=30)).isoformat(),
            'status': 'PENDING'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Assignment.objects.count(), 2)

    def test_filter_assignments(self):
        url = reverse('assignment-list')

        # Test organization filter
        response = self.client.get(f'{url}?organization={self.org.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # Test status filter
        response = self.client.get(f'{url}?status=PENDING')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        # Test employee filter
        response = self.client.get(f'{url}?employee={self.employee1.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_assignment_summary(self):
        url = reverse('assignment-summary')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_assignments'], 1)
        self.assertEqual(response.data['by_status']['PENDING'], 1)

    def test_edge_cases(self):
        url = reverse('assignment-list')

        # Test date range
        # Future date - should return no assignments
        future_date = (timezone.now() + timedelta(days=365)).strftime('%Y-%m-%d %H:%M:%S')
        response = self.client.get(f'{url}?start_after={future_date}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return no assignments

        # Past date - should return all assignments
        past_date = (timezone.now() - timedelta(days=365)).strftime('%Y-%m-%d %H:%M:%S')
        response = self.client.get(f'{url}?start_after={past_date}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Should return all assignments

        # Test non-existent organization
        response = self.client.get(f'{url}?organization=999')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return empty list

        # Test non-existent employee
        response = self.client.get(f'{url}?employee=999')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return empty list

        # Test invalid status
        response = self.client.get(f'{url}?status=INVALID_STATUS')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # Should return empty list

class AssignmentEvaluationTests(APITestCase):
    def setUp(self):
        # Create test organization
        self.org = Organization.objects.create(
            name='Test Corp',
            description='Test Description',
            address='Test Address',
            contact_email='test@test.com',
            contact_phone='+1-555-1234'
        )

        # Create test employee
        self.employee = Employee.objects.create(
            first_name='John',
            last_name='Doe',
            email='john@test.com',
            phone='+1-555-1001',
            employee_type='FULL_TIME',
            organization=self.org,
            joining_date='2024-01-15'
        )

        # Create test assignment
        self.assignment = Assignment.objects.create(
            title='Test Project',
            description='Test Description',
            organization=self.org,
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(days=30),
            status='PENDING'
        )
        self.assignment.assigned_to.add(self.employee)

    def test_create_evaluation(self):
        url = reverse('assignmentevaluation-list')
        data = {
            'assignment': self.assignment.id,
            'evaluator': self.employee.id,
            'score': 85,
            'feedback': 'Good work',
            'evaluation_date': timezone.now().isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(AssignmentEvaluation.objects.count(), 1)

    def test_invalid_score(self):
        url = reverse('assignmentevaluation-list')
        
        # Test score below 0
        data = {
            'assignment': self.assignment.id,
            'evaluator': self.employee.id,
            'score': -1,
            'feedback': 'Invalid score',
            'evaluation_date': timezone.now().isoformat()
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test score above 100
        data['score'] = 101
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
