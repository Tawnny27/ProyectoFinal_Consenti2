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
        // Modificamos la ruta para apuntar a la carpeta assets del cliente
        private readonly string _imagesFolderPath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "..", // Subir un nivel desde la carpeta actual
            "kinder-consenti2.client", // Entrar a la carpeta del cliente
            "public",
            "Fotos" // Subcarpeta para las fotos dentro de assets
        );

        public ImagenesController()
        {
            // Asegurarse de que la carpeta de imágenes exista
            if (!Directory.Exists(_imagesFolderPath))
            {
                Directory.CreateDirectory(_imagesFolderPath);
            }
        }

        [HttpPost]
        [Route("GuardarImagen")]
        public async Task<IActionResult> GuardarImagen(IFormFile file, [FromForm] string fileName)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se ha recibido ningún archivo.");
            }

            try
            {
                // Usa `fileName` en lugar de `file.FileName` para crear la ruta
                var filePath = Path.Combine(_imagesFolderPath, fileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                var imageUrl = $"/Fotos/{fileName}";  //esto ahorita no se esta utilizando
                return Ok(new { filePath = imageUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al guardar la imagen", error = ex.Message });
            }
        }

    }
}