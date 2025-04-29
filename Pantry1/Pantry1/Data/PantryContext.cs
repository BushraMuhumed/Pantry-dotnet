using Microsoft.EntityFrameworkCore;
using Pantry1API.Models;

namespace Pantry1API.Data
{
    public class PantryContext : DbContext
    {
        public PantryContext(DbContextOptions<PantryContext> options) : base(options) { }

        public DbSet<Pantry> Pantry { get; set; }
        public DbSet<User> Users { get; set; }

        
    }
}
