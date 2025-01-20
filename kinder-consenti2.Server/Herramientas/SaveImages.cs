using Microsoft.AspNetCore.Mvc;

namespace kinder_consenti2.Server.Herramientas
{
    public class SaveImages
    {

        // Modificamos la ruta para apuntar a la carpeta assets del cliente
        private readonly string _FolderPerfAlumno = Path.Combine(
            Directory.GetCurrentDirectory(), "..", // Subir un nivel desde la carpeta actual - raiz del proyecto
            "kinder-consenti2.client", "public", "FotosPerfAlumno" // directori final donde s elamacenará
        );

        private readonly string _FolderPago = Path.Combine(
            Directory.GetCurrentDirectory(), "..", "kinder-consenti2.client",
            "public", "FotosPagos"
        );
        private readonly string _FolderAlumnos = Path.Combine(
           Directory.GetCurrentDirectory(), "..", "kinder-consenti2.client",
           "public", "FotosAlumnos"
       );
        private readonly string _FolderMaterial = Path.Combine(
          Directory.GetCurrentDirectory(), "..", "kinder-consenti2.client",
          "public", "FotosMaterial"
      );
        private readonly string _FolderEvento = Path.Combine(
          Directory.GetCurrentDirectory(), "..", "kinder-consenti2.client",
          "public", "FotosEventos"
      );

        private void ValidarFolder(int num)
        {
            // Asegurarse de que la carpeta de imágenes exista
            switch (num)
            {
                case 1:
                    if (!Directory.Exists(_FolderPerfAlumno))
                        Directory.CreateDirectory(_FolderPerfAlumno);
                    break;
                case 2:
                    if (!Directory.Exists(_FolderPago))
                        Directory.CreateDirectory(_FolderPago);
                    break;
                case 3:
                    if (!Directory.Exists(_FolderAlumnos))
                        Directory.CreateDirectory(_FolderAlumnos);
                    break;
                case 4:
                    if (!Directory.Exists(_FolderMaterial))
                        Directory.CreateDirectory(_FolderMaterial);
                    break;
                case 5:
                    if (!Directory.Exists(_FolderEvento))
                        Directory.CreateDirectory(_FolderEvento);
                    break;
            }
        }

        

        private string extencion(string nombre)
        {
            List<string> estenciones = [".png", ".PNG", ".jpg", ".JPG", ".jpeg", ".JPEG", ".pdf", ".PDF"];
            foreach (var item in estenciones)
            {
                if (nombre.Contains(item))
                    return item;
            }
            return ".txt";
        }

        public MensajeValidacion validarExtencion(int num, string ext)
        {
            switch (num)
            {
                case 1:
                    if (ext.Contains(".png") || ext.Contains(".PNG") ||
                        ext.Contains(".jpg") || ext.Contains(".jpeg") ||
                        ext.Contains(".JPG") || ext.Contains(".JPEG"))
                        return new MensajeValidacion { Condicion = true, Mensaje = extencion(ext) };
                    else
                        return new MensajeValidacion { Condicion = false, Mensaje = "Error en tipo de archivo" + "\nPermitidos: jpg, png" };
                case 2:
                    if (ext.Contains(".png") || ext.Contains(".PNG") ||
                        ext.Contains(".jpg") || ext.Contains(".jpeg") ||
                        ext.Contains(".JPG") || ext.Contains(".JPEG") ||
                        ext.Contains(".pdf") || ext.Contains(".PDF"))
                        return new MensajeValidacion { Condicion = true, Mensaje = extencion(ext) };
                    else
                        return new MensajeValidacion { Condicion = false, Mensaje = "Error en tipo de archivo" + "\nPermitidos: pdf, jpg, png" };
                case 3:
                    if (ext.Contains(".png") || ext.Contains(".PNG") ||
                        ext.Contains(".jpg") || ext.Contains(".jpeg") ||
                        ext.Contains(".JPG") || ext.Contains(".JPEG"))
                        return new MensajeValidacion { Condicion = true, Mensaje = extencion(ext) };
                    else
                        return new MensajeValidacion { Condicion = false, Mensaje = "Error en tipo de archivo" + "\nPermitidos: jpg, png" };
                case 4:
                    if (ext.Contains(".pdf") || ext.Contains(".PDF"))
                        return new MensajeValidacion { Condicion = true, Mensaje = extencion(ext) };
                    else
                        return new MensajeValidacion { Condicion = false, Mensaje = "Error en tipo de archivo" + "\nPermitidos: pdf" };
                case 5:
                    if (ext.Contains(".png") || ext.Contains(".PNG") ||
                        ext.Contains(".jpg") || ext.Contains(".jpeg") ||
                        ext.Contains(".JPG") || ext.Contains(".JPEG"))
                        return new MensajeValidacion { Condicion = true, Mensaje = extencion(ext) };
                    else
                        return new MensajeValidacion { Condicion = false, Mensaje = "Error en tipo de archivo" + "\nPermitidos: pjpg, png" };
                default: return new MensajeValidacion { Condicion = false, Mensaje = " Algún dato esta erroneo" };
            }
        }

        public async Task<string> GuardarImagen(IFormFile file, int num, string Name) // num 1-Perfil Alumno, 2-Pagos, 3-Fotos alumnos varias
        {
            try
            {
                if (file == null || file.Length == 0)
                    return ("No se ha recibido ningún archivo ");
                ValidarFolder(num);
                var filePath = Path.Combine();
                string ruta = "";
                switch (num) 
                { 
                    case 1:
                        filePath = Path.Combine(_FolderPerfAlumno, Name);
                        ruta = "/FotosPerfAlumno/" + Name;
                        break;
                    case 2:
                        filePath = Path.Combine(_FolderPago, Name);
                        ruta = "/FotosPagos/" + Name;
                        break;
                    case 3:
                        filePath = Path.Combine(_FolderAlumnos, Name);
                        ruta = "/FotosAlumnos/" + Name;
                        break;
                    case 4:
                        filePath = Path.Combine(_FolderMaterial, Name);
                        ruta = "/FotosMaterial/" + Name;
                        break;
                    case 5:
                        filePath = Path.Combine(_FolderEvento, Name);
                        ruta = "/FotosEventos/" + Name;
                        break;
                }               
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                return (ruta);                        

            }
            catch (Exception ex)
            {
                return ("Error al guardar la imagen error = " + ex.Message);
            }
        }
    }
}
