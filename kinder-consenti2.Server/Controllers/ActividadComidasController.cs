using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ActividadComidasController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ActividadComidasController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        //************** Consultar ActividadComidas ******************
        [HttpGet]
        [Route("ObtenerActividadComidas/{gruposId}&{fecha}")]
        public ActionResult<List<ActividadComida>> ObtenerActividadComidas(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(_context.ActividadComida.ToList().Where(x=> x.GruposId== gruposId && x.Fecha==fecha));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //************** Consultar un ActividadComidasAlumno******************
        [HttpGet]
        [Route("BuscarActividadComidas/{idAlumno}")]
        public ActionResult<List<ActividadComida>> BuscarActividadComidas(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                {
                    return BadRequest("Debe ingresar un Alumno");
                }
                var actividadComidas = _context.ActividadComida.ToList().Where(x => x.AlumnoId == idAlumno);
                if (actividadComidas.Count() == 0)
                {
                    return Ok("No hay registros");
                }
                return Ok(actividadComidas);
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }

        }

        //********************* Crear ActividadComida ********************
        [HttpPost]
        [Route("CrearActividadComidas")]
        public ActionResult<string> CrearActividadComida(List<ActividadComida> ListaActividadComida)
        {
            try
            {
                foreach (var item in ListaActividadComida)
                {
                    if (item.AlumnoId == 0 || item.TipoComida == null || item.GruposId == 0 ||
                        item.StatusComida == 0 || item.Fecha == new DateOnly(0001, 01, 01))
                        return BadRequest("Falta algun dato en almenos un registro");
                }
                _context.ActividadComida.AddRange(ListaActividadComida);
                _context.SaveChanges();
                return Ok("Registros insertados");
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }

        //********************* Editar ActividadComida ********************
        [HttpPut]
        [Route("EditarActividadComida")]
        public ActionResult<ActividadComida> EditarActividadComida(ActividadComida actividadComida)
        {
            try
            {
                if (actividadComida == null)
                {
                    return BadRequest("Debeingresar Los datos");
                }
                _context.ActividadComida.Update(actividadComida);
                _context.SaveChanges();
                return Ok(_context.ActividadComida.Find(actividadComida.IdActividadComida));
            }
            catch (Exception ex)
            {
                return BadRequest("Error en la ejecución " + ex.Message);
            }
        }


    }
}
