using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PadresController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public PadresController(Concenti2pruebasContext context)
        {
            _context = context;
        }


        //**************** Consultar Padres ***************************
        [HttpGet]
        [Route("ObtenerPadres")]
        public ActionResult<List<Padre>> ObtenerPadres()
        {
            return Ok(_context.Padre.ToList());
        }

        //************** Consultar un Padre ***************************
        [HttpGet]
        [Route("BuscarPadre/{id}")]
        public ActionResult<Padre> BuscarPadre(int id)
        {
            var padre = _context.Padre.Find(id);
            if (padre == null)
                return BadRequest("No encontrado");
            return Ok(padre);
        }

        //********************* Crear Padres **************************
        [HttpPost]
        [Route("CrearPadre")]
        public ActionResult<Padre> CrearPadre(Padre padre)
        {
            _context.Padre.Add(padre);
            _context.SaveChanges();
            var insertado = _context.Padre.Find(padre.IdPadre);
            return Ok(insertado);
        }

        //********************* Editar Padres **************************
        [HttpPut]
        [Route("EditarPadre")]
        public ActionResult<Padre> EditarPadre(Padre padre)
        {
            _context.Padre.Update(padre);
            _context.SaveChanges();
            return Ok(_context.Padre.Find(padre.IdPadre));
        }

        //********************* Eliminar Padres **************************
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
