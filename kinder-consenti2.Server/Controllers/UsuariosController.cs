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

        //************** Consultar Usuarios ******************
        [HttpGet]
        [Route("ObtenerUsuarios")]
        public ActionResult<List<Usuario>> ObtenerUsuarios()
        {
            return Ok(_context.Usuario.ToList());
        }

        //************** Consultar un Usuario ******************
        [HttpGet]
        [Route("BuscarUsuarios/{id}")]
        public ActionResult<Usuario> BuscarUsuarios(int id)
        {
            var usuario = _context.Usuario.Find(id);
            if (usuario == null)
                return BadRequest("No encontrado");
            return Ok(usuario);
        }

        //********************* Crear Usuarios **************************
        [HttpPost]
        [Route("CrearUsuario")]
        public ActionResult<Usuario> CrearUsuario(Usuario usuario)
        {
            _context.Usuario.Add(usuario);
            _context.SaveChanges();
            var insertado = _context.Usuario.Find(usuario.IdUsuario);
            return Ok(insertado);
        }

        //********************* Editar Usuarios **************************
        [HttpPut]
        [Route("EditarUsuario")]
        public ActionResult<Usuario> EditarUsuario(Usuario usuario)
        {
            _context.Usuario.Update(usuario);
            _context.SaveChanges();
            return Ok(_context.Usuario.Find(usuario.IdUsuario));
        }

        //********************* Eliminar Usuarios **************************
        [HttpDelete]
        [Route("EliminarUsuario/{id}")]
        public ActionResult<string> EliminarUsuario(int id)
        {
            var usuario = _context.Usuario.Find(id);
            _context.Usuario.Remove(usuario);
            _context.SaveChanges();
            return Ok("Usuario eliminado");
        }

    }
}
