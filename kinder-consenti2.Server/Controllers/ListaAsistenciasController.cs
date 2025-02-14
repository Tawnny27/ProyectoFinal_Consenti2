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
        public ActionResult<List<ListaAsistencia>> ObtenerListaAsistencia(int gruposId, DateOnly fecha)
        {
            return Ok(_context.ListaAsistencia.Where(x => x.GruposId == gruposId && x.Fecha == fecha).ToList());
        }

        // GET: api/ObtenerListaAsistenciaAlumno/
        [HttpGet]
        [Route("ObtenerListaAsistenciaAlumno/{idAlumno}")]
        public ActionResult<List<ListaAsistencia>> GetListaAsistencia(int idAlumno)
        {
            var listaAsistencia = _context.ListaAsistencia.Where(x => x.AlumnoId == idAlumno).ToList();
            if (!listaAsistencia.Any())
                return BadRequest("No se encontraron datos");
            return Ok(listaAsistencia);
        }

        // PUT: api/ListaAsistencias/
        [HttpPut]
        [Route("ActualizarAsistencia")]
        public ActionResult<ListaAsistencia> ActualizarAsistencia(ListaAsistencia listaAsistencia)
        {
            _context.ListaAsistencia.Update(listaAsistencia);
            try
            {
                _context.SaveChanges();
                var actualizado = _context.ListaAsistencia.Find(listaAsistencia.IdListaAsistencia);
                return Ok(actualizado);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }

        // POST: api/ListaAsistencias
        [HttpPost]
        [Route("CrearListaAsistencia")]
        public async Task<ActionResult<string>> PostListaAsistencia(List<ListaAsistencia> listaAsistencia)
        {
            _context.ListaAsistencia.AddRange(listaAsistencia);
            try
            {
                await _context.SaveChangesAsync();
                return Ok("Lista Agregada");
            }
            catch (Exception ex) { return BadRequest("Error: "+ex.Message); }
        }      

    }
}
