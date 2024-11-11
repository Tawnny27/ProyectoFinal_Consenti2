namespace kinder_consenti2.Server.Models
{
    public class DetalleFactura
    {
        public int IdDetalleFactura { get; set; }
        public int EncabezadoFacturaId { get; set; }   
        public int ProductoId { get; set; }
        public int AlumnoId {  get; set; }
        public int Monto { get; set; }
        public Alumno? Alumno {  get; set; }
        public EncabezadoFactura? EncabezadoFactura {  get; set; }
        public Producto? Producto { get; set; }

    }
}
