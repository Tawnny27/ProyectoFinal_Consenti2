﻿namespace kinder_consenti2.Server.Models
{
    public class Rol
    {
        public int IdRol { get; set; } 
        public string NombreRol { get; set; }
        public List<Usuario>? Usuarios { get; set; }       

    }
}
