import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEmployee, getEmployeeAssignments, getEmployeeEvaluations } from '../services/api';

function getStatusColor(status) {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'SUBMITTED':
      return 'bg-purple-100 text-purple-800';
    case 'EVALUATED':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function EmployeeProfile() {
  const { email } = useParams();
  const [employee, setEmployee] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, assignmentsData, evaluationsData] = await Promise.all([
          getEmployee(email),
          getEmployeeAssignments(email),
          getEmployeeEvaluations(email),
        ]);
        setEmployee(employeeData);
        setAssignments(assignmentsData);
        setEvaluations(evaluationsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [email]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading employee profile</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No employee found</h3>
        <p className="mt-1 text-sm text-gray-500">Could not find an employee with the specified email.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Employee Info */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-2xl text-indigo-800 font-medium">
                {employee.first_name[0]}{employee.last_name[0]}
              </span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {employee.first_name} {employee.last_name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {employee.email}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Role</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.role_display}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Organization</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.organization_name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{employee.phone}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Joining Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(employee.joining_date).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Assignments */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Assignments</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {assignments.map((assignment) => (
              <li key={assignment.title} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{assignment.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{assignment.description}</p>
                  </div>
                  <div className="ml-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      Due: {new Date(assignment.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Evaluations */}
      {evaluations.length > 0 && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Evaluations</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul role="list" className="divide-y divide-gray-200">
              {evaluations.map((evaluation) => (
                <li key={evaluation.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {evaluation.assignment_title}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{evaluation.feedback}</p>
                    </div>
                    <div className="ml-4">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Score: {evaluation.score}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Evaluated on: {new Date(evaluation.evaluation_date).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
