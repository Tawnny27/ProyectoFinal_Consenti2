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

        //---------------------------------------------------------------------------------------------------------------------------

        [HttpGet]
        [Route("ObtenerFacturas")]
        public ActionResult<List<EncabezadoFactura>> ObtenerFacturas()
        {
            return Ok(_context.EncabezadoFactura.Include(x => x.DetalleFacturas).ToList());
        }
        //---------------------------------------------------------------------------------------------------------------------------


        //------------------------------------------Obtener factura en estatus pendiente---------------------------------------------
        [HttpGet]
        [Route("ObtenerFacturasPendientes")]
        public ActionResult<List<EncabezadoFactura>> ObtenerFacturasPendientes()
        {

            return Ok(_context.EncabezadoFactura.Include(x => x.DetalleFacturas).Where(x=> x.status == 0).ToList());
        }

        //***********************************-Fin de Obtener factura en estatus pendiente********************************************


        //------------------------------------------Pasar factura a estatus finalizado o rechazado-----------------------------------
        [HttpPut]
        [Route("DarAltaFactura/{idfact}&{status}")]

        public ActionResult <string> DarAltaFactura(int idfact, int status) 
        {
            if (status == 1 || status == 2) // 1-finalizada  2-Rechazada
            {
                var factura = _context.EncabezadoFactura.FirstOrDefault(x=> x.IdFactura== idfact);
                if (factura != null)
                { 
                    factura.status = status;
                    _context.EncabezadoFactura.Update(factura);
                    _context.SaveChanges();                    
                    if (status == 1) 
                    {
                        var matricula = _context.Matricula.FirstOrDefault(x => x.IdFact == factura.IdFactura);
                        if (matricula == null)
                            return NotFound("Revisar no se encontraron datos");
                        matricula.Status = true;
                        _context.Matricula.Update(matricula);
                        _context.SaveChanges();
                        return Ok("Factura finalizada");
                    }                        
                    else
                        return Ok("Factura rechazada");                    
                }
                return BadRequest("Algo salió mal revisar los datos enviados");
            } 
            return BadRequest("Algo salió mal revisar los datos enviados");
        }
        //*****************************************Pasar factura a estatus finalizado o rechazado ************************************


        //-----------------------------------------------------------------------------------------------------------------------------

        [HttpGet]
        [Route("BuscarFactura/{id}")]
        public ActionResult<EncabezadoFactura> BuscarFactura(int id)
        {
            var facturaEncontrada = _context.EncabezadoFactura.
                Include(x => x.DetalleFacturas).FirstOrDefault(x => x.IdFactura == id);
            if (facturaEncontrada == null)
                return BadRequest("Factura no encontrada");
            return Ok(facturaEncontrada);
        }
        //---------------------------------------------------------------------------------------------------------------------------



        //-----------------------------------Proceso de Matricula y factiracion de ---------------------------------------------------

        [HttpPost]
        [Route("CrearMatricula")]
        public ActionResult<EncabezadoFactura> CrearMatricula(DatosMatricula Datos)
        {

            int idStatus;
            bool status;
            // se valida el roll de la persona que envia la solicitud
            if (Datos.RollId == 1)   // roll adm para el status finalizado de la factura y la matricula
            {
                idStatus = 1; 
                status = true;
            }
            else // Otros roles para el status pendiente de la factura y la matricula
            { 
                idStatus = 0; 
                status = false;
            }

            // Se setea el obj EncabezadoFactura
            EncabezadoFactura factura = new EncabezadoFactura
            {
                UsuarioId = Datos.ClienteId,
                Fecha = Datos.Fecha,
                MetodoPago = Datos.MetodoPago,
                ImagenPago   = Datos.ImagenPago,
                Referencia = Datos.Referencia,
                Subtotal = Datos.Subtotal,
                Descuento = Datos.Descuento,
                Iva = Datos.Iva,
                Total = Datos.Total,
                status = idStatus
            };
            //Se inserta el EncabezadoFactura
            _context.EncabezadoFactura.Add(factura);
            _context.SaveChanges();
            var insertada = _context.EncabezadoFactura.Find(factura.IdFactura);

            if (insertada != null)
            {
                /* foreach (var item in Datos.Detalles)
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
                */
                //Se insertan los detalles de la factura
                List<DetalleFactura> Detalle = new List<DetalleFactura>();
                foreach (var item in Datos.Detalles)
                {                   
                    DetalleFactura registro = new DetalleFactura
                    {
                        EncabezadoFacturaId = insertada.IdFactura,
                        ProductoId = item.ProductoId,
                        AlumnoId = item.AlumnoId,
                        Monto = item.Monto,
                    };
                    item.EncabezadoFacturaId = insertada.IdFactura;
                    Detalle.Add(registro);
                }                
                _context.DetalleFactura.AddRange(Detalle);
                _context.SaveChanges();

                // Se extraen los horarios 
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
                        Status = status
                    };
                    _context.Matricula.Add(Matriculada);
                    _context.SaveChanges(); 
                }
                return Ok("Matricula enviada para validacio del pago");
            }            
             return BadRequest("Algo salio mal, validar con Amnistarcion");
        }

        //********************************Fin de Proceso de Matricula y factiracion de **************************************

    }
}
