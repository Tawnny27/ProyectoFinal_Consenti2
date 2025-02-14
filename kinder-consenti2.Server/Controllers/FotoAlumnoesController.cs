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
        [Route("ObtenerFotosAlumno")]
        public async Task<ActionResult<IEnumerable<FotoAlumno>>> ObtenerFotosAlumno()
        {
            return await _context.FotoAlumno.OrderBy(x=> x.Fecha).ToListAsync();
        }

        // GET: api/FotosAlumno
        [HttpGet]
        [Route("ObtenerFotosAlumno/{AlumnoId}")]
        public ActionResult<List<FotoAlumno>> ObtenerFotosAlumno(int AlumnoId)
        {
            return  _context.FotoAlumno.Where(x=> x.AlumnoId==AlumnoId).ToList();
        }

        // PUT: api/EditarFotosAlumno/      
        [HttpPut]
        [Route("EditarFotosAlumno")]
        public ActionResult<FotoAlumno> EditarFotosAlumno( FotoAlumno fotoAlumno)
        {       
            _context.FotoAlumno.Update(fotoAlumno);
            try
            {
                _context.SaveChanges();
                return Ok(_context.FotoAlumno.Find(fotoAlumno.IdFotoAlumno));
            }
            catch (Exception ex) {return BadRequest("Error: "+ex.Message);}        
        }

        // POST: api/CrearFotosAlumno
        [HttpPost]
        [Route("CrearFotosAlumno")]
        public ActionResult<ActionResult<FotoAlumno>> CrearFotosAlumno(FotoAlumno fotoAlumno)
        {
            try
            {
                _context.FotoAlumno.Add(fotoAlumno);
                _context.SaveChanges();
                var insertado = _context.FotoAlumno.Find(fotoAlumno.IdFotoAlumno);
                return Ok(insertado);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message);}
        }

        // DELETE: api/EliminarFotosAlumno/
        [HttpDelete]
        [Route("EliminarFotosAlumno/{id}")]
        public ActionResult<string> EliminarFotosAlumno(int id)
        {
            var fotoAlumno = _context.FotoAlumno.Find(id);
            if (fotoAlumno == null)
            {
                return BadRequest("No encontrado");
            }
            _context.FotoAlumno.Remove(fotoAlumno);
            _context.SaveChanges();
            return Ok("Eliminado");
        }        
    }
}
