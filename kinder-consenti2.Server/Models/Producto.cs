﻿namespace kinder_consenti2.Server.Models
{
    public class Producto
    {
        public int IdProducto { get; set; }
        public string NombreProducto { get; set; }
        public int Frecuencias { get; set; }  
        public int Monto { get; set; }
        public List<Matricula>? Matriculas { get; set; }
        public List<DetalleFactura>? DetalleFacturas { get; set; }

    }
}
