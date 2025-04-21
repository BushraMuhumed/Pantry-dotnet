using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pantry1API.Data;
using Pantry1API.Models;

namespace Pantry1API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PantryController : ControllerBase
    {
        private readonly PantryContext _context;

        public PantryController(PantryContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pantry>>> GetPantryItems()
        {
            return await _context.Pantry.ToListAsync();
        }

        [HttpPost("{name}")]
        public async Task<IActionResult> AddItem(string name)
        {
            var item = await _context.Pantry.FirstOrDefaultAsync(p => p.Name == name);
            if (item != null)
            {
                item.Quantity++;
            }
            else
            {
                item = new Pantry { Name = name, Quantity = 1 };
                _context.Pantry.Add(item);
            }

            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpDelete("{name}")]
        public async Task<IActionResult> RemoveItem(string name)
        {
            var item = await _context.Pantry.FirstOrDefaultAsync(p => p.Name == name);
            if (item == null) return NotFound();

            if (item.Quantity == 1)
            {
                _context.Pantry.Remove(item);
            }
            else
            {
                item.Quantity--;
            }

            await _context.SaveChangesAsync();
            return Ok(item);
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaginatedItems(int page = 1, int pageSize = 5)
        {
         

            var totalItems = await _context.Pantry.CountAsync();

            var items = await _context.Pantry
                                      .OrderBy(p => p.Id)
                                      .Skip((page - 1) * pageSize)
                                      .Take(pageSize)
                                      .ToListAsync();

            var response = new
            {
                TotalItems = totalItems,
                Page = page,
                PageSize = pageSize,
                Items = items
            };

            return Ok(response);
        }



    }
}



