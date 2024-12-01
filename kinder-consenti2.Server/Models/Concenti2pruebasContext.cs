﻿using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace kinder_consenti2.Server.Models
{
    public class Concenti2pruebasContext : DbContext
    {
        public Concenti2pruebasContext(DbContextOptions<Concenti2pruebasContext> opciones)
         : base(opciones)
        {
        }


        //########################## Declaracion ed las tablas ###################################

        public DbSet<Rol> Rol { get; set; }
        public DbSet<Usuario> Usuario { get; set; }
        public DbSet<Alumno> Alumno { get; set; }
        public DbSet<SetingCorreo> SetingCorreo { get; set; }
        public DbSet<EncabezadoFactura> EncabezadoFactura { get; set; }
        public DbSet<DetalleFactura> DetalleFactura { get; set; }
        public DbSet<Producto> Producto { get; set; }
        public DbSet<Matricula> Matricula { get; set; }
        public DbSet<Grupos> Grupos { get; set; }
        public DbSet<GruposAlumnos> GruposAlumnos { get; set; }    
        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Inventario> Inventario { get; set; }
        public DbSet<MovimientosInventario> MovimientosInventario { get; set; }        
        public DbSet<Gasto> Gasto { get; set; }



        //-----------------------------------------------------------------------------------------



        //##########################Cofiguracion del modelo de la BD###################################
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            //************************* Tabla Rol****************************
            modelBuilder.Entity<Rol>(R =>
            {
                R.HasKey(x => x.IdRol);
                R.Property(x => x.NombreRol).IsRequired().HasMaxLength(10);
            });
            //***************************************************************

            //************************* Tabla EncabezadoFactura *************
            modelBuilder.Entity<EncabezadoFactura>(E =>
            {
                E.HasKey(x => x.IdFactura);
                E.Property(x => x.Fecha).IsRequired();
                E.Property(x => x.UsuarioId).IsRequired();
                E.Property(x => x.MetodoPago).IsRequired();
                E.Property(x => x.Referencia).IsRequired();
                E.Property(x => x.Subtotal).IsRequired();
                E.Property(x => x.Iva).IsRequired();
                E.Property(x => x.Total).IsRequired();
                E.Property(x => x.Descuento).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<EncabezadoFactura>()
                .HasOne(x => x.Usuario)
                .WithMany(x => x.EncabezadoFacturas)
                .HasForeignKey(f => f.UsuarioId)
                .OnDelete(DeleteBehavior.NoAction);
            //***************************************************************

            //************************* Tabla DetalleFactura ****************
            modelBuilder.Entity<DetalleFactura>(D =>
            {
                D.HasKey(x => x.IdDetalleFactura);
                D.Property(x => x.EncabezadoFacturaId).IsRequired();
                D.Property(x => x.ProductoId).IsRequired();
                D.Property(x => x.AlumnoId).IsRequired();
                D.Property(x => x.Monto).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<DetalleFactura>()
                .HasOne(x => x.EncabezadoFactura)
                .WithMany(x => x.DetalleFacturas)
                .HasForeignKey(f => f.EncabezadoFacturaId);
            modelBuilder.Entity<DetalleFactura>()
                .HasOne(x => x.Producto)
                .WithMany(x => x.DetalleFacturas)
                .HasForeignKey(f => f.ProductoId);
            modelBuilder.Entity<DetalleFactura>()
                .HasOne(x => x.Alumno)
                .WithMany(x => x.DetalleFacturas)
                .HasForeignKey(f => f.AlumnoId);
            //***************************************************************

            //************************* Tabla Producto **********************
            modelBuilder.Entity<Producto>(P =>
            {
                P.HasKey(x => x.IdProducto);
                P.Property(x => x.NombreProducto).IsRequired();
                P.Property(x => x.Frecuencias).IsRequired();
                P.Property(x => x.Monto).IsRequired();
            });
            //Tablas ignoradas
            modelBuilder.Entity<Producto>()
                .Ignore(x => x.DetalleFacturas)
                .Ignore(x => x.Matriculas);
            //***************************************************************

            //************************* Tabla Matricula *********************
            modelBuilder.Entity<Matricula>(M =>
            {
                M.HasKey(x => x.IdMatricula);
                M.Property(x => x.ProductoId).IsRequired();
                M.Property(x => x.AlumnoId).IsRequired();
                M.Property(x => x.Fecha).IsRequired();
                M.Property(x => x.FechaFin).IsRequired();
                M.Property(x => x.Dias).IsRequired();
                M.Property(x => x.Status).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<Matricula>()
                .HasOne(x => x.Alumno)
                .WithMany(x => x.Matriculas)
                .HasForeignKey(f => f.AlumnoId);
            modelBuilder.Entity<Matricula>()
                .HasOne(x => x.Producto)
                .WithMany(x => x.Matriculas)
                .HasForeignKey(f => f.ProductoId);
            //***************************************************************

            //************************* Tabla Correo ************************
            modelBuilder.Entity<SetingCorreo>(C =>
            {
                C.HasKey(x => x.IdRegistro);
                C.Property(x => x.CorreoOrigen).IsRequired();
                C.Property(x => x.ContrasennaOrigen).IsRequired();
                C.Property(x => x.smtpClient).IsRequired();
                C.Property(x => x.asunto).IsRequired();
                C.Property(x => x.cuerpo).IsRequired();
            });
            //***************************************************************

            //************************* Tabla Usuario ***********************
            modelBuilder.Entity<Usuario>(UE =>
            {
                UE.HasKey(x => x.IdUsuario);
                UE.Property(x => x.NombreUsuario)
                .IsRequired().HasMaxLength(15);
                UE.Property(x => x.ApellidosUsuario)
                .IsRequired().HasMaxLength(50);
                UE.Property(x => x.RolId).IsRequired();
                UE.Property(x => x.CedulaUsuario)
                .IsRequired().HasMaxLength(15);
                UE.HasIndex(x => x.CedulaUsuario).IsUnique();
                UE.Property(x => x.CorreoUsuario)
                .IsRequired().IsUnicode().HasMaxLength(50);
                UE.Property(x => x.ContrasennaUsuario).IsRequired();
                UE.HasIndex(x => x.CorreoUsuario).IsUnique();
                UE.Property(x => x.TelefonoUsuario)
                .IsRequired().HasMaxLength(10);
                UE.Property(x => x.estado)
                .IsRequired().HasDefaultValue(true);
                UE.Property(x => x.PassGenerico)
                .IsRequired().HasDefaultValue(true);
                UE.Property(x => x.FechaIngreso).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<Usuario>()
                .HasOne(x => x.Rol)
                .WithMany(x => x.Usuarios)
                .HasForeignKey(f => f.RolId);
            //Tablas ignoradas
            modelBuilder.Entity<Rol>()
                .Ignore(x => x.Usuarios);
            //***************************************************************

            //************************* Tabla Alumno ************************
            modelBuilder.Entity<Alumno>(A =>
            {
                A.HasKey(x => x.IdAlumno);
                A.Property(x => x.NombreAlumno)
                .IsRequired().HasMaxLength(15);
                A.Property(x => x.ApellidosAlumno)
                .IsRequired().HasMaxLength(30);
                A.Property(x => x.PadreId).IsRequired();
                A.Property(x => x.FechaNacimiento)
                .IsRequired();
                A.Property(x => x.CedulaAlumno)
                .IsRequired().HasMaxLength(15);
                A.Property(x => x.GeneroAlumno)
                .IsRequired().HasMaxLength(6);
                A.Property(x => x.DireccionAlumno)
                .IsRequired().HasMaxLength(100);
                A.Property(x => x.InformacionAdicional)
                .IsRequired().HasMaxLength(200);
                //****************** Autorizado a recoger el alumno ***********
                A.Property(x => x.NombreCompAutorizado)
                .IsRequired().HasMaxLength(45);
                A.Property(x => x.CedulaAutorizado)
                .IsRequired().HasMaxLength(15);
                A.Property(x => x.TelefonoAutorizado)
                .IsRequired().HasMaxLength(10);
                A.Property(x => x.RelacionAutorizado)
                .IsRequired().HasMaxLength(15);
                //******************** Contacto de emergencia *****************
                A.Property(x => x.NombreCompContacto)
                .IsRequired().HasMaxLength(45);
                A.Property(x => x.CedulaContacto)
                .IsRequired().HasMaxLength(15);
                A.Property(x => x.TelefonoContacto)
                .IsRequired().HasMaxLength(10);
                A.Property(x => x.RelacionContacto)
                .IsRequired().HasMaxLength(15);
            });
            //ForeingKey
            modelBuilder.Entity<Alumno>()
                .HasOne(x => x.Usuario)
                .WithMany(x => x.Alumnos)
                .HasForeignKey(f => f.PadreId);
            //******************************************************************

            //************************* Tabla Grupos ***************************
            modelBuilder.Entity<Grupos>(G =>
            {
                G.HasKey(x => x.IdGrupos);
                G.Property(x => x.NombreGrupo).IsRequired();
                G.Property(x => x.EdadInicial).IsRequired();
                G.Property(x => x.Anno).IsRequired();
                G.Property(x => x.Cupo).IsRequired();
                G.Property(x => x.UsuarioId).IsRequired();
            });            
            //ForeingKey
            modelBuilder.Entity<Grupos>()
                .HasOne(x => x.Usuario)
                .WithMany(x => x.Grupos)
                .HasForeignKey(f => f.UsuarioId);
            //******************************************************************

            //************************* Tabla GruposAlumnos  *******************                                                                               
            modelBuilder.Entity<GruposAlumnos>(GA =>
            {                                                                  
                GA.HasKey(x => x.IdGruposAlumnos);  
                GA.Property(x => x.GrupoId).IsRequired();
                GA.Property(x => x.AlumnoId).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<GruposAlumnos>()
                .HasOne(x => x.Grupo)
                .WithMany(x => x.GruposAlumnos)
                .HasForeignKey(f => f.GrupoId)
                .OnDelete(DeleteBehavior.NoAction);
            //***************************************************************

            //************************* Tabla Categoria  ********************                                                                              
            modelBuilder.Entity<Categoria>(C =>
            {
                C.HasKey(x => x.IdCategoria);
                C.Property(x => x.NombreCategoria).IsRequired();
            });
            //***************************************************************

            //************************* Tabla Inventario  *******************                                                                               
            modelBuilder.Entity<Inventario>(I =>
            {
                I.HasKey(x => x.IdInventario);
                I.Property(x => x.CategoriaId).IsRequired();
                I.Property(x => x.Descripcion).IsRequired();
                I.Property(x => x.Cantidad).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<Inventario>()
                .HasOne(x => x.Categoria)
                .WithMany(x => x.Inventarios)
                .HasForeignKey(f => f.CategoriaId);
            //******************************************************************

            //************************* Tabla MovimientosInventario  ***********                                                                              
            modelBuilder.Entity<MovimientosInventario>(MI =>
            {
                MI.HasKey(x => x.IdMovimientosInventario);
                MI.Property(x => x.Fecha).IsRequired();
                MI.Property(x => x.InventarioId).IsRequired();
                MI.Property(x => x.Cantidad).IsRequired();
                MI.Property(x => x.Responsable).IsRequired();
                MI.Property(x => x.Movimiento).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<MovimientosInventario>()
                .HasOne(x => x.Inventario)
                .WithMany(x => x.Movimientos)
                .HasForeignKey(f => f.InventarioId);
            //******************************************************************

            //************************* Tabla Gasto  ***************************                                                                               
            modelBuilder.Entity<Gasto>(MI =>
            {
                MI.HasKey(x => x.IdGasto);
                MI.Property(x => x.Fecha).IsRequired();
                MI.Property(x => x.CategoriaId).IsRequired();
                MI.Property(x => x.Monto).IsRequired();
            });
            //ForeingKey
            modelBuilder.Entity<Gasto>()
                .HasOne(x => x.Categoria)
                .WithMany(x => x.Gastos)
                .HasForeignKey(f => f.CategoriaId);
            //******************************************************************


        }

        //###########################Fin Cofiguracion del modelo de la BD#######################################

    }
}
