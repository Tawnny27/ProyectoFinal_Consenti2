using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AlumnosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public AlumnosController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        //************** Consultar Alumnos ******************
        [HttpGet]
        [Route("ObtenerAlumnos")]
        public ActionResult<List<Alumno>> ObtenerAlumnos()
        {
            return Ok(_context.Alumno.ToList());
        }

        //************** Consultar un Alumno******************
        [HttpGet]
        [Route("BuscarAlumno/{id}")]
        public ActionResult<Alumno> BuscarAlumnos(int id)
        {
            var alumno = _context.Alumno.Find(id);
            if (alumno == null)
                return BadRequest("No encontrado");
            return Ok(alumno);
        }

        //********************* Crear Alumnos **************************
        [HttpPost]
        [Route("CrearAlumno")]
        public ActionResult<Alumno> CrearAlumno(Alumno alumno)
        {
            _context.Alumno.Add(alumno);
            _context.SaveChanges();
            var insertado = _context.Alumno.Find(alumno.IdAlumno);
            return Ok(insertado);
        }

        //********************* Editar Alumnos **************************
        [HttpPut]
        [Route("EditarAlumno")]
        public ActionResult<Alumno> EditarAlumno(Alumno alumno)
        {
            _context.Alumno.Update(alumno);
            _context.SaveChanges();
            return Ok(_context.Alumno.Find(alumno.IdAlumno));
        }

        //********************* Eliminar Alumnos **************************
        [HttpDelete]
        [Route("EliminarAlumno/{id}")]
        public ActionResult<string> EliminarAlumno(int id)
        {
            var alumno = _context.Alumno.Find(id);
            _context.Alumno.Remove(alumno);
            _context.SaveChanges();
            return Ok("Alumno eliminado");
        }
    }
}
