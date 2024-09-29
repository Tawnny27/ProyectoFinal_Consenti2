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

        //************** Consultar Usuarios internos ******************
        [HttpGet]
        [Route("ObtenerUsuariosInt")]
        public ActionResult<List<UsuarioInterno>> ObtenerUsuariosInt()
        {
            return Ok(_context.UsuarioInterno.ToList());
        }

        //************** Consultar un Usuario Interno******************
        [HttpGet]
        [Route("BuscarUsuariosInt/{id}")]
        public ActionResult<Padre> BuscarUsuariosInt(int id)
        {
            var usuarioInterno = _context.UsuarioInterno.Find(id);
            if (usuarioInterno == null)
                return BadRequest("No encontrado");
            return Ok(usuarioInterno);
        }

        //********************* Crear Usuarios Internos **************************
        [HttpPost]
        [Route("CrearUsuarioInterno")]
        public ActionResult<Padre> CrearUsuarioInterno(UsuarioInterno usuarioInterno)
        {
            _context.UsuarioInterno.Add(usuarioInterno);
            _context.SaveChanges();
            var insertado = _context.UsuarioInterno.Find(usuarioInterno.IdUsuario);
            return Ok(insertado);
        }

        //********************* Editar Usuarios Internos **************************
        [HttpPut]
        [Route("EditarUsuarioInterno")]
        public ActionResult<Padre> EditarUsuarioInterno(UsuarioInterno usuarioInterno)
        {
            _context.UsuarioInterno.Update(usuarioInterno);
            _context.SaveChanges();
            return Ok(_context.UsuarioInterno.Find(usuarioInterno.IdUsuario));
        }

        //********************* Eliminar Usuarios Internos **************************
        [HttpDelete]
        [Route("EliminarUsuarioInterno/{id}")]
        public ActionResult<string> EliminarUsuarioInterno(int id)
        {
            var usuarioInterno = _context.UsuarioInterno.Find(id);
            _context.UsuarioInterno.Remove(usuarioInterno);
            _context.SaveChanges();
            return Ok("Usuario eliminado");
        }

    }
}
