using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GruposAlumnosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public GruposAlumnosController(Concenti2pruebasContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("ObtenerGrupoAlumnos/{idGrupo}")]
        public ActionResult<List<GruposAlumnos>> ObtenerGrupoAlumnos(int idGrupo)
        {
            return Ok(_context.GruposAlumnos.Where(x=> x.GrupoId==idGrupo).ToList());
        }

        [HttpGet]
        [Route("BuscarGruposAlumno/{idAlumno}")]
        public ActionResult<GruposAlumnos> BuscarGruposAlumno(int idAlumno)
        {
            return Ok(_context.GruposAlumnos.Where(x=> x.AlumnoId==idAlumno).FirstOrDefault());
        }

        [HttpPost]
        [Route("CrearGruposAlumno")]
        public ActionResult<GruposAlumnos> CrearGruposAlumno(GruposAlumnos gruposAlumnos)
        {
            //Validar el cupo de grupo
            int registros = _context.GruposAlumnos.Where(x => x.GrupoId == gruposAlumnos.GrupoId).Count();
            var grupo = _context.Grupos.Find(gruposAlumnos.GrupoId);
            int cupo = grupo.Cupo;
            if (registros >= cupo)
                return BadRequest("El cupo esta completo, no se puden aghregar mas alumnos");
            //----------------------

            //Validar que no este ya registrado al mismo grupo
            if(_context.GruposAlumnos.Where(x=> x.AlumnoId==gruposAlumnos
            .AlumnoId && x.GrupoId==gruposAlumnos.GrupoId).Count()>0)
                return BadRequest("No puede ingresar dos veces un alumno a un mismo grupo");
            //-----------------------------------------------

            _context.GruposAlumnos.Add(gruposAlumnos);
            _context.SaveChanges();
            var insertado = _context.GruposAlumnos.Find(gruposAlumnos.IdGruposAlumnos);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarGruposAlumno")]
        public ActionResult<GruposAlumnos> EditarGruposAlumno(GruposAlumnos gruposAlumnos)
        {
            
            
            if (_context.GruposAlumnos.Where(x => x.AlumnoId == gruposAlumnos
            .AlumnoId && x.GrupoId == gruposAlumnos.GrupoId) != null)
                return BadRequest("No puede ingresar dos veces un alumnoa un mismo grupo");
            _context.GruposAlumnos.Update(gruposAlumnos);
            _context.SaveChanges();
            return Ok(_context.GruposAlumnos.Find(gruposAlumnos.IdGruposAlumnos));
        }

        [HttpDelete]
        [Route("EliminarGruposAlumno/{id}")]
        public ActionResult<string> EliminarGruposAlumno(int id)
        {
            var algo = _context.GruposAlumnos.Find(id);
            _context.GruposAlumnos.Remove(algo);
            _context.SaveChanges();
            return Ok("Ago eliminado");
        }

    }
}
