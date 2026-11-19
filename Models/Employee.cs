
using System.ComponentModel.DataAnnotations;

namespace EmployeeManagementApi.Models;

public class Employee
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Employee name is required.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Employee email is required.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Employee department is required.")]
    public string Department { get; set; } = string.Empty;
}
