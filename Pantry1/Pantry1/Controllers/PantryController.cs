using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pantry1API.Data;
using Pantry1API.Models;
using System.Security.Claims;

namespace Pantry1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    
    public class PantryController : ControllerBase
    {
        private readonly PantryContext _context;

        public PantryController(PantryContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<IActionResult> GetPantryItems()
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (role == "Admin")
            {
                
                var allItems = await _context.Pantry
                    .Include(p => p.User)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Quantity,
                        User = p.User.Username
                    })
                    .ToListAsync();

                return Ok(allItems);
            }
            else
            {
                
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");


                var items = await _context.Pantry
                    .Where(p => p.UserId == userId)
                    .Select(p => new
                    {
                        p.Id,
                        p.Name,
                        p.Quantity
                    })
                    .ToListAsync();

                return Ok(items);
            }
        }

       
        [HttpPost("{name}")]
        public async Task<IActionResult> AddItem(string name)
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var existingItem = await _context.Pantry
                .FirstOrDefaultAsync(p => p.Name == name && p.UserId == userId);

            if (existingItem != null)
            {
                existingItem.Quantity++;
            }
            else
            {
                var item = new Pantry
                {
                    Name = name,
                    Quantity = 1,
                    UserId = userId
                };
                _context.Pantry.Add(item);
            }

            await _context.SaveChangesAsync();
            return Ok("Item");
        }

        
        [HttpDelete("{name}")]
        public async Task<IActionResult> RemoveItem(string name)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var item = await _context.Pantry
                .FirstOrDefaultAsync(p => p.Name == name && (p.UserId == userId || User.IsInRole("Admin")));

            if (item == null)
                return NotFound("Item not found");

            if(item.Quantity <= 1)
            {
                _context.Pantry.Remove(item);
            }
            else
            {
                item.Quantity--;
            }
            await _context.SaveChangesAsync();
            return Ok("Item");
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaginatedItems(int page = 1, int pageSize = 5)
        {
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            IQueryable<Pantry> query = _context.Pantry;

            if (role != "Admin")
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

                query = query.Where(p => p.UserId == userId);
            }

            var totalItems = await query.CountAsync();
            var items = await query
                .OrderBy(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { items, totalItems });
        }

    }
}
