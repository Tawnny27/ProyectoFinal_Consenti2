using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{


    [ApiController]
    [Route("[controller]")]
    public class DetalleFacturaController : ControllerBase
    {

        private readonly Concenti2pruebasContext _context;

        public DetalleFacturaController(Concenti2pruebasContext context)
        {
            _context = context;
        }               

        [HttpGet]
        [Route("BuscarDeallesFactura/{idEncabezado}")]
        public async Task<ActionResult<List<DetalleFactura>>> BuscarFactura(int idEncabezado)
        {
            var DetallesEncontrados = await _context.DetalleFactura.Where(x => x.EncabezadoFacturaId == idEncabezado).ToListAsync();
            if (DetallesEncontrados.Count==0)
                return NotFound("Factura no encontrada");
            return Ok(DetallesEncontrados);
        }


        [HttpPost]
        [Route("CrearDetallesFactura")]
        public async Task<ActionResult<EncabezadoFactura>> CrearFactura(EncabezadoFactura factura)
        {
            _context.EncabezadoFactura.Add(factura);
            await _context.SaveChangesAsync();
            var insertada = await _context.EncabezadoFactura.FindAsync(factura.IdFactura);
            return Ok(insertada);

        }

    }
}
