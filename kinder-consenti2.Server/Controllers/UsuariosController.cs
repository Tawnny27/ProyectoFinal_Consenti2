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

        //************** Acceso Usuarios ******************
        [HttpGet]
        [Route("AccesoUsuario/{CorreoUsuario}&{ContrasennaUsuario}")]
        public ActionResult<Usuario> AccesoUsuario(string CorreoUsuario, string ContrasennaUsuario)
        {
            if (ContrasennaUsuario != null && CorreoUsuario != null)
            {
                var logueado = _context.Usuario.Where(x => x.ContrasennaUsuario == ContrasennaUsuario && x.CorreoUsuario == CorreoUsuario).FirstOrDefault();
                if (logueado != null)                
                    return Ok(logueado);
                return BadRequest("Correo o contraseña invalido");
            }
            return BadRequest("Faltan datos");
        
        }

        //-----------------------------------------------------

        [HttpPost]
        [Route("AccesoUsuario2")]
        public ActionResult<Usuario> AccesoUsuario2(Acceso datosAcesso)
        {            
            try
            {
                var logueado = _context.Usuario.Where
                    (
                        x => x.ContrasennaUsuario == datosAcesso.contrasenna &&
                        x.CorreoUsuario == datosAcesso.correo
                    ).FirstOrDefault();
                if (logueado != null)
                    return Ok(logueado);
                return BadRequest("Correo o contraseña invalido");
            }
            catch (Exception ex)
            {
                return BadRequest( "Error: "+ex) ;
            }

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
