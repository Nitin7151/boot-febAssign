import { useState, useEffect } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import Modal from '../components/Modal'
import { Button } from '../components/Button'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'INTERN',
    organization: '',
    joining_date: new Date().toISOString().split('T')[0],
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchEmployees()
    fetchOrganizations()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8000/employees/')
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const fetchOrganizations = async () => {
    try {
      const response = await fetch('http://localhost:8000/organizations/')
      const data = await response.json()
      setOrganizations(data)
      if (data.length > 0 && !formData.organization) {
        setFormData(prev => ({ ...prev, organization: data[0].id }))
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.first_name) errors.first_name = 'First name is required'
    if (!formData.last_name) errors.last_name = 'Last name is required'
    if (!formData.email) errors.email = 'Email is required'
    if (!formData.phone) errors.phone = 'Phone is required'
    if (!formData.organization) errors.organization = 'Organization is required'
    if (!formData.joining_date) errors.joining_date = 'Joining date is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateEmployee = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const response = await fetch('http://localhost:8000/employees/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setIsCreateModalOpen(false)
        fetchEmployees()
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          role: 'INTERN',
          organization: organizations[0]?.id || '',
          joining_date: new Date().toISOString().split('T')[0],
        })
        setFormErrors({})
      } else {
        const errorData = await response.json()
        setFormErrors(errorData)
      }
    } catch (error) {
      console.error('Error creating employee:', error)
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Employees</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all employees in your organization including their name, role, and contact details.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            Add Employee
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
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Phone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Organization
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Joining Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {employee.first_name} {employee.last_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          employee.role === 'ADMIN' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.organization_name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(employee.joining_date).toLocaleDateString()}
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
        onClose={() => {
          setIsCreateModalOpen(false)
          setFormErrors({})
        }}
        title="Create Employee"
      >
        <form onSubmit={handleCreateEmployee} className="space-y-4">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors.first_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.first_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.first_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors.last_name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.last_name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.last_name}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
              Organization
            </label>
            <select
              id="organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: Number(e.target.value) })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors.organization ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            >
              <option value="">Select an organization</option>
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
            {formErrors.organization && (
              <p className="mt-1 text-sm text-red-600">{formErrors.organization}</p>
            )}
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="INTERN">Intern</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label htmlFor="joining_date" className="block text-sm font-medium text-gray-700">
              Joining Date
            </label>
            <input
              type="date"
              id="joining_date"
              value={formData.joining_date}
              onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                formErrors.joining_date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {formErrors.joining_date && (
              <p className="mt-1 text-sm text-red-600">{formErrors.joining_date}</p>
            )}
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
              onClick={() => {
                setIsCreateModalOpen(false)
                setFormErrors({})
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
