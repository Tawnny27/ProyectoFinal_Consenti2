namespace kinder_consenti2.Server.Models
{
    public class EncabezadoFactura
    {
        public int IdFactura {  get; set; }
        public int UsuarioId { get; set; }
        public  DateTime Fecha { get; set; }
        public string MetodoPago { get; set; }
        public string? ImagenPago { get; set; }
        public int Referencia { get; set; }
        public double Subtotal { get; set; }
        public double Descuento { get; set; }
        public double Iva { get; set; }
        public double Total { get; set; }    
        public int status { get; set; }
        public Usuario? Usuario { get; set; }
        public List<DetalleFactura>? DetalleFacturas { get; set; }        

    }
}
