using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class GruposController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public GruposController(Concenti2pruebasContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("ObtenerGrupos")]
        public async Task<ActionResult<List<Grupos>>> ObtenerGrupos()
        {
            return Ok(await _context.Grupos.Include(x=> x.Usuario).ToListAsync());
        }

        [HttpGet]
        [Route("BuscarGrupo/{id}")]
        public async Task<ActionResult<Grupos>> BuscarGrupo(int id)
        {
            return Ok(await _context.Grupos.FindAsync(id));
        }

        [HttpPost]
        [Route("CrearGrupo")]
        public async Task<ActionResult<Grupos>> CrearGrupo(Grupos grupo)
        {
            var usuario = await _context.Usuario.FindAsync(grupo.UsuarioId);
            if (usuario == null) return NotFound("No se encontraron datos favor validar");
            if (usuario.RolId != 2) return BadRequest("Error: intenta asignar un Usuario que no es maestro.");
            grupo.Status = true;
            await _context.Grupos.AddAsync(grupo);
            await _context.SaveChangesAsync();
            var insertado = await _context.Grupos.FindAsync(grupo.IdGrupos);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarGrupos")]
        public async Task<ActionResult<Grupos>> EditarGrupos(Grupos grupo)
        {
            _context.Grupos.Update(grupo);
            await _context.SaveChangesAsync();
            return Ok(await _context.Grupos.FindAsync(grupo.IdGrupos));
        }

        [HttpDelete]
        [Route("EliminarGrupos/{id}")]
        public async Task<ActionResult<string>> EliminarGrupos(int id)
        {
            var grupo = await _context.Grupos.FindAsync(id);
            if (grupo == null) return NotFound("No se encontraron datos favor validar");
            _context.Grupos.Remove(grupo);
            await _context.SaveChangesAsync();
            return Ok("Grupo eliminado");
        }

    }
}
