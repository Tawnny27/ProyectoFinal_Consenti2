using kinder_consenti2.Server.Herramientas;
using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class EncabezadoFacturaController : ControllerBase
    {

        private readonly Concenti2pruebasContext _context;

        public EncabezadoFacturaController(Concenti2pruebasContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("ObtenerFacturas")]
        public ActionResult<List<EncabezadoFactura>> ObtenerFacturas()
        {

            return Ok(_context.EncabezadoFactura.Include(x => x.DetalleFacturas).ToList());
        }


        [HttpGet]
        [Route("BuscarFactura/{id}")]
        public ActionResult<EncabezadoFactura> BuscarFactura(int id)
        {
            var facturaEncontrada = _context.EncabezadoFactura.Include(x => x.DetalleFacturas).FirstOrDefault(x => x.IdFactura == id);
            if (facturaEncontrada == null)
                return BadRequest("Factura no encontrada");
            return Ok(facturaEncontrada);
        }


        [HttpPost]
        [Route("CrearMatricula")]
        public ActionResult<EncabezadoFactura> CrearMatricula(DatosMatricula Datos)
        {
            
            EncabezadoFactura factura = new EncabezadoFactura
            {
                Cliente = Datos.Ciente,
                Fecha = Datos.Fecha,
                Subtotal = Datos.Subtotal,
                Descuento = Datos.Descuento,
                Iva = Datos.Iva,
                Total = Datos.Total,
                status = 0
            };
            _context.EncabezadoFactura.Add(factura);
            _context.SaveChanges();
            var insertada = _context.EncabezadoFactura.Find(factura.IdFactura);

            if (insertada != null)
            {
                foreach (var item in Datos.Detalles)
                {
                    DetalleFactura detalleFact = new DetalleFactura
                    {
                        EncabezadoFacturaId = insertada.IdFactura,
                        ProductoId = item.ProductoId,
                        AlumnoId = item.AlumnoId,
                        Monto = item.Monto
                    };
                    _context.DetalleFactura.Add(detalleFact);
                    _context.SaveChanges();
                }

                var Mat = Datos.Detalles.Where(x => x.ProductoId > 3);
                foreach (var item in Mat)
                {
                    Matricula Matriculada = new Matricula
                    {
                        Fecha = Datos.Fecha,
                        FechaFin = Datos.Fecha.AddYears(1),
                        ProductoId = item.ProductoId,
                        AlumnoId = item.AlumnoId,
                        Dias = item.Dias,
                        Status = false
                    };
                    _context.Matricula.Add(Matriculada);
                    _context.SaveChanges();
                }
                return Ok("Matricula enviada para validacio del pago");

            }
            
             return BadRequest("Algo salio mal, validar con Amnistarcion");

        }

    }
}
