using kinder_consenti2.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Controllers
{
    public class CategoriaController : ControllerBase
    {
        private readonly Concenti2pruebasContext _context;

        public CategoriaController(Concenti2pruebasContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("ObtenerCategorias")]
        public ActionResult<List<Categoria>> ObtenerCategorias()
        {
            return Ok(_context.Categoria.ToList());
        }

        [HttpGet]
        [Route("BuscarCategorias/{id}")]
        public ActionResult<Categoria> BuscarCategorias(int id)
        {
            var categoria = _context.Categoria.Find(id);
            if (categoria == null)
                return BadRequest("No encontrado");
            return Ok(categoria);
        }

        [HttpPost]
        [Route("CrearCategoria")]
        public ActionResult<Categoria> CrearCategoria(Categoria categoria)
        {
            _context.Categoria.Add(categoria);
            _context.SaveChanges();
            var insertado = _context.Categoria.Find(categoria.IdCategoria);
            return Ok(insertado);
        }

        [HttpPut]
        [Route("EditarCategoria")]
        public ActionResult<Categoria> EditarCategoria(Categoria categoria)
        {
            _context.Categoria.Update(categoria);
            _context.SaveChanges();
            return Ok(_context.Categoria.Find(categoria.IdCategoria));
        }

        [HttpDelete]
        [Route("EliminarCategoria/{id}")]
        public ActionResult<string> EliminarCategoria(int id)
        {
            var categoria = _context.Categoria.Find(id);
            _context.Categoria.Remove(categoria);
            _context.SaveChanges();
            return Ok("Categoria eliminada");
        }


    }

}
