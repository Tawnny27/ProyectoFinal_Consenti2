using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ActividadDormirController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ActividadDormirController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        //************** Consultar ActividadDormir ******************
        [HttpGet]
        [Route("ObtenerActividadDormirs/{gruposId}&{fecha}")]
        public ActionResult<List<ActividadDormir>> ObtenerActividadDormirs(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(_context.ActividadDormir.ToList().Where(x => x.GruposId == gruposId && x.Fecha == fecha));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //************** Consultar un ActividadDormir ******************
        [HttpGet]
        [Route("BuscarActividadDormirs/{idAlumno}")]
        public ActionResult<List<ActividadDormir>> BuscarActividadDormirs(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                {
                    return BadRequest("Debe ingresar un Alumno");
                }
                var actividadDormir = _context.ActividadDormir.ToList().Where(x => x.AlumnoId == idAlumno);
                if (actividadDormir.Count() == 0)
                {
                    return Ok("No hay registros");
                }
                return Ok(actividadDormir);
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }

        }

        //********************* Crear actividadDormir ********************
        [HttpPost]
        [Route("CrearActividadDormir")]
        public ActionResult<string> CrearActividadComida(List<ActividadDormir> ListaactividadDormir)
        {
            try
            {
                foreach (var item in ListaactividadDormir)
                {
                    //if (item.AlumnoId == 0 || item.Tiempo == new TimeOnly(00,00,00) || item.Fecha == new DateOnly(0001, 01, 01))
                    if (item.AlumnoId == 0 || item.GruposId == 0)
                        return BadRequest("Falta algun dato en almenos un registro");
                }
                _context.ActividadDormir.AddRange(ListaactividadDormir);
                _context.SaveChanges();
                return Ok("Registros insertados");
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //********************* Editar ActividadDormir ********************
        [HttpPut]
        [Route("EditarActividadDormir")]
        public ActionResult<ActividadDormir> EditarActividadDormir(ActividadDormir actividadDormir)
        {
            try
            {
                if (actividadDormir == null)
                {
                    return BadRequest("Debeingresar Los datos");
                }
                _context.ActividadDormir.Update(actividadDormir);
                _context.SaveChanges();
                return Ok(_context.ActividadDormir.Find(actividadDormir.IdActividadDormir));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }
    }
}

