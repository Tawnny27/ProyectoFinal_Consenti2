namespace kinder_consenti2.Server.Herramientas
{
    public class DatosMatricula
    {
        public int ClienteId {get;set;}
        public DateTime Fecha {get;set;}
        public string MetodoPago { get; set; }
        public string ImagenPago {get;set;}
        public int Referencia { get; set; }
        public double Subtotal { get; set; }
        public double Descuento { get; set; }
        public double Iva { get; set; }
        public double Total { get; set; }
        public List<DetalleDatosMatricula> Detalles { get; set; }

    }
}
