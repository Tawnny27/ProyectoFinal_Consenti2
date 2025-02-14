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
    [ApiController]
    [Route("api/")]    
    public class EventosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public EventosController(Concenti2pruebasContext context)
        {
            _context = context;
        }

     
        [HttpGet]
        [Route("ObtenerEventos")]
        public async Task<ActionResult<List<Eventos>>> ObtenerEventos()
        {
            return Ok(await _context.Eventos.ToListAsync());
        }

        [HttpGet]
        [Route("ObtenerEventosActivos")]
        public async Task<ActionResult<List<Eventos>>> ObtenerEventosActivos()
        {
            DateOnly fechaActual = DateOnly.FromDateTime(DateTime.Now);
            return Ok(await _context.Eventos.Where(x => x.Fecha >= fechaActual).ToListAsync());
        }

        [HttpGet]
        [Route("ObtenerEventosInactivos")]
        public async Task<ActionResult<List<Eventos>>> ObtenerEventosInactivos()
        {
            DateOnly fechaActual = DateOnly.FromDateTime(DateTime.Now);
            return Ok(await _context.Eventos.Where(x=> x.Fecha < fechaActual).ToListAsync());
        }


        [HttpGet]
        [Route("ObtenerEvento/{id}")]
        public async Task<ActionResult<Eventos>> ObtenerEvento(int id)
        {
            var eventos = await _context.Eventos.FindAsync(id);
            if (eventos == null)
            {
                return NotFound("No se encontró");
            }
            return Ok(eventos);
        }

        [HttpPut]
        [Route("EditarEvento")]
        public async Task<ActionResult<Eventos>> EditarEvento(Eventos eventos)
        {            
            try{
                _context.Eventos.Update(eventos);
                await _context.SaveChangesAsync();
                return Ok(await _context.Eventos.FindAsync(eventos.IdEventos));
            }
            catch ( Exception ex)
            {
                return BadRequest("Error: " + ex.Message);
            }            
        }

    
        [HttpPost]
        [Route("CrearEvento")]
        public async Task<ActionResult<Eventos>> CrearEvento(Eventos eventos)
        {
            try
            {
                _context.Eventos.Add(eventos);
                await _context.SaveChangesAsync();
                var insetado = await _context.Eventos.FindAsync(eventos.IdEventos);
                return Ok(insetado);
            }
            catch (Exception ex) 
            { 
                return BadRequest("Error: " + ex.Message);
            }            
        }

    
    }
}
