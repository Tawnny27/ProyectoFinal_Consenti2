using kinder_consenti2.Server.Models;
using QuestPDF.Fluent;
using System.IO;
using System.Net.Mail;

namespace kinder_consenti2.Server.Herramientas
{
    public class CorreoEnvio
    {
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

        public void EnviarCorreoPDF(int puerto,
                                    string Origen,
                                    string contraseña,
                                    string destino,
                                    string clientesmtp,
                                    string asunto,
                                    string mensaje,                                   
                                    EncabezadoFactura factura)
        {
            MailMessage mailMessage = new MailMessage(Origen, destino, asunto, "<p>" + mensaje + "</p>");

            FacturaPDF pdf = new();
            var document = pdf.CrearFactura(factura);
            byte[] PdfBytes;
            using (var memoryStream = new MemoryStream())
            {
                document.GeneratePdf(memoryStream);
                PdfBytes = memoryStream.ToArray();
            }

            //-----------------------------------------------------------
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
            //-----------------------------------------------------------


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
