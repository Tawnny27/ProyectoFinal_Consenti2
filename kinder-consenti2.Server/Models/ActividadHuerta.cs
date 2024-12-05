namespace kinder_consenti2.Server.Models
{
    public class ActividadHuerta
    {
        public int IdActividadHuerta { get; set; }
        public int AlumnoId { get; set; }
        public int GruposId { get; set; }
        public DateOnly Fecha { get; set; }
        public string Descripcion { get; set; }
        public int StatusParticipacion { get; set; }
        public string? Comentario { get; set; }
        public Alumno? Alumno { get; set; }
        public Grupos? Grupo { get; set; }
    }
}
