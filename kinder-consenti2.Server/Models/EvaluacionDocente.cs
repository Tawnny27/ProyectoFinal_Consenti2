namespace kinder_consenti2.Server.Models
{
    public class EvaluacionDocente
    {
        public int IdEvaluacionDocente { get; set; }
        public DateOnly Fecha { get; set; }
        public int UsuarioId { get; set; }
        public int Puntos { get; set; }
        public string? Comentarios { get; set; }
        public Usuario? Usuario { get; set; }

    }
}
