namespace kinder_consenti2.Server.Models
{
    public class Gasto
    {
        public int IdGasto { get; set; }
        public DateOnly Fecha { get; set; }
        public int CategoriaId { get; set; }
        public double Monto { get; set; }
        public Categoria? Categoria { get; set; }
    }
}
