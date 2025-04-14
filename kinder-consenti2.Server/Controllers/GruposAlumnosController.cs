using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class GruposAlumnosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public GruposAlumnosController(Concenti2pruebasContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("ObtenerGrupoAlumnos/{idGrupo}")]
        public async Task <ActionResult<List<GruposAlumnos>>> ObtenerGrupoAlumnos(int idGrupo)
        {
            return Ok(await _context.GruposAlumnos.Include(x=> x.Alumno).Where(x=> x.GruposId==idGrupo && x.Status==true).ToListAsync());
        }

        [HttpGet]
        [Route("ObtenerGrupoAlumnosXmaesto/{idMaestro}")]
        public async Task<ActionResult<List<GruposAlumnos>>> ObtenerGrupoAlumnosXmaesto(int idMaestro)
        {
            var grupo = await _context.Grupos.Where(x => x.UsuarioId == idMaestro && x.Status == true).FirstOrDefaultAsync();
            if(grupo!=null)
                return Ok(await _context.GruposAlumnos.Include(x => x.Alumno).Where(x => x.GruposId == grupo.IdGrupos).ToListAsync());
            return NotFound("No hay grupos asociados");

        }

        [HttpGet]
        [Route("BuscarGruposAlumno/{idAlumno}")]
        public async Task<ActionResult<GruposAlumnos>> BuscarGruposAlumno(int idAlumno)
        {
            return Ok(await _context.GruposAlumnos.Where(x=> x.AlumnoId==idAlumno).FirstOrDefaultAsync());
        }


        [HttpPost]
        [Route("CrearGruposAlumno")]
        public async Task<ActionResult<GruposAlumnos>> CrearGruposAlumno(GruposAlumnos gruposAlumnos)
        {
            //Validar el cupo de grupo
            gruposAlumnos.Status = true;
            int registros =await _context.GruposAlumnos.Where(x => x.GruposId == gruposAlumnos.GruposId).CountAsync();
            var grupo = await _context.Grupos.FindAsync(gruposAlumnos.GruposId);
            if (grupo == null)
                return NotFound("No se encontraron datos favor validar");
            int cupo = grupo.Cupo;
            if (registros >= cupo)
                return BadRequest("El cupo esta completo, no se puden agregar mas alumnos");
            //----------------------                 

            //Validar que no este ya registrado al mismo grupo
            if(await _context.GruposAlumnos.Where(x=> x.AlumnoId==gruposAlumnos
            .AlumnoId && x.GruposId==gruposAlumnos.GruposId).CountAsync()>0)
                return BadRequest("No puede ingresar dos veces un alumno a un mismo grupo");
            //-----------------------------------------------

            //Inactivarlo de un grupo anterior    
            var alumno = await _context.GruposAlumnos.Where(x => x.AlumnoId == gruposAlumnos
            .AlumnoId && x.Status == true).FirstOrDefaultAsync();
            if (alumno != null)
            { 
                alumno.Status = false;
                _context.GruposAlumnos.Update(alumno);
                await _context.SaveChangesAsync();
            }

            await _context.GruposAlumnos.AddAsync(gruposAlumnos);
            await _context.SaveChangesAsync();
            var insertado = await _context.GruposAlumnos.FindAsync(gruposAlumnos.IdGruposAlumnos);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarGruposAlumno")]
        public async Task<ActionResult<GruposAlumnos>> EditarGruposAlumno(GruposAlumnos gruposAlumnos)
        {
            var existeGrupoAlumno = await _context.GruposAlumnos
                .AnyAsync(x => x.AlumnoId == gruposAlumnos.AlumnoId && x.GruposId == gruposAlumnos.GruposId);

            if (existeGrupoAlumno)
            {
                return BadRequest("No puede ingresar dos veces un alumno a un mismo grupo");
            }

            _context.GruposAlumnos.Update(gruposAlumnos);
            await _context.SaveChangesAsync();

            var grupoActualizado = await _context.GruposAlumnos.FindAsync(gruposAlumnos.IdGruposAlumnos);
            return Ok(grupoActualizado);
        }

        [HttpPut]
        [Route("InactivarAlumnoG/{idAlumno}")]
        public async Task<ActionResult<string>> InactivarAlumno(int idAlumno)
        {
            var alumnoEncontrado = await _context.GruposAlumnos.Where(x => x.AlumnoId == idAlumno && x.Status == true).FirstOrDefaultAsync();

            if (alumnoEncontrado == null)
            {
                return BadRequest("Este alumno no se encuentar en ningun grupo activo");
            }
            alumnoEncontrado.Status = false;
            _context.GruposAlumnos.Update(alumnoEncontrado);
            await _context.SaveChangesAsync();           
            return Ok("Alumno inactivado");
        }


        [HttpDelete]
        [Route("EliminarGruposAlumno/{id}")]
        public async Task<ActionResult<string>> EliminarGruposAlumno(int id)
        {
            var algo = await _context.GruposAlumnos.FindAsync(id);
            _context.GruposAlumnos.Remove(algo);
            await _context.SaveChangesAsync();
            return Ok("Ago eliminado");
        }

    }
}
