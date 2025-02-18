import { useState, useEffect } from 'react'
import { PlusIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Modal from '../components/Modal'
import { Button } from '../components/Button'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [employees, setEmployees] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization: 1,
    created_by_id: 2, // Assuming admin user
    employee_ids: [],
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    fetchAssignments()
    fetchEmployees()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:8000/assignments/')
      const data = await response.json()
      setAssignments(data)
    } catch (error) {
      console.error('Error fetching assignments:', error)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8000/employees/')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/assignments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setIsCreateModalOpen(false)
        fetchAssignments()
        setFormData({
          title: '',
          description: '',
          organization: 1,
          created_by_id: 2,
          employee_ids: [],
          start_date: '',
          end_date: '',
        })
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
    }
  }

  const handleUpdateStatus = async (assignmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/assignments/${assignmentId}/update_status/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: 1, // This should be the current user's ID
          status: newStatus,
        }),
      })
      if (response.ok) {
        fetchAssignments()
      }
    } catch (error) {
      console.error('Error updating assignment status:', error)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Assignments</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all assignments including their status, assigned employees, and deadlines.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create Assignment
          </Button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Assigned To
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Deadline
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {assignment.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          assignment.status === 'SUBMITTED' 
                            ? 'bg-green-100 text-green-800'
                            : assignment.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {assignment.assigned_to.map(e => e.full_name).join(', ')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(assignment.end_date).toLocaleDateString()}
                        {assignment.is_overdue && (
                          <span className="ml-2 text-red-600 text-xs">Overdue</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center gap-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateStatus(assignment.id, 'IN_PROGRESS')}
                            disabled={assignment.status !== 'PENDING'}
                          >
                            Start
                          </Button>
                          <Button
                            variant={assignment.status === 'SUBMITTED' ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => handleUpdateStatus(assignment.id, 
                              assignment.status === 'SUBMITTED' ? 'IN_PROGRESS' : 'SUBMITTED'
                            )}
                            disabled={assignment.status === 'PENDING'}
                          >
                            {assignment.status === 'SUBMITTED' ? 'Unsubmit' : 'Submit'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Assignment"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="employee_ids" className="block text-sm font-medium text-gray-700">
              Assign To
            </label>
            <select
              id="employee_ids"
              multiple
              value={formData.employee_ids}
              onChange={(e) => setFormData({ 
                ...formData, 
                employee_ids: Array.from(e.target.selectedOptions, option => Number(option.value))
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="datetime-local"
                id="start_date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="datetime-local"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <Button
              type="submit"
              className="w-full sm:col-start-2"
            >
              Create
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="mt-3 w-full sm:col-start-1 sm:mt-0"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
