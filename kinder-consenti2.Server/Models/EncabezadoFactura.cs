namespace kinder_consenti2.Server.Models
{
    public class EncabezadoFactura
    {
        public int IdFactura {  get; set; }
        public string Cliente { get; set; } = "No indica";
        public  DateTime Fecha { get; set; }
        public double Subtotal { get; set; }
        public double Iva { get; set; }
        public double Total { get; set; }
        public int? AlumnoId { get; set; }
        public string? Dias {  get; set; }
        public List<DetalleFactura>? Detalles { get; set; }

    }
}
