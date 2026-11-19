
using EmployeeManagementApi.Data;
using EmployeeManagementApi.Models;
using EmployeeManagementApi.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagementApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<EmployeesController> _logger;

    public EmployeesController(
        ApplicationDbContext context,
        ILogger<EmployeesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/employees
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Employee>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
    {
        _logger.LogInformation("Getting all employees.");

        var employees = await _context.Employees.ToListAsync();

        return Ok(employees);
    }

    // GET: api/employees/{id}
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(Employee), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<Employee>> GetEmployee(int id)
    {
        _logger.LogInformation("Getting employee with ID: {Id}", id);

        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            _logger.LogWarning("Employee with ID {Id} was not found.", id);
            return NotFound();
        }

        return Ok(employee);
    }

    // POST: api/employees
    [HttpPost]
    [ProducesResponseType(typeof(Employee), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<Employee>> AddEmployee(
        CreateEmployeeDto employeeDto)
    {
        _logger.LogInformation(
            "Adding a new employee: {Name}",
            employeeDto.Name);

        // Check whether the email already exists
        var emailExists = await _context.Employees
            .AnyAsync(e => e.Email == employeeDto.Email);

        if (emailExists)
        {
            _logger.LogWarning(
                "Employee with email {Email} already exists.",
                employeeDto.Email);

            return BadRequest(
                "An employee with this email already exists.");
        }

        // Convert DTO to Employee Model
        var employee = new Employee
        {
            Name = employeeDto.Name,
            Email = employeeDto.Email,
            Department = employeeDto.Department
        };

        _context.Employees.Add(employee);

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Employee created successfully with ID: {Id}",
            employee.Id);

        return StatusCode(StatusCodes.Status201Created, employee);
    }

    // PUT: api/employees/{id}
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(Employee), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateEmployee(
        int id, UpdateEmployeeDto updatedEmployee)
    {
        _logger.LogInformation("Updating employee with ID: {Id}", id);

        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            _logger.LogWarning("Employee with ID {Id} was not found.", id);
            return NotFound();
        }

        // Check whether another employee is using this email
        var emailExists = await _context.Employees
            .AnyAsync(e => e.Email == updatedEmployee.Email && e.Id != id);

        if (emailExists)
        {
            _logger.LogWarning(
                "Email {Email} is already used by another employee.",
                updatedEmployee.Email);

            return BadRequest(
                "This email is already used by another employee.");
        }

        // Update employee details using DTO
        employee.Name = updatedEmployee.Name;
        employee.Email = updatedEmployee.Email;
        employee.Department = updatedEmployee.Department;

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Employee with ID {Id} updated successfully.",
            id);

        return Ok(employee);
    }

    // DELETE: api/employees/{id}
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        _logger.LogInformation("Deleting employee with ID: {Id}", id);

        var employee = await _context.Employees.FindAsync(id);

        if (employee == null)
        {
            _logger.LogWarning("Employee with ID {Id} was not found.", id);
            return NotFound();
        }

        _context.Employees.Remove(employee);

        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Employee with ID {Id} deleted successfully.",
            id);

        return NoContent();
    }
}
