namespace kinder_consenti2.Server.Models
{
    public class Grupos
    {
        public int IdGrupos { get; set; }
        public string NombreGrupo { get; set; }
        public int EdadInicial { get; set; }
        public int Anno { get; set; }
        public int Cupo { get; set; }
        public int UsuarioId { get; set; }        
        public Usuario? Usuario { get; set; }
        public List<GruposAlumnos>? GruposAlumnos { get; set; }
    }
}
