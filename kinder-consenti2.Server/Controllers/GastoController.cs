using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class GastoController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public GastoController(Concenti2pruebasContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("ObtenerGasto/{anno}&{mes}")]
        public async Task <ActionResult<List<Gasto>>> ObtenerGastos(int anno, int mes)
        {
            if (anno == 0 || mes == 0|| mes>12)
            {
                return BadRequest("Debe indicar año y mes correcto");
            }
            DateOnly fechaInicial = new (anno,mes,1);
            if (mes == 12)
            { mes = 0; anno += 1; }
            DateOnly fechaFinal = new (anno, mes+1,1);
            fechaFinal =  fechaFinal.AddDays(-1);
            var gastos =await _context.Gasto.Where(x => x.Fecha >= fechaInicial && x.Fecha <= fechaFinal).ToListAsync();
            if (gastos.Count() != 0) 
            {
                return Ok(gastos);
            }
            //return Ok(fechaFinal);
            return NotFound("No hay gastos registrados");
        }

        [HttpGet]
        [Route("BuscarGastoxFecha/{fecha}")]
        public async Task <ActionResult<List<Gasto>>> BuscarGastoxFecha(DateOnly fecha)
        {
            var gastos = await _context.Gasto.Where(x => x.Fecha == fecha).OrderBy(x=>x.Fecha).ToListAsync();
            if (gastos != null)
            {
                return Ok(gastos);
            }
            return Ok("No hay gastos registrados");
        }

        [HttpPost]
        [Route("CrearGasto")]
        public async Task<ActionResult<Gasto>> CrearGasto(Gasto gasto)
        {
            await _context.Gasto.AddAsync(gasto);
            await _context.SaveChangesAsync();
            var insertado = await _context.Gasto.FindAsync(gasto.IdGasto);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarGasto")]
        public async Task <ActionResult<Gasto>> EditarGasto(Gasto gasto)
        {
            _context.Gasto.Update(gasto);
            await _context.SaveChangesAsync();
            return Ok(await _context.Gasto.FindAsync(gasto.IdGasto));
        }

        [HttpDelete]
        [Route("EliminarGasto/{id}")]
        public async Task <ActionResult<string>> EliminarGasto(int id)
        {
            var gasto = await _context.Gasto.FindAsync(id);
            if (gasto == null)
                return NotFound("No se encontraron datos");
            _context.Gasto.Remove(gasto);
            await _context.SaveChangesAsync();
            return Ok("Gasto eliminado");
        }

    }
}
