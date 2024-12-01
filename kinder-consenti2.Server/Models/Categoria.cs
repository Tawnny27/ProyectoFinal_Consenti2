namespace kinder_consenti2.Server.Models
{
    public class Categoria
    {
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; }
        public List<Inventario>? Inventarios { get; set; }
        public List<Gasto>? Gastos { get; set; }
    }
}
