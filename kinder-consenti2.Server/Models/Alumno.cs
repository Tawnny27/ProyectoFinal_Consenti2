namespace kinder_consenti2.Server.Models
{
    public class Alumno
    {
        public int IdAlumno { get; set; }
        public int PadreId { get; set; }
        public string NombreAlumno { get; set; }
        public string Apellidos { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string CedulaAlumno { get; set; }
        public string GeneroAlumno { get; set; }
        public string direccionAlumno { get; set; }
        public string InformacionAdicional { get; set; }
        public string FotoAlumno { get; set; }

        //******** Autorizado a recoger el alumno *****************
        public string NombreCompAutorizado { get; set; }
        public string CedulaAutorizado { get; set; }
        public int TelefonoAutorizado { get; set; }
        public string RelacionAutorizado {get; set;}

        //******** Contacto de emergencia *****************
        public string NombreCompContacto { get; set; }
        public string CedulaContacto { get; set; }
        public int TelefonoContacto { get; set; }
        public string RelacionContacto { get; set; }

    }
}
