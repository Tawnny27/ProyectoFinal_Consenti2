using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    public class InventarioController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public InventarioController(Concenti2pruebasContext context)
        {
            _context = context;
        }
        [HttpGet]
        [Route("ObtenerInventario")]
        public ActionResult<List<Inventario>> ObtenerInventario()
        {
            return Ok(_context.Inventario.ToList());
        }

        [HttpGet]
        [Route("BuscarInventario/{id}")]
        public ActionResult<Inventario> BuscarInventario(int id)
        {
            return Ok(_context.Inventario.Find(id));
        }

        [HttpPost]
        [Route("CrearInventario")]
        public ActionResult<Inventario> CrearInventario(Inventario inventario)
        {
            inventario.Descripcion=inventario.Descripcion.Trim();
            if(_context.Inventario.Where(x=> x.Descripcion==inventario.Descripcion)!=null)
                return BadRequest("Ya existe un producto con esa descripcion");
            inventario.Cantidad = 0;
            _context.Inventario.Add(inventario);
            _context.SaveChanges();
            var insertado = _context.Inventario.Find(inventario.IdInventario);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarInventario")]
        public ActionResult<Inventario> EditarInventario(Inventario inventario)
        {
            _context.Inventario.Update(inventario);
            _context.SaveChanges();
            return Ok(_context.Alumno.Find(inventario.IdInventario));
        }

        [HttpDelete]
        [Route("EliminarInventario/{id}")]
        public ActionResult<string> EliminarInventario(int id)
        {
            var inventario = _context.Inventario.Find(id);
            _context.Inventario.Remove(inventario);
            _context.SaveChanges();
            return Ok("Inventario eliminado");
        }

    }
}
