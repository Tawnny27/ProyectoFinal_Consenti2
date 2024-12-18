﻿namespace kinder_consenti2.Server.Models
{
    public class Matricula
    {
        public int IdMatricula { get; set; }
        public int ProductoId { get; set; }
        public int AlumnoId { get; set; }
        public DateTime Fecha {  get; set; }
        public DateTime FechaFin { get; set; }
        public string Dias { get; set; }       
        public bool Status { get; set; }
        public int IdFact { get; set; }
        public Alumno? Alumno { get; set; }
        public Producto? Producto { get; set; }

    }
}
