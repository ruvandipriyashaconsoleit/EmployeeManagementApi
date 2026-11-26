# Employee Management System

## 1. Project Overview

The Employee Management System is a full-stack web application developed to manage employee information.

The system provides secure user authentication and role-based access control. Administrators can manage employee records, while normal users can view employee information.

## 2. Main Features

- User Registration
- User Login
- JWT Authentication
- Role-Based Authorization
- Employee Management (CRUD)
- Employee Search and Filtering
- PostgreSQL Database Integration
- Docker Containerization
- React User Interface

## 3. Technologies Used

### Backend
- C#
- ASP.NET Core Web API
- Entity Framework Core
- ASP.NET Core Identity
- JWT Authentication

### Frontend
- React.js
- Vite
- JavaScript
- CSS

### Database
- PostgreSQL

### Development and Deployment Tools
- Visual Studio Code
- Docker
- Docker Compose
- Git
- GitHub
- Swagger / OpenAPI

## 4. Project Architecture

The application consists of three main services:

1. **Frontend:** React application that provides the user interface.
2. **Backend:** ASP.NET Core Web API that handles business logic, authentication and employee operations.
3. **Database:** PostgreSQL database that stores employee and user information.

Docker Compose is used to run the frontend, backend and database services together.

## 5. Authentication and Authorization

The system uses ASP.NET Core Identity and JSON Web Tokens (JWT).

### Registration
- New users can register using an email address and password.
- Newly registered users are assigned the NormalUser role.

### Login
- Users can log in using their email and password.
- The backend validates the credentials.
- A JWT access token is returned after successful authentication.

### Authorization
- JWT tokens are used to authenticate API requests.
- Role-based authorization controls access to employee management operations.

### Logout
- The frontend removes the stored access token and user information when the user logs out.

## 6. User Roles and Permissions

### Admin
- View employees
- Add employees
- Update employee information
- Delete employees

### NormalUser
- View employees
- Cannot add employees
- Cannot update employees
- Cannot delete employees

## 7. API Endpoints

Base URL:

`http://localhost:8080/api`

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /Auth/register | Register a new user |
| POST | /Auth/login | Log in |

### Employee Endpoints

| Method | Endpoint | Description | Permission |
|---|---|---|---|
| GET | /Employees | Get all employees | Authenticated users |
| GET | /Employees/{id} | Get employee by ID | Authenticated users |
| POST | /Employees | Create employee | Admin |
| PUT | /Employees/{id} | Update employee | Admin |
| DELETE | /Employees/{id} | Delete employee | Admin |

## 8. Database

The application uses PostgreSQL as its relational database.

Entity Framework Core is used for database operations and migrations.

Main data includes:
- Employee information
- User accounts
- User roles
- Authentication-related data

## 9. Docker Setup

Docker Compose manages the following services:

| Service | Container | Port |
|---|---|---|
| Frontend | employee-frontend | 5173 |
| Backend | employee-api | 8080 |
| Database | employee-postgres | 5432 |

### Requirements
- Docker Desktop
- Git
- A web browser

### Environment Configuration

Create a `.env` file in the project root directory and configure the required environment variables.

Required configuration includes:
- POSTGRES_DB
- POSTGRES_USER
- POSTGRES_PASSWORD
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD

Do not commit the `.env` file or expose secret values.

### Run the Application

Open a terminal in the project root directory.

Build and start all services:

```powershell
docker compose up --build -d
```

Check running containers:

```powershell
docker compose ps
```

### Access the Application

Frontend:

http://localhost:5173

Backend Swagger:

http://localhost:8080/swagger

### Stop the Application

```powershell
docker compose down
```

To stop the containers without removing the database volume, use the command above. Do not use `-v` unless you intentionally want to remove the database volume and its stored data.

## 10. Testing

The following functionalities have been tested:

- User registration
- User login
- Admin authentication
- NormalUser authentication
- Employee listing
- Admin employee creation
- Admin employee updating
- Admin employee deletion
- NormalUser access restrictions
- PostgreSQL database connectivity
- Docker container execution

## 11. Project Repository

GitHub Repository:

https://github.com/ruvandipriyashaconsoleit/EmployeeManagementApi

---

**Project:** Employee Management System

**Backend:** ASP.NET Core Web API

**Frontend:** React.js

**Database:** PostgreSQL

**Containerization:** Docker Compose
