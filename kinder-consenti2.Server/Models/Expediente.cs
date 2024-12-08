namespace kinder_consenti2.Server.Models
{
    public class Expediente
    {
        public int IdExpediente { get; set; }
        public int AlumnoId { get; set; }
        public DateOnly Fecha { get; set; }
        public string Suceso { get; set; }
        public Alumno? Alumno { get; set; }

    }
}
