using Microsoft.EntityFrameworkCore;

namespace kinder_consenti2.Server.Models
{
    public class Concenti2pruebasContext: DbContext
    {
        public Concenti2pruebasContext(DbContextOptions<Concenti2pruebasContext> opciones) 
         : base(opciones)
        {
        }

        public DbSet<Rol> Rols { get; set; }
        public DbSet<UsuarioInterno> UsuarioInterno { get; set; }
        public DbSet<Padre> Padre { get; set; }
        public DbSet<Alumno> Alumno { get; set; }
        public DbSet<Grupos> Grupos { get; set; }
        public DbSet<GruposAlumnos> GruposAlumnos { get; set; }
        public DbSet<ActividadComida> ActividadComida { get; set; }
        public DbSet<ActividadDormir> ActividadDormir { get; set; }
        public DbSet<ActividadBanno> ActividadBanno { get; set; }
        public DbSet<ActividadHuerta> ActividadHuerta { get; set; }
        public DbSet<AsistenciaHuerta> AsistenciaHuerta { get; set; }
        
    }
}
