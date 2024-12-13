using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<List<ActividadDormir>>> ObtenerActividadDormirs(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(await _context.ActividadDormir.Where(x => x.GruposId == gruposId && x.Fecha == fecha).ToListAsync());
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //************** Consultar un ActividadDormir ******************
        [HttpGet]
        [Route("BuscarActividadDormirs/{idAlumno}")]
        public async Task<ActionResult<List<ActividadDormir>>> BuscarActividadDormirs(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                    return BadRequest("Debe ingresar un Alumno");
                var actividadDormir = await _context.ActividadDormir.Where(x => x.AlumnoId == idAlumno).ToListAsync();
                if (actividadDormir.Count==0)
                    return Ok("No hay registros");
                return Ok(actividadDormir);
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Crear actividadDormir ********************
        [HttpPost]
        [Route("CrearActividadDormir")]
        public async Task<ActionResult<string>> CrearActividadComida(List<ActividadDormir> ListaactividadDormir)
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
                await _context.SaveChangesAsync();
                return Ok("Registros insertados");
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Editar ActividadDormir ********************
        [HttpPut]
        [Route("EditarActividadDormir")]
        public async Task<ActionResult<ActividadDormir>> EditarActividadDormir(ActividadDormir actividadDormir)
        {
            try
            {
                if (actividadDormir == null)
                    return BadRequest("Debeingresar Los datos");
                _context.ActividadDormir.Update(actividadDormir);
                await _context.SaveChangesAsync();
                return Ok(await _context.ActividadDormir.FindAsync(actividadDormir.IdActividadDormir));
            }
            catch (Exception ex) {  return BadRequest("Error en la ejecución " + ex.Message); }
        }
    }
}

