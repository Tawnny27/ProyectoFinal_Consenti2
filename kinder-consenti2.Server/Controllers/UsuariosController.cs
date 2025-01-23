using kinder_consenti2.Server.Herramientas;
using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileSystemGlobbing.Internal;
using System.Net.Mail;
using System.Text.RegularExpressions;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
            return Ok(_context.Usuario.Include(p => p.Alumnos).Include(p=> p.Rol).ToList());
        }

        //************** Consultar Maestros ******************
        [HttpGet]
        [Route("ObtenerMaestros")]
        public ActionResult<List<Usuario>> ObtenerMaestros()
        {
            return Ok(_context.Usuario.Where(x=> x.RolId==2).ToList());
        }

        //************** Consultar Padres ******************
        [HttpGet]
        [Route("ObtenerPadres")]
        public ActionResult<List<Usuario>> ObtenerPadres()
        {
            return Ok(_context.Usuario.Where(x => x.RolId == 3).Include(p => p.Alumnos).ToList());
        }

        //************** Acceso Usuarios ******************       

        [HttpPost]
        [Route("AccesoUsuario2")]
        public ActionResult<Usuario> AccesoUsuario2(Acceso datosAcesso)
        {            
            try
            {
                string PassEncryp = Encryptar.encripSHA256(datosAcesso.contrasenna);
                var logueado = _context.Usuario.Where
                    (
                        x => x.ContrasennaUsuario == PassEncryp &&
                        x.CorreoUsuario == datosAcesso.correo
                    ).FirstOrDefault();
                if (logueado != null)
                    return Ok(logueado);
                return BadRequest("Correo o contraseña invalido");
            }
            catch (Exception ex)
            {
                return BadRequest( "Error: "+ex.Message) ;
            }

        }

        //--------------------------------------------------------------------

        //******************* Consultar un Usuario ******************
        [HttpGet]
        [Route("BuscarUsuarios/{id}")]
        public ActionResult<Usuario> BuscarUsuarios(int id)
        {
            var usuario = _context.Usuario.Include(p => p.Alumnos).Include(p=> p.Rol).FirstOrDefault(x=> x.IdUsuario==id);
            if (usuario == null)
                return BadRequest("No encontrado");
            return Ok(usuario);
        }

        //********************* Crear Usuarios **************************
        [HttpPost]
        [Route("CrearUsuario")]
        public ActionResult<Usuario> CrearUsuario(Usuario usuario)
        {
            try
            {
                var usuarioRev = _context.Usuario.FirstOrDefault(x => x.CorreoUsuario == usuario.CorreoUsuario);
                if (usuarioRev != null)
                    return BadRequest("Correo ya existe");

                string clavegenerica = Guid.NewGuid().ToString().Substring(0, 8);
                usuario.ContrasennaUsuario = Encryptar.encripSHA256(clavegenerica);
                usuario.PassGenerico = true;
                _context.Usuario.Add(usuario);
                _context.SaveChanges();

                var insertado = _context.Usuario.Find(usuario.IdUsuario);
                insertado.ContrasennaUsuario = clavegenerica;

                var dat = _context.SetingCorreo.Find(1);
                CorreoEnvio correoEnvio = new CorreoEnvio();
                correoEnvio.EnviarCorreo(587, dat.CorreoOrigen, dat.ContrasennaOrigen, usuario.CorreoUsuario, dat.smtpClient, dat.asunto, dat.cuerpo, clavegenerica);

                return Ok(insertado);
            }
            catch (Exception ex)
            {
                return StatusCode(400, "Ha ocurrido un error al crear el usuario: " + ex.Message);
            }
        }



        //************** Cambiar Contraseña ******************

        [HttpPut]
        [Route("CambiarContrasena")]
        public ActionResult<string> CambiarContrasena(Acceso DatosCambio) // recibe un objeto con el correo, contraseña y contraseña de verificación
        {
            /*
             * Espressiones regulares
              Contenga al menos una mayúscula ((?=.*[A-Z])).
              Contenga al menos un número ((?=.*\d)).
              Contenga al menos un carácter especial ((?=.*[@$!%*?&])).
              Tenga entre 8 y 16 caracteres ([A-Za-z\d@$!%*?&]{8,16}).
             */          


            if (DatosCambio.correo!=null&& DatosCambio.contrasenna != null &&
                DatosCambio.contrasennaValidacion != null && DatosCambio.contrasenna== DatosCambio.contrasennaValidacion)// sevalidan los datos
            {
                string reglas = @"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$";
                if (!Regex.IsMatch(DatosCambio.contrasenna, reglas))
                {
                    return BadRequest("La contraseña no cumple con los parametro minimos: " +
                        "entre 8 y 16 caracteres, " +
                        "almenos: " +
                        "una mayuscula, " +
                        "un caracter especial, " +
                        "un número.");
                }
                var usuario = _context.Usuario.Where(x => x.CorreoUsuario == DatosCambio.correo).FirstOrDefault();// se busca el usuaior en la BD
                if (usuario != null) 
                {
                    usuario.ContrasennaUsuario = Encryptar.encripSHA256(DatosCambio.contrasenna); // se encripta la nueva contraseña
                    usuario.PassGenerico = false;// cambia el status a false  para la vandera de alerta de clave real
                    _context.Usuario.Update(usuario);// se actulizan los datos
                    _context.SaveChanges();// se actulizan en la BD
                    return Ok("Clave de acceso actualizada favor inicie sesion");
                }
                return BadRequest("Este correo no existe en nuetros registros");
            }
            return BadRequest("Falta algun dato o alguno es incorrecto");
        }


        //************** Recuperar contraseña ******************

        [HttpPut]
        [Route("RecuperarContrasena")]
        public ActionResult<string> RecuperarContrasena(Acceso recuperacion) // recibe un objeto con el correo del usuario
        {
            if (recuperacion.correo != null)
            {
               var usuario = _context.Usuario.Where(x=> x.CorreoUsuario == recuperacion.correo).FirstOrDefault(); // busca el usuario en la BD
                if (usuario != null)
                {
                    string clavegenerica = Guid.NewGuid().ToString().Substring(0, 8); // genera la clave temporal
                    usuario.ContrasennaUsuario = Encryptar.encripSHA256(clavegenerica); // encriopta la clave temporal
                    usuario.PassGenerico = true; // cambia el status a true  para la vandera de alerta de clave generica
                    _context.Usuario.Update(usuario); // se actulizan los datos
                    _context.SaveChanges();// se actulizan en la BD
                    var dat = _context.SetingCorreo.Find(1); // traen los datos del servidor de correo gmail
                    CorreoEnvio correoEnvio = new CorreoEnvio();
                    correoEnvio.EnviarCorreo(587, dat.CorreoOrigen, dat.ContrasennaOrigen,
                        usuario.CorreoUsuario, dat.smtpClient, dat.asunto, dat.cuerpo, clavegenerica);// se envia el correo con la clave generica
                    return Ok("Revisar correo de recuperación");
                }
                return BadRequest("Datos incorrectos");

            }
            return BadRequest("Datos incorrectos");
        }

        //********************* Editar Usuarios **************************
        [HttpPut]
        [Route("EditarUsuario")]
        public ActionResult<Usuario> EditarUsuario(Usuario usuario)
        {
            //usuario.ContrasennaUsuario = Encryptar.encripSHA256(usuario.ContrasennaUsuario);              
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
