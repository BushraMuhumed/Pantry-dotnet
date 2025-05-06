using Pantry1API.Data;
using System.ComponentModel.DataAnnotations;

namespace Pantry1API.Models
{

    public class RegisterModel
    {
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;

        public IEnumerable<ValidationResult> validate
            (ValidationContext validationContext)
        {
            var dbcontext = (PantryContext?)validationContext.GetService(typeof(PantryContext));

            if (dbcontext != null && dbcontext.Users.Any(u => u.Email == Email))
            {
                yield return new ValidationResult("Email already registered", new[] { nameof(Email) });
            }
            if (dbcontext != null && dbcontext.Users.Any(u => u.Username == Username))
            {
                yield return new ValidationResult("Username already registered", new[] { nameof(Email) });
            }
        }

       
    }
}