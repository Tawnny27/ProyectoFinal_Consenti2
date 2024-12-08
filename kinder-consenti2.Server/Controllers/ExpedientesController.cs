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
    [Route("[controller]")]
    [ApiController]
    public class ExpedientesController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ExpedientesController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        // GET: api/ObtenerExpediente
        [HttpGet]
        [Route("ObtenerExpediente/{idAlumno}")]
        public async Task<ActionResult<List<Expediente>>> ObtenerExpediente(int idAlumno)
        {
            return Ok(await _context.Expediente.Where(x=> x.AlumnoId==idAlumno).ToListAsync());
        }

        // GET: api/ObtenerExpedienteId/
        [HttpGet]
        [Route("ObtenerExpedienteId/{id}")]
        public async Task<ActionResult<Expediente>> ObtenerExpedienteId(int id)
        {
            var expediente = await _context.Expediente.FindAsync(id);
            if (expediente == null)
            {
                return BadRequest("No encontrado");
            }
            return Ok(expediente);
        }

        // PUT: api/EditarExpediente/
        [HttpPut]
        [Route("EditarExpediente")]
        public async Task<ActionResult<Expediente>> PutExpediente(Expediente expediente)
        {
            _context.Expediente.Update(expediente);
            try
            {
                await _context.SaveChangesAsync();
                var actualizado = await _context.Expediente.FindAsync(expediente.IdExpediente);
                return Ok(actualizado);
            }
            catch (Exception ex) { return BadRequest("Error: "+ex.Message); }
        }

        // POST: api/CrearExpediente
        [HttpPost]
        [Route("CrearExpediente")]
        public async Task<ActionResult<Expediente>> CrearExpediente(Expediente expediente)
        {
            try
            {
                _context.Expediente.Add(expediente);
                await _context.SaveChangesAsync();
                var insertado = await _context.Expediente.FindAsync(expediente.IdExpediente);
                return Ok(insertado);
            }
            catch (Exception ex) { return BadRequest("Error: "+ex.Message); }
        }
      
    }
}
