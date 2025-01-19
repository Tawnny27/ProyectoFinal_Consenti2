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
        public ActionResult<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticos()
        {
            return Ok(_context.MaterialDidactico.ToList());
        }

        [HttpGet]
        [Route("ObtenerMaterialesDidacticosAct")]
        public ActionResult<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticosAct()
        {
            return Ok(_context.MaterialDidactico.Where(x=> x.StatusAct==true).ToList());
        }

        [HttpGet]
        [Route("ObtenerMaterialesDidacticosInact")]
        public ActionResult<ActionResult<List<MaterialDidactico>>> ObtenerMaterialesDidacticosInact()
        {
            return Ok(_context.MaterialDidactico.Where(x => x.StatusAct == false).ToList());
        }


        // GET: api/ObtenerMaterialDidactico/
        [HttpGet]
        [Route("ObtenerMaterialDidactico/{id}")]
        public ActionResult<MaterialDidactico> ObtenerMaterialDidactico(int id)
        {
            var materialDidactico = _context.MaterialDidactico.Find(id);
            if (materialDidactico == null)
            {
                return BadRequest("No encontrado");
            }
            return Ok(materialDidactico);
        }


        // GET: api/ObtenerMaterialDidacticoGrupo/
        [HttpGet]
        [Route("ObtenerMaterialDidacticoGrupo/{idGrupo}")]
        public ActionResult<List<MaterialDidactico>> ObtenerMaterialDidacticoGrupo(int idGrupo)
        {
            var materialesDidactico = _context.MaterialDidactico.Where(x=> x.GruposId==idGrupo && x.StatusAct==true).ToList();
            if (!materialesDidactico.Any())
            {
                return BadRequest("No encontrado");
            }
            return Ok(materialesDidactico);
        }

        // PUT: api/EditarMaterialDidactico
        [HttpPut]
        [Route("EditarMaterialDidactico")]
        public ActionResult<MaterialDidactico> EditarMaterialDidactico(MaterialDidactico materialDidactico)
        {            
            _context.MaterialDidactico.Update(materialDidactico);
            try
            {
                _context.SaveChanges();
                return Ok(_context.MaterialDidactico.Find(materialDidactico.IdMaterialDidactico));
            }
            catch (Exception ex){ return BadRequest("Error: " + ex.Message); }
        }


        // PUT: api/EditarMaterialDidactico
        [HttpPut]
        [Route("InactivarMaterialDidactico/{id}")]
        public ActionResult<MaterialDidactico> InactivarMaterialDidactico(int id)
        {
            var encontrado = _context.MaterialDidactico.Find(id);
            if (encontrado == null)
                return BadRequest("No encontrado");
            encontrado.StatusAct = false;
            _context.MaterialDidactico.Update(encontrado);           
            try
            {
                _context.SaveChanges();
                return Ok("Inactivado: "+encontrado.NombreArchivo);
            }
            catch (Exception ex) { return BadRequest("Error: " + ex.Message); }
        }

        // POST: api/CrearMaterialDidactico
        [HttpPost]
        [Route("CrearMaterialDidactico")]
        public ActionResult<MaterialDidactico> CrearMaterialDidactico(MaterialDidactico materialDidactico)
        {
            try
            {
                _context.MaterialDidactico.Add(materialDidactico);
                _context.SaveChanges();
                var insertado = _context.MaterialDidactico.Find(materialDidactico.IdMaterialDidactico);
                return Ok(insertado);
            }
            catch (Exception ex){ return BadRequest("Error: "+ex.Message); }
        }

        // DELETE: api/EliminarMaterialDidactico/5
        [HttpDelete]
        [Route("EliminarMaterialDidactico/{id}")]
        public ActionResult<string> DeleteMaterialDidactico(int id)
        {
            var materialDidactico = _context.MaterialDidactico.Find(id);
            if (materialDidactico == null)
            {
                return BadRequest("No encontrado");
            }
            _context.MaterialDidactico.Remove(materialDidactico);
            _context.SaveChanges();
            return Ok("Eliminado");
        }
    }
}
