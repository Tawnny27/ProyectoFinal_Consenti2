using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task< ActionResult<List<ActividadHuerta>>> ObtenerActividadHuertas(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(await _context.ActividadHuerta.Where(x => x.GruposId == gruposId && x.Fecha == fecha).ToListAsync());
            }
            catch (Exception ex){ return BadRequest("Error en la ejecución " + ex.Message);}
        }

        //************** Consultar un ActividadHuerta ******************
        [HttpGet]
        [Route("BuscarActividadHuertas/{idAlumno}")]
        public async Task<ActionResult<List<ActividadHuerta>>> BuscarActividadHuertas(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                    return BadRequest("Debe ingresar un Alumno");
                var actividadHuerta = await _context.ActividadHuerta.Where(x => x.AlumnoId == idAlumno).ToListAsync();
                if (actividadHuerta.Count()==0)
                    return Ok("No hay registros");
                return Ok(actividadHuerta);
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Crear ActividadHuerta ********************
        [HttpPost]
        [Route("CrearActividadHuerta")]
        public async Task<ActionResult<string>> CrearActividadHuerta(List<ActividadHuerta> ListaActividadHuerta)
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
                await _context.SaveChangesAsync();
                return Ok("Registros insertados");
            }
            catch (Exception ex){ return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Editar ActividadHuerta ********************
        [HttpPut]
        [Route("EditarActividadHuerta")]
        public async Task<ActionResult<ActividadHuerta>> EditarActividadHuerta(ActividadHuerta actividadHuerta)
        {
            try
            {
                if (actividadHuerta == null)
                    return BadRequest("Debeingresar Los datos");
                _context.ActividadHuerta.Update(actividadHuerta);
                await _context.SaveChangesAsync();
                return Ok(await _context.ActividadHuerta.FindAsync(actividadHuerta.IdActividadHuerta));
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message); }
        }
    }
}
