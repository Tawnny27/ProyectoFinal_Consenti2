namespace kinder_consenti2.Server.Models
{
    public class Padre
    {
        public int IdPadre { get; set; }
        public int RolId { get; set; }
        public string NombrePadre { get; set; }
        public string ApellidosPadre { get; set; }
        public string CedulaPadre { get; set; }
        public int TelefonoPadre { get; set; }        
        public string CorreoPadre { get; set; }
        public Rol? Rol { get; set; }
        public List<Alumno>? Hijos { get; set; }
    }
}
