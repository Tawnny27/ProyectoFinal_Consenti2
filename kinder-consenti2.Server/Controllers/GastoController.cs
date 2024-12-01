using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    public class GastoController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public GastoController(Concenti2pruebasContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("ObtenerGastos")]
        public ActionResult<List<Gasto>> ObtenerGastos(int año, int mes)
        {                      
            DateOnly fechaInicial = new (año,mes,1);
            DateOnly fechaFinal = new (año,mes+1,1);
            fechaFinal = fechaFinal.AddDays(-1);
            var gastos = _context.Gasto.Where(x => x.Fecha >= fechaInicial && x.Fecha <= fechaFinal).ToList();
            if (gastos != null) 
            {
                return Ok(gastos);
            }
            //return Ok(fechaFinal);
            return Ok("No hay gastos registrados");
        }

        [HttpGet]
        [Route("BuscarGastoxFecha/{fecha}")]
        public ActionResult<List<Gasto>> BuscarGastoxFecha(DateOnly fecha)
        {
            var gastos = _context.Gasto.Where(x => x.Fecha == fecha).OrderBy(x=>x.Fecha).ToList();
            if (gastos != null)
            {
                return Ok(gastos);
            }
            return Ok("No hay gastos registrados");
        }

        [HttpPost]
        [Route("CrearGasto")]
        public ActionResult<Gasto> CrearGasto(Gasto gasto)
        {
            _context.Gasto.Add(gasto);
            _context.SaveChanges();
            var insertado = _context.Gasto.Find(gasto.IdGasto);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarGasto")]
        public ActionResult<Gasto> EditarGasto(Gasto gasto)
        {
            _context.Gasto.Update(gasto);
            _context.SaveChanges();
            return Ok(_context.Gasto.Find(gasto.IdGasto));
        }

        [HttpDelete]
        [Route("EliminarGasto/{id}")]
        public ActionResult<string> EliminarGasto(int id)
        {
            var gasto = _context.Gasto.Find(id);
            _context.Gasto.Remove(gasto);
            _context.SaveChanges();
            return Ok("Gasto eliminado");
        }

    }
}
