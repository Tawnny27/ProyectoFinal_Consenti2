namespace kinder_consenti2.Server.Models
{
    public class ListaAsistencia
    {
        public int IdListaAsistencia { get; set; }
        public int GruposId { get; set; }
        public int AlumnoId { get; set; }
        public DateOnly Fecha { get; set; }
        public int StatusAsistencia { get; set; }
        public string? Comentario { get; set; }
        public Alumno? Alumno { get; set; }
        public Grupos? Grupo { get; set; }
    }
}
