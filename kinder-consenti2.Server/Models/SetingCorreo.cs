namespace kinder_consenti2.Server.Models
{
    public class SetingCorreo
    {
        public int IdRegistro { get; set; }
        public string CorreoOrigen { get; set; }
        public string ContrasennaOrigen { get; set; }
        public string smtpClient { get; set; }
        public string asunto { get; set; }
        public string cuerpo { get; set; }

    }
}
