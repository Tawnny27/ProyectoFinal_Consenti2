using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class MovimientoInventarioController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public MovimientoInventarioController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ObtenerMovimientos")]
        public async Task<ActionResult<List<MovimientosInventario>>> ObtenerMovimientos()
        {
            return Ok(await _context.MovimientosInventario.ToListAsync());
        }

        [HttpGet]
        [Route("BuscarMovimiento/{id}")]
        public async Task<ActionResult<MovimientosInventario>> BuscarMovimiento(int id)
        {
            return Ok(await _context.MovimientosInventario.FindAsync(id));
        }

        [HttpPost]
        [Route("CrearMovimiento")]
        public async Task<ActionResult<MovimientosInventario>> CrearMovimiento(MovimientosInventario movimientosInventario)
        {
            await _context.MovimientosInventario.AddAsync(movimientosInventario);
            await _context.SaveChangesAsync();
            var insertado = await _context.MovimientosInventario
                .FindAsync(movimientosInventario.IdMovimientosInventario);
            var producto = await _context.Inventario
                .FindAsync(insertado.InventarioId);
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
        public async  Task<ActionResult<MovimientosInventario>> EditarMovimiento(MovimientosInventario movimientosInventario)
        {
            var movimiento = await _context.MovimientosInventario
                .FindAsync(movimientosInventario.IdMovimientosInventario);
            if (movimiento.Cantidad != movimientosInventario.Cantidad)
                return BadRequest("No se pude cambiar la cantidad");
            _context.MovimientosInventario.Update(movimientosInventario);
            await _context.SaveChangesAsync();
            return Ok(await _context.MovimientosInventario.FindAsync(movimientosInventario.IdMovimientosInventario));
        }
        

        
        [HttpDelete]
        [Route("EliminarMovimiento/{id}")]
        public async Task<ActionResult<string>> EliminarMovimiento(int id)
        {
            var movimientosInventario = await _context.MovimientosInventario.FindAsync(id);
            _context.MovimientosInventario.Remove(movimientosInventario);
            await _context.SaveChangesAsync();
            return Ok("Movimiento eliminado");
        }
        
    }
}
