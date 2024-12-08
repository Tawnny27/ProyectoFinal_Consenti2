namespace kinder_consenti2.Server.Models
{
    public class FotoAlumno
    {
        public int IdFotoAlumno { get; set; }
        public int AlumnoId { get; set; }
        public DateOnly Fecha { get; set; }
        public  string RutaFoto { get; set; }
        public Alumno? Alumno { get; set; }
    }
}
