namespace kinder_consenti2.Server.Models
{
    public class Inventario
    {
        public int IdInventario { get; set; }
        public string Descripcion { get; set; }
        public int CategoriaId { get; set; }        
        public int Cantidad { get; set; }
        public Categoria? Categoria { get; set; }
        public List<MovimientosInventario>? Movimientos { get; set; }
    }
}
