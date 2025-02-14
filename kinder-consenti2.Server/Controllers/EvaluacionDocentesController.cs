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
    public class EvaluacionDocentesController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public EvaluacionDocentesController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        // GET: api/ObtenerEvaluacionesDocente
        [HttpGet]
        [Route("ObtenerEvaluacionesDocente/{idDocente}&{fechaInicio}&{fechaFin}")]
        public async Task<ActionResult<List<EvaluacionDocente>>> ObtenerEvaluacionesDocente(
            int idDocente, DateOnly fechaInicio, DateOnly fechaFin)
        {
            return await _context.EvaluacionDocente.Where(x => x.UsuarioId == idDocente &&
            x.Fecha >= fechaInicio && x.Fecha <= fechaFin).ToListAsync();
        }

        // GET: api/ObtenerEvalaucionDocente/
        [HttpGet]
        [Route("ObtenerEvalaucionDocente/{id}")]
        public async Task<ActionResult<EvaluacionDocente>> ObtenerEvalaucionDocente(int id)
        {
            var evaluacionDocente = await _context.EvaluacionDocente.FindAsync(id);
            if (evaluacionDocente == null)
                return BadRequest("No encontrado");
            return Ok(evaluacionDocente);
        }

        // POST: api/CrearEvaluacionDocente
        [HttpPost]
        [Route("CrearEvaluacionDocente")]
        public async Task<ActionResult<EvaluacionDocente>> CrearEvaluacionDocente(EvaluacionDocente evaluacionDocente)
        {
            try
            {
                _context.EvaluacionDocente.Add(evaluacionDocente);
                await _context.SaveChangesAsync();
                var insertado = await _context.EvaluacionDocente.FindAsync(evaluacionDocente.IdEvaluacionDocente);
                return Ok(insertado);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }

    }
}
