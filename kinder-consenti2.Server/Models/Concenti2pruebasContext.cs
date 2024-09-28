using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace kinder_consenti2.Server.Models
{
    public class Concenti2pruebasContext: DbContext
    {
        public Concenti2pruebasContext(DbContextOptions<Concenti2pruebasContext> opciones) 
         : base(opciones)
        {
        }

        public DbSet<Rol> Rol { get; set; }
        public DbSet<UsuarioInterno> UsuarioInterno { get; set; }
        public DbSet<Padre> Padre { get; set; }
        public DbSet<Alumno> Alumno { get; set; }
        /*
        public DbSet<Grupos> Grupos { get; set; }
        public DbSet<GruposAlumnos> GruposAlumnos { get; set; }
        public DbSet<ActividadComida> ActividadComida { get; set; }
        public DbSet<ActividadDormir> ActividadDormir { get; set; }
        public DbSet<ActividadBanno> ActividadBanno { get; set; }
        public DbSet<ActividadHuerta> ActividadHuerta { get; set; }
        public DbSet<AsistenciaHuerta> AsistenciaHuerta { get; set; }
        */


        //##########################Cofiguracion del modelo de la BD###################################
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Rol>(R =>
            {
                R.HasKey(x => x.IdRol);
                R.Property(x => x.NombreRol).IsRequired().HasMaxLength(10);
            });

            modelBuilder.Entity<UsuarioInterno>(UE =>
            {
                UE.HasKey(x => x.IdUsuario);
                UE.Property(x => x.NombreUsuario).IsRequired().HasMaxLength(15);                
                UE.Property(x=> x.ApellidosUsuario).IsRequired().HasMaxLength(50);
                UE.Property(x => x.RolId).IsRequired();
                UE.Property(x => x.CedulaUsuario).IsRequired().HasMaxLength(15);
                UE.Property(x => x.CorreoUsuario).IsRequired().HasMaxLength(50);
                UE.Property(x => x.TelefonoUsuario).IsRequired().HasMaxLength(10);
            });

            //****************** Relacion entre roll-Usuario interno ***************************
            modelBuilder.Entity<UsuarioInterno>().HasOne(x => x.Rol)
                .WithMany(x => x.UsuariosInternos).HasForeignKey(f => f.RolId);
            //**********************************************************************************

            modelBuilder.Entity<Padre>(P => 
            {
                P.HasKey(x=> x.IdPadre);
                P.Property(x=> x.NombrePadre).IsRequired().HasMaxLength(15);
                P.Property(x=> x.ApellidosPadre).IsRequired().HasMaxLength(30);
                P.Property(x => x.RolId).IsRequired();
                P.Property(x=> x.CedulaPadre).IsRequired().HasMaxLength(15);
                P.Property(x=> x.CorreoPadre).IsRequired().HasMaxLength(50);
                P.Property(x=> x.TelefonoPadre).IsRequired().HasMaxLength(10);
            });

            //*************************** Relacion entre roll-Padre  ***************************
            modelBuilder.Entity<Padre>().HasOne(x => x.Rol)
                .WithMany(x => x.Padres).HasForeignKey(f => f.RolId);
            //**********************************************************************************

            modelBuilder.Entity<Alumno>(A => 
            {
                A.HasKey(x=> x.IdAlumno);
                A.Property(x=> x.NombreAlumno).IsRequired().HasMaxLength(15);
                A.Property(x=> x.ApellidosAlumno).IsRequired().HasMaxLength(30);
                A.Property(x=> x.PadreId).IsRequired();
                A.Property(x => x.FechaNacimiento).IsRequired();
                A.Property(x => x.CedulaAlumno).IsRequired().HasMaxLength(15);
                A.Property(x => x.GeneroAlumno).IsRequired().HasMaxLength(6);
                A.Property(x => x.DireccionAlumno).IsRequired().HasMaxLength(100);
                A.Property(x => x.InformacionAdicional).IsRequired().HasMaxLength(200);
                //****************** Autorizado a recoger el alumno *********************
                A.Property(x => x.NombreCompAutorizado).IsRequired().HasMaxLength(45);
                A.Property(x => x.CedulaAutorizado).IsRequired().HasMaxLength(15);
                A.Property(x => x.TelefonoAutorizado).IsRequired().HasMaxLength(10);
                A.Property(x => x.RelacionAutorizado).IsRequired().HasMaxLength(15);
                //******************** Contacto de emergencia ***************************
                A.Property(x => x.NombreCompContacto).IsRequired().HasMaxLength(45);
                A.Property(x => x.CedulaContacto).IsRequired().HasMaxLength(15);
                A.Property(x => x.TelefonoContacto).IsRequired().HasMaxLength(10);
                A.Property(x => x.RelacionContacto).IsRequired().HasMaxLength(15);
            });

            //************************* Relacion entre Padre-Alumno  ***************************
            modelBuilder.Entity<Alumno>().HasOne(x => x.Padre)
                .WithMany(x => x.Hijos).HasForeignKey(f => f.PadreId);
            //**********************************************************************************


        }

        //###########################Fin Cofiguracion del modelo de la BD#######################################

    }
}
