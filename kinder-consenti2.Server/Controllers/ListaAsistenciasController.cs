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
    public class ListaAsistenciasController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ListaAsistenciasController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        // GET: api/ObtenerListaAsistencia
        [HttpGet]
        [Route("ObtenerListaAsistencia/{gruposId}&{fecha}")]
        public async Task<ActionResult<List<ListaAsistencia>>> ObtenerListaAsistencia(int gruposId, DateOnly fecha)
        {
            return Ok(await _context.ListaAsistencia.Where(x => x.GruposId == gruposId && x.Fecha == fecha).ToListAsync());
        }

        // GET: api/ObtenerListaAsistenciaAlumno/
        [HttpGet]
        [Route("ObtenerListaAsistenciaAlumno/{idAlumno}")]
        public async Task<ActionResult<List<ListaAsistencia>>> GetListaAsistencia(int idAlumno)
        {
            var listaAsistencia = await _context.ListaAsistencia.Where(x => x.AlumnoId == idAlumno).ToListAsync();
            if (listaAsistencia.Count==0)
                return BadRequest("No se encontraron datos");
            return Ok(listaAsistencia);
        }

        // PUT: api/ListaAsistencias/
        [HttpPut]
        [Route("ActualizarAsistencia")]
        public async Task<ActionResult<ListaAsistencia>> ActualizarAsistencia(ListaAsistencia listaAsistencia)
        {
            _context.ListaAsistencia.Update(listaAsistencia);
            try
            {
                await _context.SaveChangesAsync();
                var actualizado = await _context.ListaAsistencia.FindAsync(listaAsistencia.IdListaAsistencia);
                return Ok(actualizado);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }

        // POST: api/ListaAsistencias
        [HttpPost]
        [Route("CrearListaAsistencia")]
        public async Task<ActionResult<string>> PostListaAsistencia(List<ListaAsistencia> listaAsistencia)
        {
            await _context.ListaAsistencia.AddRangeAsync(listaAsistencia);
            try
            {
                await _context.SaveChangesAsync();
                return Ok("Lista Agregada");
            }
            catch (Exception ex) { return BadRequest("Error: "+ex.Message); }
        }      

    }
}
