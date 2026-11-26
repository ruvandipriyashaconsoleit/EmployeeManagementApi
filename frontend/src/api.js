
const API_URL = 'http://localhost:8080/api';

function getAuthHeaders() {
  const token = localStorage.getItem('accessToken');

  return {
    'Content-Type': 'application/json',
    ...(token && {
      Authorization: `Bearer ${token}`
    })
  };
}

async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return text ? JSON.parse(text) : null;
}

// Authentication

export async function registerUser(user) {
  const response = await fetch(`${API_URL}/Auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });

  return handleResponse(response);
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/Auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  });

  return handleResponse(response);
}

// Employee Management

export async function getEmployees() {
  const response = await fetch(`${API_URL}/Employees`, {
    headers: getAuthHeaders()
  });

  return handleResponse(response);
}

export async function createEmployee(employee) {
  const response = await fetch(`${API_URL}/Employees`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(employee)
  });

  return handleResponse(response);
}

export async function updateEmployee(id, employee) {
  const response = await fetch(`${API_URL}/Employees/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(employee)
  });

  return handleResponse(response);
}

export async function deleteEmployee(id) {
  const response = await fetch(`${API_URL}/Employees/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  return handleResponse(response);
}
