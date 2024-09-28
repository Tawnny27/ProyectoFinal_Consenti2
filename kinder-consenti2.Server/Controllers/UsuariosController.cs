using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public UsuariosController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ObtenerPadres")]
        public ActionResult<List<Padre>> ObtenerUsuarios()
        {
            return Ok(_context.Padre.ToList());
        }


        [HttpGet]
        [Route("BuscarPadre/{id}")]
        public ActionResult<Padre> BuscarPadre(int id)
        {
            var padre = _context.Padre.Find(id);
            if (padre == null)
                return BadRequest("No encontrado");
            return Ok(padre);

        }

        [HttpPost]
        [Route("CrearPadre")]
        public ActionResult<Padre> CrearPadre(Padre padre)
        {
            _context.Padre.Add(padre);
            _context.SaveChanges();
            var insertado = _context.Padre.Find(padre.IdPadre);
            return Ok(insertado);
        }


        [HttpPut]
        [Route("EditarPadre")]
        public ActionResult<Padre> EditarPadre(Padre padre)
        {
            _context.Padre.Update(padre);
            _context.SaveChanges();
            return Ok(_context.Padre.Find(padre.IdPadre));
        }


        [HttpDelete]
        [Route("EliminarPadre/{id}")]
        public ActionResult<string> EliminarPadre(int id)
        {
            var padre = _context.Padre.Find(id);
            _context.Padre.Remove(padre);
            _context.SaveChanges();
            return Ok("Padre eliminado");
        }

    }
}
