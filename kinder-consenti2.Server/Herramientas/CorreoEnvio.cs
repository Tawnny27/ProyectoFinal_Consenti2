using System.Net.Mail;

namespace kinder_consenti2.Server.Herramientas
{
    public class CorreoEnvio
    {
        public void EnviarCorreo( int puerto, string Origen, string contraseña,string destino, string clientesmtp, string asunto, string mensaje, string contemp ) 
        {
            MailMessage mailMessage = new MailMessage(Origen, destino, asunto, "<p>"+mensaje+"</p>"+ "<p> Contreseña temporal:" + contemp + "</p>");
            mailMessage.IsBodyHtml = true;
            SmtpClient smtpClient = new SmtpClient(clientesmtp);
            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;
            smtpClient.Port = puerto;
            smtpClient.Credentials = new System.Net.NetworkCredential(Origen,contraseña);
            smtpClient.Send(mailMessage);
            smtpClient.Dispose();

        }
    }
}
