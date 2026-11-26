
import { useEffect, useMemo, useState } from 'react'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  loginUser,
  registerUser
} from './api'
import './App.css'

function App() {
  // Authentication
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('userInfo')) || null
    } catch {
      return null
    }
  })

  const [authMode, setAuthMode] = useState('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Employee data
  const [employees, setEmployees] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [search, setSearch] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('All')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAdmin = user?.roles?.includes('Admin') || false

  // Load employees after login
  async function loadEmployees() {
    setLoading(true)
    setError('')

    try {
      const data = await getEmployees()
      setEmployees(data)
    } catch (err) {
      setError(err.message || 'Unable to load employees. Please check your access.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && localStorage.getItem('accessToken')) {
      loadEmployees()
    }
  }, [])

  // Login and registration
  async function handleAuthSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!authEmail.trim() || !authPassword) {
      setError('Please enter your email and password.')
      return
    }

    setAuthLoading(true)

    try {
      if (authMode === 'register') {
        await registerUser({
          email: authEmail.trim(),
          password: authPassword
        })

        setSuccess('Registration successful! Please log in.')
        setAuthMode('login')
        setAuthPassword('')
      } else {
        const result = await loginUser({
          email: authEmail.trim(),
          password: authPassword
        })

        localStorage.setItem('accessToken', result.accessToken)

        const userInfo = {
          email: result.email,
          roles: result.roles || []
        }

        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        setUser(userInfo)
        setAuthPassword('')
        setEmployees([])
        setSuccess('Login successful!')

        await loadEmployees()
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userInfo')

    setUser(null)
    setEmployees([])
    setName('')
    setEmail('')
    setDepartment('')
    setEditingId(null)
    setSearch('')
    setFilterDepartment('All')
    setError('')
    setSuccess('')
    setAuthEmail('')
    setAuthPassword('')
    setAuthMode('login')
  }

  // Department list
  const departments = useMemo(() => {
    return [...new Set(
      employees
        .map(employee => employee.department)
        .filter(Boolean)
    )].sort()
  }, [employees])

  // Search and department filtering
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const searchValue = search.toLowerCase()

      const matchesSearch =
        employee.name.toLowerCase().includes(searchValue) ||
        employee.email.toLowerCase().includes(searchValue) ||
        employee.department.toLowerCase().includes(searchValue)

      const matchesDepartment =
        filterDepartment === 'All' ||
        employee.department === filterDepartment

      return matchesSearch && matchesDepartment
    })
  }, [employees, search, filterDepartment])

  // Add or update employee
  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const employeeData = {
      name: name.trim(),
      email: email.trim(),
      department: department.trim()
    }

    if (!employeeData.name || !employeeData.email || !employeeData.department) {
      setError('Please complete all fields.')
      return
    }

    setSaving(true)

    try {
      if (editingId !== null) {
        await updateEmployee(editingId, employeeData)
        setSuccess('Employee updated successfully!')
      } else {
        await createEmployee(employeeData)
        setSuccess('Employee added successfully!')
      }

      clearForm()
      await loadEmployees()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(employee) {
    setName(employee.name)
    setEmail(employee.email)
    setDepartment(employee.department)
    setEditingId(employee.id)
    setError('')
    setSuccess('')

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Delete employee
  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this employee?'
    )

    if (!confirmed) return

    setError('')
    setSuccess('')

    try {
      await deleteEmployee(id)
      setSuccess('Employee deleted successfully!')
      await loadEmployees()
    } catch (err) {
      setError(err.message || 'Unable to delete employee.')
    }
  }

  function clearForm() {
    setName('')
    setEmail('')
    setDepartment('')
    setEditingId(null)
  }

  return (
    <div className="app">

      <header className="header">
        <div className="header-content">
          <div className="brand">
            <div className="brand-icon">✦</div>
            <div>
              <h1>People<span>Sphere</span></h1>
              <p>EMPLOYEE MANAGEMENT SYSTEM</p>
            </div>
          </div>

          <div className="header-right">
            {user ? (
              <>
                <span className="online-dot"></span>
                <span>{user.email}</span>
                <button
                  className="refresh-btn"
                  onClick={handleLogout}
                  style={{ marginLeft: '15px' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <span className="online-dot"></span>
                <span>System Online</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container">

        {!user ? (
          <section
            className="form-section"
            style={{
              maxWidth: '450px',
              margin: '60px auto',
              padding: '35px'
            }}
          >
            <div className="section-heading">
              <div>
                <p className="eyebrow">WELCOME TO PEOPLESphere</p>
                <h2>
                  {authMode === 'login' ? 'Login' : 'Create Account'}
                </h2>
              </div>
              <span className="heading-icon">✦</span>
            </div>

            <p className="welcome-text" style={{ marginBottom: '25px' }}>
              {authMode === 'login'
                ? 'Sign in to access your employee dashboard.'
                : 'Register a new account to access the system.'}
            </p>

            {error && (
              <div className="alert error-alert">
                <span>⚠</span>
                {error}
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {success && (
              <div className="alert success-alert">
                <span>✓</span>
                {success}
                <button onClick={() => setSuccess('')}>×</button>
              </div>
            )}

            <form onSubmit={handleAuthSubmit}>
              <label htmlFor="authEmail">Email Address</label>
              <input
                id="authEmail"
                type="email"
                placeholder="name@example.com"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                required
              />

              <label htmlFor="authPassword">Password</label>
              <input
                id="authPassword"
                type="password"
                placeholder="Enter your password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                required
                minLength={authMode === 'register' ? 8 : undefined}
              />

              <button
                type="submit"
                className="primary-btn"
                disabled={authLoading}
              >
                {authLoading
                  ? 'Please wait...'
                  : authMode === 'login'
                    ? 'Login'
                    : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '22px' }}>
              {authMode === 'login'
                ? "Don't have an account? "
                : 'Already have an account? '}

              <button
                type="button"
                className="edit-btn"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login')
                  setError('')
                  setSuccess('')
                  setAuthPassword('')
                }}
              >
                {authMode === 'login' ? 'Register' : 'Login'}
              </button>
            </p>
          </section>
        ) : (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">WORKFORCE OVERVIEW</p>
                <h2>Employee Dashboard</h2>
                <p className="welcome-text">
                  Manage your team, organize information and stay productive.
                </p>
                <p style={{ marginTop: '8px', fontSize: '13px' }}>
                  Logged in as: <strong>{user.email}</strong> · Role:{' '}
                  <strong>{isAdmin ? 'Admin' : 'NormalUser'}</strong>
                </p>
              </div>

              <button
                className="refresh-btn"
                onClick={loadEmployees}
                disabled={loading}
              >
                ↻ Refresh Data
              </button>
            </section>

            <section className="stats-grid">

              <div className="stat-card purple-card">
                <div className="stat-top">
                  <span>Total Employees</span>
                  <span className="stat-icon">♙</span>
                </div>
                <h3>{employees.length}</h3>
                <p>Registered employees</p>
              </div>

              <div className="stat-card pink-card">
                <div className="stat-top">
                  <span>Departments</span>
                  <span className="stat-icon">▦</span>
                </div>
                <h3>{departments.length}</h3>
                <p>Active departments</p>
              </div>

              <div className="stat-card blue-card">
                <div className="stat-top">
                  <span>Filtered Results</span>
                  <span className="stat-icon">⌕</span>
                </div>
                <h3>{filteredEmployees.length}</h3>
                <p>Matching employees</p>
              </div>

              <div className="stat-card green-card">
                <div className="stat-top">
                  <span>Database Status</span>
                  <span className="stat-icon">✓</span>
                </div>
                <h3 className="status-text">Connected</h3>
                <p>API connection active</p>
              </div>

            </section>

            {error && (
              <div className="alert error-alert">
                <span>⚠</span>
                {error}
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {success && (
              <div className="alert success-alert">
                <span>✓</span>
                {success}
                <button onClick={() => setSuccess('')}>×</button>
              </div>
            )}

            <section className="content-grid">

              {isAdmin && (
                <div className="form-section">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">EMPLOYEE DETAILS</p>
                      <h2>
                        {editingId !== null ? 'Edit Employee' : 'Add Employee'}
                      </h2>
                    </div>
                    <span className="heading-icon">＋</span>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <label htmlFor="employeeName">Full Name</label>
                    <input
                      id="employeeName"
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      maxLength={100}
                    />

                    <label htmlFor="employeeEmail">Email Address</label>
                    <input
                      id="employeeEmail"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      maxLength={150}
                    />

                    <label htmlFor="employeeDepartment">Department</label>
                    <input
                      id="employeeDepartment"
                      type="text"
                      placeholder="e.g. IT, Finance, HR"
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
                      required
                      maxLength={100}
                    />

                    <button
                      type="submit"
                      className="primary-btn"
                      disabled={saving}
                    >
                      {saving
                        ? 'Please wait...'
                        : editingId !== null
                          ? '✓ Update Employee'
                          : '+ Add Employee'}
                    </button>

                    {editingId !== null && (
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={clearForm}
                      >
                        Cancel Editing
                      </button>
                    )}
                  </form>

                  <div className="form-note">
                    <span>🔒</span>
                    Employee information is stored in your database.
                  </div>
                </div>
              )}

              <div className="list-section">

                <div className="list-heading">
                  <div>
                    <p className="eyebrow">TEAM DIRECTORY</p>
                    <h2>All Employees</h2>
                  </div>
                  <span className="employee-badge">
                    {filteredEmployees.length} Records
                  </span>
                </div>

                <div className="filters">

                  <div className="search-box">
                    <span>⌕</span>
                    <input
                      type="search"
                      placeholder="Search employees..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </div>

                  <select
                    value={filterDepartment}
                    onChange={e => setFilterDepartment(e.target.value)}
                  >
                    <option value="All">All Departments</option>
                    {departments.map(dep => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>

                </div>

                {loading ? (
                  <div className="loading-state">
                    <div className="loader"></div>
                    <p>Loading employee records...</p>
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">♙</div>
                    <h3>No employees found</h3>
                    <p>
                      {employees.length === 0
                        ? 'There are currently no employee records.'
                        : 'Try changing your search or department filter.'}
                    </p>
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Email</th>
                          <th>Department</th>
                          {isAdmin && <th>Actions</th>}
                        </tr>
                      </thead>

                      <tbody>
                        {filteredEmployees.map(employee => (
                          <tr key={employee.id}>
                            <td>
                              <div className="employee-name">
                                <div className="avatar">
                                  {employee.name.charAt(0).toUpperCase()}
                                </div>
                                <strong>{employee.name}</strong>
                              </div>
                            </td>

                            <td>{employee.email}</td>

                            <td>
                              <span className="department-badge">
                                {employee.department}
                              </span>
                            </td>

                            {isAdmin && (
                              <td>
                                <div className="actions">
                                  <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(employee)}
                                    title="Edit employee"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(employee.id)}
                                    title="Delete employee"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>

            </section>

            <footer className="footer">
              <p>PeopleSphere © 2026 · Employee Management System</p>
              <p>Powered by React · ASP.NET Core · PostgreSQL</p>
            </footer>
          </>
        )}

      </main>
    </div>
  )
}

export default App
