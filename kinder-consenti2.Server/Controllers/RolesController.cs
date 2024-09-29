using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public RolesController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        //************** Consultar Roles ******************
        [HttpGet]
        [Route("ObtenerRoles")]
        public ActionResult<List<Rol>> ObtenerRol()
        {
            return Ok(_context.Rol.ToList());
        }

        //************** Consultar un Rol******************
        [HttpGet]
        [Route("BuscarRol/{id}")]
        public ActionResult<Rol> BuscarRol(int id)
        {
            var rol = _context.Rol.Find(id);
            if (rol == null)
                return BadRequest("No encontrado");
            return Ok(rol);
        }

        //********************* Crear Roles **************************
        [HttpPost]
        [Route("CrearRol")]
        public ActionResult<Rol> CrearRol(Rol rol)
        {
            _context.Rol.Add(rol);
            _context.SaveChanges();
            var insertado = _context.Rol.Find(rol.IdRol);
            return Ok(insertado);
        }

        //********************* Editar Roles **************************
        [HttpPut]
        [Route("EditarRol")]
        public ActionResult<Rol> EditarRol(Rol rol)
        {
            _context.Rol.Update(rol);
            _context.SaveChanges();
            return Ok(_context.Rol.Find(rol.IdRol));
        }

        //********************* Eliminar Roles **************************
        [HttpDelete]
        [Route("EliminarRol/{id}")]
        public ActionResult<string> EliminarRol(int id)
        {
            var rol = _context.Rol.Find(id);
            _context.Rol.Remove(rol);
            _context.SaveChanges();
            return Ok("Rol eliminado");
        }

    }
}
