using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadHuertaController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ActividadHuertaController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        //************** Consultar ActividadHuerta ******************
        [HttpGet]
        [Route("ObtenerActividadHuertas/{gruposId}&{fecha}")]
        public ActionResult<List<ActividadHuerta>> ObtenerActividadHuertas(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(_context.ActividadHuerta.ToList().Where(x => x.GruposId == gruposId && x.Fecha == fecha));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //************** Consultar un ActividadHuerta ******************
        [HttpGet]
        [Route("BuscarActividadHuertas/{idAlumno}")]
        public ActionResult<List<ActividadHuerta>> BuscarActividadHuertas(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                {
                    return BadRequest("Debe ingresar un Alumno");
                }
                var actividadHuerta = _context.ActividadHuerta.ToList().Where(x => x.AlumnoId == idAlumno);
                if (actividadHuerta.Any())
                {
                    return Ok("No hay registros");
                }
                return Ok(actividadHuerta);
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }

        }

        //********************* Crear ActividadHuerta ********************
        [HttpPost]
        [Route("CrearActividadHuerta")]
        public ActionResult<string> CrearActividadHuerta(List<ActividadHuerta> ListaActividadHuerta)
        {
            try
            {
                foreach (var item in ListaActividadHuerta)
                {
                    if (item.AlumnoId == 0 || item.Descripcion == null || item.GruposId == 0 ||
                        item.StatusParticipacion == 0 || item.Fecha == new DateOnly(0001, 01, 01))
                        return BadRequest("Falta algun dato en almenos un registro");
                }
                _context.ActividadHuerta.AddRange(ListaActividadHuerta);
                _context.SaveChanges();
                return Ok("Registros insertados");
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //********************* Editar ActividadHuerta ********************
        [HttpPut]
        [Route("EditarActividadHuerta")]
        public ActionResult<ActividadHuerta> EditarActividadHuerta(ActividadHuerta actividadHuerta)
        {
            try
            {
                if (actividadHuerta == null)
                {
                    return BadRequest("Debeingresar Los datos");
                }
                _context.ActividadHuerta.Update(actividadHuerta);
                _context.SaveChanges();
                return Ok(_context.ActividadHuerta.Find(actividadHuerta.IdActividadHuerta));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }
    }
}
