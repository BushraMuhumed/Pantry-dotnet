
using System.ComponentModel.DataAnnotations;

namespace Pantry1API.Models
{
    public class Pantry
    {
        
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public int Quantity { get; set; }

        public int UserId { get; set; }


        public User? User { get; set; } 
    }
}
