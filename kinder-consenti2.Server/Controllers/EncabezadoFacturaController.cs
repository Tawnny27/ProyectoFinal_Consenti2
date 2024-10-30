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

            return Ok(_context.EncabezadoFactura.Include(x => x.Detalles).ToList());
        }


        [HttpGet]
        [Route("BuscarFactura/{id}")]
        public ActionResult<EncabezadoFactura> BuscarFactura(int id)
        {
            var facturaEncontrada = _context.EncabezadoFactura.Include(x => x.Detalles).FirstOrDefault(x => x.IdFactura == id);
            if (facturaEncontrada == null)
                return BadRequest("Factura no encontrada");
            return Ok(facturaEncontrada);
        }


        [HttpPost]
        [Route("CrearMatricula")]
        public ActionResult<EncabezadoFactura> CrearMatricula(EncabezadoFactura factura)
        {
            if (factura.AlumnoId != null && factura.Detalles != null && factura.Dias!= null)
            {
                var alumno = _context.Alumno.Find(factura.AlumnoId);

                if (alumno != null)
                {

                    _context.EncabezadoFactura.Add(factura);
                    _context.SaveChanges();
                    var insertada = _context.EncabezadoFactura.Find(factura.IdFactura);
                    foreach (var item in insertada.Detalles)
                    {
                        item.EncabezadoId = factura.IdFactura;
                        _context.DetalleFactura.Add(item);
                        _context.SaveChanges();
                    }
                    var insertadaCondetalle = _context.EncabezadoFactura.Include(x => x.Detalles).FirstOrDefault(x => x.IdFactura == insertada.IdFactura);
                    var Detalle = _context.DetalleFactura.Where(x=> x.EncabezadoId == insertadaCondetalle.IdFactura && x.ProductoId > 3).FirstOrDefault();

                    Matricula Matriculada = new Matricula();
                    Matriculada.ProductoId = Detalle.ProductoId;
                    Matriculada.AlumnoId = alumno.IdAlumno;
                    Matriculada.Fecha = factura.Fecha;
                    Matriculada.FechaFin = factura.Fecha.AddYears(1);                    
                    Matriculada.Monto = Detalle.Monto;
                    Matriculada.Dias = factura.Dias;
                    if (Matriculada.Monto != _context.Producto.Find(1).Monto)
                        Matriculada.Status = false;
                    else
                        Matriculada.Status = true;          

                    _context.Matricula.Add(Matriculada);
                    
                    return Ok(insertadaCondetalle);

                }
            }
            return BadRequest("Faltan los detalles de la factura");

        }

    }
}
