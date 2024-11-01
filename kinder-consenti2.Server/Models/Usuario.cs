namespace kinder_consenti2.Server.Models
{
    public class Usuario
    {
        public int IdUsuario { get; set; }
        public int RolId { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidosUsuario { get; set; }
        public string CedulaUsuario { get; set; }
        public int TelefonoUsuario { get; set; }
        public string CorreoUsuario { get; set; }
        public string? ContrasennaUsuario { get; set; }
        public bool? PassGenerico { get; set; }
        public DateTime FechaIngreso { get; set; }
        public bool estado {  get; set; }
        public Rol? Rol { get; set; }
        public List<Alumno>? Alumnos { get; set; }
    }
}
