using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [Route("api/")]
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
        public async Task<ActionResult<List<ActividadBanno>>> ObtenerActividadBannos(int gruposId, DateOnly fecha)
        {
            try
            {
                return Ok(await _context.ActividadBanno.Where(x => x.GruposId == gruposId && x.Fecha == fecha).ToListAsync());
            }
            catch (Exception ex) {return BadRequest("Error en la ejecución " + ex.Message);}
        }

        //************** Consultar un ActividadBanno ******************
        [HttpGet]
        [Route("BuscarActividadBannos/{idAlumno}")]
        public async Task<ActionResult<List<ActividadBanno>>> BuscarActividadBannos(int idAlumno)
        {
            try
            {
                if (idAlumno == 0)
                    return BadRequest("Debe ingresar un Alumno");
                var actividadBanno = await _context.ActividadBanno.Where(x => x.AlumnoId == idAlumno).ToListAsync();
                if (actividadBanno.Count() == 0)
                    return NotFound("No hay registros");
                return Ok(actividadBanno);
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message); }
        }

        //********************* Crear ActividadBanno ********************
        [HttpPost]
        [Route("CrearActividadBanno")]
        public async Task<ActionResult<string>> CrearActividadBanno(List<ActividadBanno> ListaActividadBanno)
        {
            try
            {
                if (!ListaActividadBanno.Any())
                    return BadRequest("No hay registos a guardar, favor valide que este enviando la información");
                foreach (var item in ListaActividadBanno)
                {
                    // if (item.AlumnoId == 0 || item.Catidad == 0 || item.Fecha == new DateOnly(0001, 01, 01))
                    if (item.AlumnoId == 0 || item.GruposId == 0 )
                        return BadRequest("Falta algun dato en almenos un registro");
                }
                _context.ActividadBanno.AddRange(ListaActividadBanno);
                await _context.SaveChangesAsync();
                return Ok("Registros insertados");
            }
            catch (Exception ex) { return BadRequest("Error en la ejecución " + ex.Message);}
        }

        //********************* Editar ActividadBanno ********************
        [HttpPut]
        [Route("EditarActividadBanno")]
        public async Task<ActionResult<ActividadBanno>> EditarActividadBanno(ActividadBanno actividadBanno)
        {
            try
            {
                if (actividadBanno == null)
                    return BadRequest("Debe ingresar Los datos");
                _context.ActividadBanno.Update(actividadBanno);
                await _context.SaveChangesAsync();
                return Ok(await _context.ActividadBanno.FindAsync(actividadBanno.IdActividadBanno));
            }
            catch (Exception ex){ return BadRequest("Error en la ejecución " + ex.Message); }
        }
    }
}
