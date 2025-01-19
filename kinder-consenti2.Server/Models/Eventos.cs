namespace kinder_consenti2.Server.Models
{
    public class Eventos
    {
        public int IdEventos { get; set; }
        public string NombreEvento { get; set; }
        public string DescripcionEvento { get; set; }
        public string FotoEvento { get; set; } = "No image";
        public DateOnly Fecha { get; set; }
    }
    
}
