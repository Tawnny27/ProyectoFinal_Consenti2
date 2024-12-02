namespace kinder_consenti2.Server.Models
{
    public class MovimientosInventario
    {
        public int IdMovimientosInventario { get; set; }
        public DateOnly Fecha { get; set; }
        public int InventarioId { get; set; }
        public int Cantidad { get; set; }       
        public string Responsable { get; set; }       
        public bool Movimiento { get; set; } //true-ingreso, false-salida
        public Inventario? Inventario { get; set; }

    }
}
