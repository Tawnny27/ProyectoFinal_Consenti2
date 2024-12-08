namespace kinder_consenti2.Server.Models
{
    public class EvaluacionKinder
    {
        public int IdEvaluacionKinder { get; set; }
        public DateOnly Fecha { get; set; }
        public int PuntosIntalacion { get; set; }
        public int PuntosPersonlAdm { get; set; }
        public int PuntosEnsenaza { get; set; }
        public string? Sugerencias { get; set; }
    }
}
