namespace kinder_consenti2.Server.Models
{
    public class ActividadComida
    {
        public int IdActividadComida { get; set; }
        public int AlumnoId { get; set; }
        public int GruposId { get; set; }
        public DateOnly Fecha { get; set; }
        public string TipoComida { get; set; }
        public int StatusComida { get; set; }
        public string? Comentario { get; set; } 
        public Alumno? Alumno { get; set; }
        public Grupos? Grupo { get; set; }
    }
}
