using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadBannoController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ActividadBannoController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        //************** Consultar ActividadBanno ******************
        [HttpGet]
        [Route("ObtenerActividadBannos/{gruposId}&{fecha}")]
        public ActionResult<List<ActividadBanno>> ObtenerActividadBannos(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(_context.ActividadBanno.ToList().Where(x => x.GruposId == gruposId && x.Fecha == fecha));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //************** Consultar un ActividadBanno ******************
        [HttpGet]
        [Route("BuscarActividadBannos/{idAlumno}")]
        public ActionResult<List<ActividadBanno>> BuscarActividadBannos(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                {
                    return BadRequest("Debe ingresar un Alumno");
                }
                var actividadBanno = _context.ActividadBanno.ToList().Where(x => x.AlumnoId == idAlumno);
                if (actividadBanno.Count() == 0)
                {
                    return Ok("No hay registros");
                }
                return Ok(actividadBanno);
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }

        }

        //********************* Crear ActividadBanno ********************
        [HttpPost]
        [Route("CrearActividadBanno")]
        public ActionResult<string> CrearActividadBanno(List<ActividadBanno> ListaActividadBanno)
        {
            try
            {
                foreach (var item in ListaActividadBanno)
                {
                    // if (item.AlumnoId == 0 || item.Catidad == 0 || item.Fecha == new DateOnly(0001, 01, 01))
                    if (item.AlumnoId == 0 || item.GruposId == 0 )
                        return BadRequest("Falta algun dato en almenos un registro");
                }
                _context.ActividadBanno.AddRange(ListaActividadBanno);
                _context.SaveChanges();
                return Ok("Registros insertados");
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //********************* Editar ActividadBanno ********************
        [HttpPut]
        [Route("EditarActividadBanno")]
        public ActionResult<ActividadBanno> EditarActividadBanno(ActividadBanno actividadBanno)
        {
            try
            {
                if (actividadBanno == null)
                {
                    return BadRequest("Debeingresar Los datos");
                }
                _context.ActividadBanno.Update(actividadBanno);
                _context.SaveChanges();
                return Ok(_context.ActividadBanno.Find(actividadBanno.IdActividadBanno));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }
    }
}
