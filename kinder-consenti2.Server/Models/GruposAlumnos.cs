﻿namespace kinder_consenti2.Server.Models
{
    public class GruposAlumnos
    {
        public int IdGruposAlumnos { get; set; }
        public int GruposId { get; set; }
        public int AlumnoId { get; set; } 
        public bool Status { get; set; }
        public Alumno? Alumno { get; set; }
        public Grupos? Grupo { get; set; }
    }
}
