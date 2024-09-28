namespace kinder_consenti2.Server.Models
{
    public class Rol
    {
        public int IdRol { get; set; } 
        public string NombreRol { get; set; }
        public List<UsuarioInterno>? UsuariosInternos { get; set; }
        public List<Padre>? Padres { get; set; }

    }
}
