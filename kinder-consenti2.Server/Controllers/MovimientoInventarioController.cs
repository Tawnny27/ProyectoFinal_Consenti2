using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    public class MovimientoInventarioController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public MovimientoInventarioController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ObtenerMovimientos")]
        public ActionResult<List<MovimientosInventario>> ObtenerMovimientos()
        {
            return Ok(_context.MovimientosInventario.ToList());
        }

        [HttpGet]
        [Route("BuscarMovimiento/{id}")]
        public ActionResult<MovimientosInventario> BuscarMovimiento(int id)
        {
            return Ok(_context.MovimientosInventario.Find(id));
        }

        [HttpPost]
        [Route("CrearMovimiento")]
        public ActionResult<MovimientosInventario> CrearMovimiento(MovimientosInventario movimientosInventario)
        {
            if (!ModelState.IsValid)
                return BadRequest("Falta algún dato");
            _context.MovimientosInventario.Add(movimientosInventario);
            _context.SaveChanges();
            var insertado = _context.MovimientosInventario
                .Find(movimientosInventario.IdMovimientosInventario);
            var producto = _context.Inventario
                .Find(insertado.InventarioId);
            if (insertado.Movimiento)
                producto.Cantidad += insertado.Cantidad;
            else
                producto.Cantidad -= insertado.Cantidad;
            _context.Inventario.Update(producto);
            _context.SaveChanges();
            return Ok(insertado);
        }

        
        [HttpPut]
        [Route("EditarMovimiento")]
        public ActionResult<MovimientosInventario> EditarMovimiento(MovimientosInventario movimientosInventario)
        {
            var movimiento = _context.MovimientosInventario
                .Find(movimientosInventario.IdMovimientosInventario);
            if (movimiento.Cantidad != movimientosInventario.Cantidad)
                return BadRequest("No se pude cambiar la cantidad");
            _context.MovimientosInventario.Update(movimientosInventario);
            _context.SaveChanges();
            return Ok(_context.MovimientosInventario.Find(movimientosInventario.IdMovimientosInventario));
        }
        

        
        [HttpDelete]
        [Route("EliminarMovimiento/{id}")]
        public ActionResult<string> EliminarMovimiento(int id)
        {
            var movimientosInventario = _context.MovimientosInventario.Find(id);
            _context.MovimientosInventario.Remove(movimientosInventario);
            _context.SaveChanges();
            return Ok("Movimiento eliminado");
        }
        
    }
}
