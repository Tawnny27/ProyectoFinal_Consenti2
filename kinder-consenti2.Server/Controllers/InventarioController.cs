using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InventarioController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public InventarioController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ObtenerInventario")]
        public async Task<ActionResult<List<Inventario>>> ObtenerInventario()
        {
            return Ok( await _context.Inventario.ToListAsync());
        }

        [HttpGet]
        [Route("BuscarInventario/{id}")]
        public async Task<ActionResult<Inventario>> BuscarInventario(int id)
        {
            return Ok(await _context.Inventario.FindAsync(id));
        }

        [HttpPost]
        [Route("CrearInventario")]
        public async Task<ActionResult<Inventario>> CrearInventario(Inventario inventario)
        {
            inventario.Descripcion = inventario.Descripcion.Trim();
            if(await _context.Inventario.Where(x=> x.Descripcion==inventario.Descripcion).FirstOrDefaultAsync()!= null)
                return BadRequest("Ya existe un producto con esa descripcion");
            inventario.Cantidad = 0;
            _context.Inventario.Add(inventario);
            await _context.SaveChangesAsync();
            var insertado = await _context.Inventario.FindAsync(inventario.IdInventario);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarInventario")]
        public async Task<ActionResult<Inventario>> EditarInventario(Inventario inventario)
        {
            _context.Inventario.Update(inventario);
            await _context.SaveChangesAsync();
            return Ok(await _context.Alumno.FindAsync(inventario.IdInventario));
        }

        [HttpDelete]
        [Route("EliminarInventario/{id}")]
        public async Task<ActionResult<string>> EliminarInventario(int id)
        {
            var inventario = await _context.Inventario.FindAsync(id);
            if(inventario == null) return NotFound("No se encontraron datos favor validar");
            _context.Inventario.Remove(inventario);
            await _context.SaveChangesAsync();
            return Ok("Inventario eliminado");
        }

    }
}
