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
    public class MaterialDidacticoesController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public MaterialDidacticoesController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        // GET: api/ObtenerMaterialesDidacticos
        [HttpGet]
        [Route("ObtenerMaterialesDidacticos")]
        public async Task<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticos()
        {
            return Ok(await _context.MaterialDidactico.ToListAsync());
        }

        [HttpGet]
        [Route("ObtenerMaterialesDidacticosAct")]
        public async Task<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticosAct()
        {
            return Ok(await _context.MaterialDidactico.Where(x => x.StatusAct == true).ToListAsync());
        }

        [HttpGet]
        [Route("ObtenerMaterialesDidacticosInact")]
        public async Task<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticosInact()
        {
            return Ok(await _context.MaterialDidactico.Where(x => x.StatusAct == false).ToListAsync());
        }

        [HttpGet]
        [Route("ObtenerMaterialesDidacticosPadre/{idPadre}")]
        public async Task<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticosPadre(int idPadre)
        {
            List<MaterialDidactico> materiales = new List<MaterialDidactico>();
            var alumnos = await _context.Alumno.Where(x => x.PadreId == idPadre).ToListAsync();
            if (alumnos.Count != 0)
            {
                List<int> idsGrupos = new List<int>();
                foreach (var alumno in alumnos)
                {
                    var encontrado = _context.GruposAlumnos.Where(x => x.AlumnoId == alumno.IdAlumno && x.Status == true).FirstOrDefault();
                    if (encontrado != null)
                        idsGrupos.Add(encontrado.AlumnoId);
                }
                if (idsGrupos.Count > 0)
                {
                    foreach (var item in idsGrupos)
                    {
                        var encontrados = await _context.MaterialDidactico.Where(x => x.GruposId == item && x.StatusAct == true).ToListAsync();
                        materiales.AddRange(encontrados);
                    }
                }
            }
            return NotFound("No se encontraron materiales");
        }



        // GET: api/ObtenerMaterialDidactico/
        [HttpGet]
        [Route("ObtenerMaterialDidactico/{id}")]
        public async Task<ActionResult<MaterialDidactico>> ObtenerMaterialDidactico(int id)
        {
            var materialDidactico = await _context.MaterialDidactico.FindAsync(id);
            if (materialDidactico == null)
            {
                return NotFound("No encontrado");
            }
            return Ok(materialDidactico);
        }


        // GET: api/ObtenerMaterialDidacticoGrupo/
        [HttpGet]
        [Route("ObtenerMaterialDidacticoGrupo/{idGrupo}")]
        public async Task<ActionResult<List<MaterialDidactico>>> ObtenerMaterialDidacticoGrupo(int idGrupo)
        {
            var materialesDidactico = await _context.MaterialDidactico.Where(x => x.GruposId == idGrupo && x.StatusAct == true).ToListAsync();
            if (materialesDidactico.Count() == 0)
            {
                return BadRequest("No encontrado");
            }
            return Ok(materialesDidactico);
        }

        // PUT: api/EditarMaterialDidactico
        [HttpPut]
        [Route("EditarMaterialDidactico")]
        public async Task<ActionResult<MaterialDidactico>> EditarMaterialDidactico(MaterialDidactico materialDidactico)
        {
            _context.MaterialDidactico.Update(materialDidactico);
            try
            {
                await _context.SaveChangesAsync();
                return Ok(await _context.MaterialDidactico.FindAsync(materialDidactico.IdMaterialDidactico));
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }



        [HttpPut]
        [Route("InactivarMaterialDidactico/{id}")]
        public async Task<ActionResult<MaterialDidactico>> InactivarMaterialDidactico(int id)
        {
            var encontrado = await _context.MaterialDidactico.FindAsync(id);
            if (encontrado == null)
                return NotFound("No encontrado");
            encontrado.StatusAct = false;
            _context.MaterialDidactico.Update(encontrado);
            try
            {
                await _context.SaveChangesAsync();
                return Ok("Inactivado: " + encontrado.NombreArchivo);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }

        // POST: api/CrearMaterialDidactico
        [HttpPost]
        [Route("CrearMaterialDidactico")]
        public async Task<ActionResult<MaterialDidactico>> CrearMaterialDidactico(MaterialDidactico materialDidactico)
        {
            try
            {
                materialDidactico.StatusAct = true;
                await _context.MaterialDidactico.AddAsync(materialDidactico);
                await _context.SaveChangesAsync();
                var insertado = await _context.MaterialDidactico.FindAsync(materialDidactico.IdMaterialDidactico);
                return Ok(insertado);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }

        // DELETE: api/EliminarMaterialDidactico/5
        [HttpDelete]
        [Route("EliminarMaterialDidactico/{id}")]
        public async Task<ActionResult<string>> DeleteMaterialDidactico(int id)
        {
            var materialDidactico = await _context.MaterialDidactico.FindAsync(id);
            if (materialDidactico == null)
            {
                return NotFound("No encontrado");
            }
            _context.MaterialDidactico.Remove(materialDidactico);
            await _context.SaveChangesAsync();
            return Ok("Eliminado");
        }
    }
}
