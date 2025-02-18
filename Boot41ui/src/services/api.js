import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const getEmployees = async () => {
  const response = await api.get('/employees/');
  return response.data;
};

export const getEmployee = async (email) => {
  const response = await api.get(`/employees/${email}/`);
  return response.data;
};

export const getAssignments = async () => {
  const response = await api.get('/assignments/');
  return response.data;
};

export const getEmployeeAssignments = async (email) => {
  const response = await api.get(`/assignments/?assigned_to=${email}`);
  return response.data;
};

export const getEmployeeEvaluations = async (email) => {
  const response = await api.get(`/evaluations/?employee=${email}`);
  return response.data;
};
