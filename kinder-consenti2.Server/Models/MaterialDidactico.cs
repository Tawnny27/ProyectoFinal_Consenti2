namespace kinder_consenti2.Server.Models
{
    public class MaterialDidactico
    {
        public int IdMaterialDidactico { get; set; }
        public DateOnly Fecha {  get; set; }    
        public string NombreArchivo { get; set; }
        public int GruposId {  get; set; }
        public string RutaFoto { get; set; }
        public bool StatusAct {  get; set; }  = true;
        public Grupos? Grupos { get; set; }
    }
}
