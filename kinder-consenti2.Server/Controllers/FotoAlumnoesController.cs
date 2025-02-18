using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using kinder_consenti2.Server.Models;

namespace kinder_consenti2.Server.Controllers
{
    [Route("api/")]
    [ApiController]
    public class FotoAlumnoesController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public FotoAlumnoesController(Concenti2pruebasContext context)
        {
            _context = context;
        }


        // GET: api/FotosAlumnos
        [HttpGet]
        [Route("ObtenerFotosAlumnos")]
        public async Task<ActionResult<IEnumerable<FotoAlumno>>> ObtenerFotosAlumnos()
        {
            return await _context.FotoAlumno.OrderBy(x=> x.Fecha).ToListAsync();
        }

        // GET: api/FotosAlumno
        [HttpGet]
        [Route("ObtenerFotosAlumno/{AlumnoId}")]
        public async Task <ActionResult<List<FotoAlumno>>> ObtenerFotosAlumno(int AlumnoId)
        {
            return await _context.FotoAlumno.Where(x=> x.AlumnoId==AlumnoId).ToListAsync();
        }

        // PUT: api/EditarFotosAlumno/      
        [HttpPut]
        [Route("EditarFotosAlumno")]
        public async Task <ActionResult<FotoAlumno>> EditarFotosAlumno( FotoAlumno fotoAlumno)
        {       
            _context.FotoAlumno.Update(fotoAlumno);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(await _context.FotoAlumno.FindAsync(fotoAlumno.IdFotoAlumno));
            }
            catch (Exception ex) {return BadRequest("Error: "+ex.Message);}        
        }

        // POST: api/CrearFotosAlumno
        [HttpPost]
        [Route("CrearFotosAlumno")]
        public async Task<ActionResult<FotoAlumno>> CrearFotosAlumno(FotoAlumno fotoAlumno)
        {
            try
            {
                await _context.FotoAlumno.AddAsync(fotoAlumno);
                await _context.SaveChangesAsync();
                var insertado = await _context.FotoAlumno.FindAsync(fotoAlumno.IdFotoAlumno);
                return Ok(insertado);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message);}
        }

        // DELETE: api/EliminarFotosAlumno/
        [HttpDelete]
        [Route("EliminarFotosAlumno/{id}")]
        public async Task<ActionResult<string>> EliminarFotosAlumno(int id)
        {
            var fotoAlumno = await _context.FotoAlumno.FindAsync(id);
            if (fotoAlumno == null)
            {
                return BadRequest("No encontrado");
            }
            _context.FotoAlumno.Remove(fotoAlumno);
            await _context.SaveChangesAsync();
            return Ok("Eliminado");
        }        
    }
}
