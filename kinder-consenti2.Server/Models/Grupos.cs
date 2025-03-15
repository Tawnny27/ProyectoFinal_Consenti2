namespace kinder_consenti2.Server.Models
{
    public class Grupos
    {
        public int IdGrupos { get; set; }
        public string NombreGrupo { get; set; }
        public int EdadInicial { get; set; }      
        public int Cupo { get; set; }
        public int UsuarioId { get; set; }   
        public bool Status { get; set; }
        public Usuario? Usuario { get; set; } 
        public List<GruposAlumnos>? GruposAlumnos { get; set; }
        public List<ActividadBanno>? ActividadBannos { get; set; }
        public List<ActividadComida>? ActividadComidas { get; set; }
        public List<ActividadDormir>? ActividadDormirs { get; set; }
        public List<ActividadHuerta>? ActividadHuertas { get; set; }
        public List<ListaAsistencia>? ListaAsistencias { get; set; }
        public List<MaterialDidactico>? MaterialDidacticos { get; set; }
    }
}
