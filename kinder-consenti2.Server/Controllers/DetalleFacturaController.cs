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
        public ActionResult<EncabezadoFactura> BuscarFactura(int idEncabezado)
        {
            var DetallesEncontrados = _context.DetalleFactura.FirstOrDefault(x => x.EncabezadoId == idEncabezado);
            if (DetallesEncontrados == null)
                return BadRequest("Factura no encontrada");
            return Ok(DetallesEncontrados);
        }


        [HttpPost]
        [Route("CrearDetallesFactura")]
        public ActionResult<EncabezadoFactura> CrearFactura(EncabezadoFactura factura)
        {
            _context.EncabezadoFactura.Add(factura);
            _context.SaveChanges();
            var insertada = _context.EncabezadoFactura.Find(factura.IdFactura);
            return Ok(insertada);

        }

    }
}
