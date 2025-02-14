using kinder_consenti2.Server.Herramientas;
using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class AlumnosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;
        private readonly SaveImages _saveImage;

        public AlumnosController(Concenti2pruebasContext context)
        {
            _context = context;
            _saveImage = new SaveImages();

        }

        //************** Consultar Alumnos ******************
        [HttpGet]
        [Route("ObtenerAlumnos")]
        public async Task <ActionResult<List<Alumno>>> ObtenerAlumnos()
        {
            return Ok(await _context.Alumno.ToListAsync());
        }

        //************** Consultar un Alumno******************
        [HttpGet]
        [Route("BuscarAlumno/{id}")]
        public async Task<ActionResult<Alumno>> BuscarAlumnos(int id)
        {
            var alumno = await _context.Alumno.FindAsync(id);
            if (alumno == null)
                return BadRequest("No encontrado");
            return Ok(alumno);
        }

        //********************* Crear Alumnos **************************
        [HttpPost]
        [Route("CrearAlumno")]
        public async Task<ActionResult<Alumno>> CrearAlumno(Alumno alumno)
        {
            try
            {
                _context.Alumno.Add(alumno);
                 await _context.SaveChangesAsync();
                var insertado = await _context.Alumno.FindAsync(alumno.IdAlumno);                
                return Ok(insertado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }
        }

        //********************* Editar Alumnos **************************
        [HttpPut]
        [Route("EditarAlumno")]
        public async Task<ActionResult<Alumno>> EditarAlumno(Alumno alumno)
        {
            _context.Alumno.Update(alumno);
            await _context.SaveChangesAsync();
            return Ok(await _context.Alumno.FindAsync(alumno.IdAlumno));
        }

        //********************* Eliminar Alumnos **************************
        [HttpDelete]
        [Route("EliminarAlumno/{id}")]
        public async Task<ActionResult<string>> EliminarAlumno(int id)
        {
            var alumno = await _context.Alumno.FindAsync(id);
            if (alumno == null)
                return NotFound("No se encontyraron datos");
            _context.Alumno.Remove(alumno);
            await _context.SaveChangesAsync();
            return Ok("Alumno eliminado");
        }
    }
}
