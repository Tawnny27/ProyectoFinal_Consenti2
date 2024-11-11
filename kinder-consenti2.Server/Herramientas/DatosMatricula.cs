namespace kinder_consenti2.Server.Herramientas
{
    public class DatosMatricula
    {
        public string Ciente {get;set;}
        public DateTime Fecha {get;set;}
        public double Subtotal { get; set; }
        public double Descuento { get; set; }
        public double Iva { get; set; }
        public double Total { get; set; }
        public List<DetalleDatosMatricula> Detalles { get; set; }

    }
}
