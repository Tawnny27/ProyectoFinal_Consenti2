using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriaController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public CategoriaController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ObtenerCategorias")]
        public async  Task<ActionResult<List<Categoria>>> ObtenerCategorias()
        {
            return Ok(await _context.Categoria.ToListAsync());
        }

        [HttpGet]
        [Route("BuscarCategorias/{id}")]
        public async Task<ActionResult<Categoria>> BuscarCategorias(int id)
        {
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null)
                return BadRequest("No encontrado");
            return Ok(categoria);
        }

        [HttpPost]
        [Route("CrearCategoria")]
        public async Task<ActionResult<Categoria>> CrearCategoria(Categoria categoria)
        {
            _context.Categoria.Add(categoria);
            await _context.SaveChangesAsync();
            var insertado = await _context.Categoria.FindAsync(categoria.IdCategoria);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarCategoria")]
        public async Task<ActionResult<Categoria>> EditarCategoria(Categoria categoria)
        {
            _context.Categoria.Update(categoria);
            await _context.SaveChangesAsync();
            return Ok(await _context.Categoria.FindAsync(categoria.IdCategoria));
        }

        [HttpDelete]
        [Route("EliminarCategoria/{id}")]
        public async Task<ActionResult<string>> EliminarCategoria(int id)
        {
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null)
                return NotFound("No se encontraron datos a borrar");
            _context.Categoria.Remove(categoria);
            await _context.SaveChangesAsync();
            return Ok("Categoria eliminada");
        }


    }

}
