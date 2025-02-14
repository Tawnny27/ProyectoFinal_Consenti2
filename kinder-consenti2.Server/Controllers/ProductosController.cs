using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("api/")]
    public class ProductosController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public ProductosController(Concenti2pruebasContext context)
        {
            _context = context;
        }


        [HttpGet]
        [Route("ObtenerProductosfijos")]
        public ActionResult<List<Producto>> ObtenerProductosfijos()
        {

            return Ok(_context.Producto.Where(x => x.Frecuencias <= 2).ToList());
        }

        [HttpGet]
        [Route("ObtenerProductosMensuales")]
        public ActionResult<List<Producto>> ObtenerProductosMensuales()
        {

            return Ok(_context.Producto.Where(x => x.Frecuencias == 3).ToList());
        }

        [HttpGet]
        [Route("ObtenerAlimenacion")]
        public ActionResult<Producto> ObtenerAlimenacion()
        {

            return Ok(_context.Producto.Where(x => x.Frecuencias == 2).FirstOrDefault());
        }

    }
}
