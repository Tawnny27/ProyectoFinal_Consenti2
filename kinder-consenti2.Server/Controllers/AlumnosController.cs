﻿using kinder_consenti2.Server.Herramientas;
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

        //************** Consultar AlumnosActivos ******************
        [HttpGet]
        [Route("ObtenerAlumnosActivos")]
        public async Task<ActionResult<List<Alumno>>> ObtenerAlumnosActivos()
        {
            return Ok(await _context.Alumno.Where(x=> x.Estatus==true).ToListAsync());
        }

        //************** Consultar AlumnosActivos ******************
        [HttpGet]
        [Route("ObtenerAlumnosInactivos")]
        public async Task<ActionResult<List<Alumno>>> ObtenerAlumnosInactivos()
        {
            return Ok(await _context.Alumno.Where(x => x.Estatus == false).ToListAsync());
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
                alumno.Estatus = true;
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
    //****************************Inactivar Alumno*************************

        [HttpGet]
        [Route("InactivarAlumno/{id}")]
        public async Task<ActionResult<string>> InactivarAlumno(int id)
        {
            var alumno = await _context.Alumno.FindAsync(id);
            if (alumno == null)
                return NotFound("No se encontyraron datos");
            alumno.Estatus = false;
            _context.Alumno.Update(alumno);
            await _context.SaveChangesAsync();
            return Ok("Alumno Inactivado");
        }

        //****************************Inactivar Alumno*************************
        [HttpGet]
        [Route("ActivarAlumno/{id}")]
        public async Task<ActionResult<string>> ActivarAlumno(int id)
        {
            var alumno = await _context.Alumno.FindAsync(id);
            if (alumno == null)
                return NotFound("No se encontyraron datos");
            alumno.Estatus = true;
            _context.Alumno.Update(alumno);
            await _context.SaveChangesAsync();
            return Ok("Alumno Inactivado");
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
