using kinder_consenti2.Server.Models;
using Microsoft.EntityFrameworkCore;
using QuestPDF.Fluent;
using System.IO;
using System.Net.Mail;

namespace kinder_consenti2.Server.Herramientas
{
    public class CorreoEnvio
    {

        private readonly Concenti2pruebasContext _context;
      

        public CorreoEnvio(Concenti2pruebasContext context)           
        {
            _context = context;
        }

        public void EnviarCorreo( int puerto, string Origen, string contraseña,string destino, string clientesmtp, string asunto, string mensaje, string contemp ) 
        {
            MailMessage mailMessage = new MailMessage(Origen, destino, asunto, "<p>"+mensaje+"</p>"+ "<p> Contreseña temporal: " + contemp + "</p>");
            mailMessage.IsBodyHtml = true;
            SmtpClient smtpClient = new SmtpClient(clientesmtp);
            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Port = puerto;
            smtpClient.Credentials = new System.Net.NetworkCredential(Origen,contraseña);
            smtpClient.Send(mailMessage);
            smtpClient.Dispose();

        }
        public void EnviarCorreoPDF(int puerto, string Origen, string contraseña, string clientesmtp, int idFactura)
        {

            var factura = _context.EncabezadoFactura.Include(x => x.DetalleFacturas).ThenInclude(df => df.Producto)
                        .Include(x => x.DetalleFacturas).ThenInclude(df => df.Alumno)
                        .Include(x => x.Usuario).FirstOrDefault(x => x.IdFactura == idFactura);
            //-------------------------------------------------------
            string numFactura = factura.IdFactura.ToString();
            string numFinal = "0";
            if (numFactura.Length > 10)
                numFinal = numFactura;
            else
            {
                for (int i = 0; i < (10 - numFactura.Length); i++)
                    numFinal = numFinal + "0";
                numFinal = numFinal + numFactura;
            }
            string asunto ="Comprobante de pago Factura #" + numFinal;
            string mensaje = "Adjunto encontrara su factura referente al pago del " + factura.Fecha;
            string destino = factura.Usuario.CorreoUsuario;

            //------------------------------------------------------------

            MailMessage mailMessage = new MailMessage(Origen, destino, asunto, "<p>" + mensaje + "</p>");

            FacturaPDF pdf = new();
            var document = pdf.CrearFactura(factura);
            byte[] PdfBytes;
            using (var memoryStream = new MemoryStream())
            {
                document.GeneratePdf(memoryStream);
                PdfBytes = memoryStream.ToArray();
            }

            // Adjuntar el PDF al mensaje
            var attachment = new Attachment(new MemoryStream(PdfBytes), "Factura_"+ numFinal + ".pdf", "application/pdf");  
            mailMessage.Attachments.Add(attachment);
            mailMessage.IsBodyHtml = true;
            SmtpClient smtpClient = new SmtpClient(clientesmtp);
            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Port = puerto;
            smtpClient.Credentials = new System.Net.NetworkCredential(Origen, contraseña);
            smtpClient.Send(mailMessage);
            smtpClient.Dispose();
        }
    }
}
