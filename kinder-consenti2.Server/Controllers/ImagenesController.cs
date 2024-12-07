using kinder_consenti2.Server.Herramientas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace kinder_consenti2.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImagenesController : ControllerBase
    {
        private readonly SaveImages _saveImage;
        public ImagenesController()
        {
            _saveImage = new SaveImages();
        }
        [HttpPost]
        [Route("GuardarImagen")]
        public async Task<IActionResult> GuardarImagen(IFormFile file, string fileName)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No se ha recibido ningún archivo ");
                }
                SaveImages saveImages = new SaveImages();
                MensajeValidacion mensajeValidacion = saveImages.validarExtencion(1, file.FileName);
                if (mensajeValidacion.Condicion)
                    return Ok(await _saveImage.GuardarImagen(file, 1, fileName + mensajeValidacion.Mensaje));
                else
                    return BadRequest(mensajeValidacion.Mensaje);

            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al guardar la imagen", error = ex.Message });
            }
        }

    }
}