﻿namespace kinder_consenti2.Server.Models
{
    public class UsuarioInterno
    {
        public int IdUsuario { get; set; }
        public int RolId { get; set; }
        public string NombreUsuario { get; set; }
        public string ApellidosUsuario { get; set; }
        public string CedulaUsuario { get; set; }
        public int TelefonoUsuario { get; set; }
        public string CorreoUsuario { get; set; }
        public Rol? Rol { get; set; } 
    }
}
