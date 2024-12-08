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
    public class EvaluacionKindersController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public EvaluacionKindersController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        // GET: api/ObtenerEvaluaciones
        [HttpGet]
        [Route("ObtenerEvaluaciones/{fechaInicio}&{FechaFin}")]
        public async Task<ActionResult<List<EvaluacionKinder>>> ObtenerEvaluaciones(DateOnly fechaInicio, DateOnly FechaFin)
        {
            return Ok(await _context.EvaluacionKinder.Where(x=> x.Fecha>=fechaInicio && x.Fecha<=FechaFin).ToListAsync());
        }

        // GET: api/ObtenerEvaluacion/5
        [HttpGet]
        [Route("ObtenerEvaluacion/{id}")]
        public async Task<ActionResult<EvaluacionKinder>> ObtenerEvaluacion(int id)
        {
            var evaluacionKinder = await _context.EvaluacionKinder.FindAsync(id);
            if (evaluacionKinder == null)
                return BadRequest("No encontado");
            return Ok(evaluacionKinder);
        }       

        // POST: api/EvaluacionKinders
        [HttpPost]
        [Route("CrearEvaluacionKinder")]
        public async Task<ActionResult<EvaluacionKinder>> CrearEvaluacionKinder(EvaluacionKinder evaluacionKinder)
        {
            try
            {
                _context.EvaluacionKinder.Add(evaluacionKinder);
                await _context.SaveChangesAsync();
                var insertado = await _context.EvaluacionKinder.FindAsync(evaluacionKinder.IdEvaluacionKinder);
                return Ok(insertado);
            }
            catch (Exception ex) { return BadRequest("Error: "+ex.Message); }
        }       
    }
}
