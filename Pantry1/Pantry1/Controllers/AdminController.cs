using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pantry1API.Data;
using Pantry1API.Models;

namespace Pantry1API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly PantryContext _context;

        public AdminController(PantryContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Select(u => new { u.Id, u.Username, u.Email, u.Role })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("pantry/{UserId}")]
        
        public async Task<IActionResult> GetUserPantry(int UserId)
        {
            var pantries = await _context.Pantry
                .Where(p => p.UserId == UserId)  
                .Include(p => p.User)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Quantity,
                    User = p.User.Username
                })
                .ToListAsync();

            if (!pantries.Any())
            {
                return NotFound(new { message = "No pantry items found for this user." });
            }

            return Ok(pantries);
        }


        [HttpPut("promote/{id}")]
        public async Task<IActionResult> PromoteUserToAdmin(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            user.Role = "Admin";
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.Username} promoted to Admin." });
        }

        [HttpDelete("delete-user/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"User {user.Username} deleted." });
        }
    }
}
