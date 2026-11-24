
const API_URL = 'http://localhost:8080/api/employees';

export async function getEmployees() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch employees');
  }

  return await response.json();
}

export async function createEmployee(employee) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(employee)
  });

  if (!response.ok) {
    throw new Error('Failed to create employee');
  }

  return await response.json();
}

export async function updateEmployee(id, employee) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(employee)
  });

  if (!response.ok) {
    throw new Error('Failed to update employee');
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
}

export async function deleteEmployee(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete employee');
  }
}
