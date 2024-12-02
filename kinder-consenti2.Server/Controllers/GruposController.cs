using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GruposController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public GruposController(Concenti2pruebasContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("ObtenerGrupos")]
        public ActionResult<List<Grupos>> ObtenerGrupos()
        {
            return Ok(_context.Grupos.ToList());
        }

        [HttpGet]
        [Route("BuscarGrupo/{id}")]
        public ActionResult<Grupos> BuscarGrupo(int id)
        {
            return Ok(_context.Grupos.Find(id));
        }

        [HttpPost]
        [Route("CrearGrupo")]
        public ActionResult<Grupos> CrearGrupo(Grupos grupo)
        {
            var usuario = _context.Usuario.Find(grupo.UsuarioId);
            if (usuario.RolId != 2)
                return BadRequest("Error: intenta asignar un Usuario que no es maestro.");
            _context.Grupos.Add(grupo);
            _context.SaveChanges();
            var insertado = _context.Grupos.Find(grupo.IdGrupos);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarGrupos")]
        public ActionResult<Grupos> EditarGrupos(Grupos grupo)
        {
            _context.Grupos.Update(grupo);
            _context.SaveChanges();
            return Ok(_context.Grupos.Find(grupo.IdGrupos));
        }

        [HttpDelete]
        [Route("EliminarGrupos/{id}")]
        public ActionResult<string> EliminarGrupos(int id)
        {
            var grupo = _context.Grupos.Find(id);
            _context.Grupos.Remove(grupo);
            _context.SaveChanges();
            return Ok("Grupo eliminado");
        }

    }
}
