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
        public async Task<ActionResult<List<ActividadComida>>> ObtenerActividadComidas(int gruposId, DateOnly fecha)
        {
            try
            { 
                return Ok(await _context.ActividadComida.Where(x => x.GruposId == gruposId && x.Fecha == fecha).ToListAsync());
            }
            catch (Exception ex){ return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //************** Consultar un ActividadComidasAlumno******************
        [HttpGet]
        [Route("BuscarActividadComidas/{idAlumno}")]
        public async Task<ActionResult<List<ActividadComida>>> BuscarActividadComidas(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                    return BadRequest("Debe ingresar un Alumno");
                var actividadComidas = await _context.ActividadComida.Where(x => x.AlumnoId == idAlumno).ToListAsync();
                if (!actividadComidas.Any())
                    return Ok("No hay registros");
                return Ok(actividadComidas);
            }
            catch (Exception ex) {  return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Crear ActividadComida ********************
        [HttpPost]
        [Route("CrearActividadComidas")]
        public async Task<ActionResult<string>> CrearActividadComida(List<ActividadComida> ListaActividadComida)
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
                await _context.SaveChangesAsync();
                return Ok("Registros insertados");
            }
            catch (Exception ex) {  return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Editar ActividadComida ********************
        [HttpPut]
        [Route("EditarActividadComida")]
        public async Task<ActionResult<ActividadComida>> EditarActividadComida(ActividadComida actividadComida)
        {
            try
            {
                if (actividadComida == null)
                    return BadRequest("Debeingresar Los datos");
                _context.ActividadComida.Update(actividadComida);
                await _context.SaveChangesAsync();
                return Ok(await _context.ActividadComida.FindAsync(actividadComida.IdActividadComida));
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message);}
        }
    }
}
