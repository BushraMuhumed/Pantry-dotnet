using System.ComponentModel.DataAnnotations;

namespace Pantry1API.Models
{
    public class User
    {
        
        public int Id { get; set; }
        [Required]
        public string? Username { get; set; } 
        [Required]
        public string? Email { get; set; } 
        public string? PasswordHash { get; set; } 
        public string? Role { get; set; } 

        public List<Pantry> Pantry { get; set; } = new List<Pantry>();
    }
}
