namespace kinder_consenti2.Server.Models
{
    public class ActividadDormir
    {
        public int IdActividadDormir { get; set; }
        public int AlumnoId { get; set; }
        public int GruposId { get; set; }
        public DateOnly Fecha { get; set; }
        public TimeOnly Tiempo { get; set; }
        public string? Comentario { get; set; }
        public Alumno? Alumno { get; set; }
        public Grupos? Grupo { get; set; }
    }
}
