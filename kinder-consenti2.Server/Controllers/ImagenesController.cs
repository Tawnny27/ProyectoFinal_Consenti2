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


        //---------------------Guardar las imagenes  el perfil del niño--------------------------------------
        [HttpPost]
        [Route("GuardarImagenPerfilAluno")]
        public async Task<IActionResult> GuardarImagenPerfilAluno(IFormFile file, [FromForm] string fileName)
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
                    return Ok(await _saveImage.GuardarImagen(file, 1, fileName));
                else
                    return BadRequest(mensajeValidacion.Mensaje);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al guardar la imagen", error = ex.Message });
            }
        }

        //---------------------Guardar las imagenes o Pdf de pago--------------------------------------
        [HttpPost]
        [Route("GuardarImagenPago")]
        public async Task<IActionResult> GuardarImagenPago(IFormFile file, [FromForm] string fileName)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No se ha recibido ningún archivo ");
                }
                SaveImages saveImages = new SaveImages();
                MensajeValidacion mensajeValidacion = saveImages.validarExtencion(2, file.FileName);
                if (mensajeValidacion.Condicion)
                    return Ok(await _saveImage.GuardarImagen(file, 2, fileName));
                else
                    return BadRequest(mensajeValidacion.Mensaje);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al guardar la imagen", error = ex.Message });
            }

        }

        //---------------------Guardar las imagenes o Pdf de pago--------------------------------------
        [HttpPost]
        [Route("GuardarFotosNino")]
        public async Task<IActionResult> GuardarFotosNiño(IFormFile file, [FromForm] string fileName)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No se ha recibido ningún archivo ");
                }
                SaveImages saveImages = new SaveImages();
                MensajeValidacion mensajeValidacion = saveImages.validarExtencion(3, file.FileName);
                if (mensajeValidacion.Condicion)
                    return Ok(await _saveImage.GuardarImagen(file, 3, fileName));
                else
                    return BadRequest(mensajeValidacion.Mensaje);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error al guardar la imagen", error = ex.Message });
            }
        }

        //---------------------Guardar los Pdf de material de Apoyo--------------------------------------
        [HttpPost]
        [Route("GuardarMaterialDidacticoPdf")]
        public async Task<IActionResult> GuardarMaterialDidacticoPdf(IFormFile file, [FromForm] string fileName)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return BadRequest("No se ha recibido ningún archivo ");
                }
                SaveImages saveImages = new SaveImages();
                MensajeValidacion mensajeValidacion = saveImages.validarExtencion(4, file.FileName);
                if (mensajeValidacion.Condicion)
                    return Ok(await _saveImage.GuardarImagen(file, 4, fileName));
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