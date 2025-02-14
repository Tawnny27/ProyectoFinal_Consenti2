using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace kinder_consenti2.Server.Controllers
{


    [ApiController]
    [Route("api/")]
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
            if (DetallesEncontrados.Count == 0)
                return NotFound("Factura no encontrada");
            return Ok(DetallesEncontrados);
        }


        [HttpGet]
        [Route("DetallesApagar/{idUsuario}")]
        public async Task<ActionResult<List<DetalleFactura>>> DetallesApagar(int idUsuario)
        {
            var alumnos = await _context.Alumno.Where(x => x.PadreId == idUsuario).ToListAsync();
            if (alumnos.Count() == 0)
                return NotFound("No hay hijos asociados");
            else
            {
                List<Matricula> matriculas = new List<Matricula>();
                foreach (var item in alumnos)
                {
                    var encontrado = await _context.Matricula.
                        Where(x => x.AlumnoId == item.IdAlumno && x.Status == true).FirstOrDefaultAsync();
                    if(encontrado!=null)
                        matriculas.Add(encontrado);
                }
                if (matriculas.Any())
                {
                    List<DetalleFactura> detalles = new List<DetalleFactura>();
                    var alimentacion = await _context.Producto.Where(x => x.Frecuencias == 2).FirstOrDefaultAsync();
                    foreach (var item in matriculas)
                    {
                        detalles.Add(new DetalleFactura
                        {
                            ProductoId = alimentacion.IdProducto,
                            AlumnoId = item.AlumnoId,
                            Monto = alimentacion.Monto,
                            Producto = _context.Producto.Find(alimentacion.IdProducto),
                            Alumno =_context.Alumno.Find(item.AlumnoId)
                        });
                        detalles.Add(new DetalleFactura
                        {
                            ProductoId = item.ProductoId,
                            AlumnoId = item.AlumnoId,
                            Monto =  _context.Producto.Where(x => x.IdProducto == item.ProductoId).FirstOrDefault().Monto,
                            Producto = _context.Producto.Find(item.ProductoId),
                            Alumno = _context.Alumno.Find(item.AlumnoId)
                        });
                    }
                    return Ok(detalles);
                }
                return NotFound("No hay Matriculas Activas");
            }  
            
        }
        /*
        [HttpPost]
        [Route("CrearDetallesFactura")]
        public async Task<ActionResult<EncabezadoFactura>> CrearFactura(EncabezadoFactura factura)
        {
            _context.EncabezadoFactura.Add(factura);
            await _context.SaveChangesAsync();
            var insertada = await _context.EncabezadoFactura.FindAsync(factura.IdFactura);
            return Ok(insertada);
        }
        */

    }
}
