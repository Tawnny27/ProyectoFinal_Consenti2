﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using kinder_consenti2.Server.Models;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    [DbContext(typeof(Concenti2pruebasContext))]
    [Migration("20241205040844_Migracion3")]
    partial class Migracion3
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.0")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("kinder_consenti2.Server.Models.Alumno", b =>
                {
                    b.Property<int>("IdAlumno")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdAlumno"));

                    b.Property<string>("ApellidosAlumno")
                        .IsRequired()
                        .HasMaxLength(30)
                        .HasColumnType("nvarchar(30)");

                    b.Property<string>("CedulaAlumno")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("CedulaAutorizado")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("CedulaContacto")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("DireccionAlumno")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<DateTime>("FechaNacimiento")
                        .HasColumnType("datetime2");

                    b.Property<string>("FotoAlumno")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("GeneroAlumno")
                        .IsRequired()
                        .HasMaxLength(6)
                        .HasColumnType("nvarchar(6)");

                    b.Property<string>("InformacionAdicional")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("NombreAlumno")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("NombreCompAutorizado")
                        .IsRequired()
                        .HasMaxLength(45)
                        .HasColumnType("nvarchar(45)");

                    b.Property<string>("NombreCompContacto")
                        .IsRequired()
                        .HasMaxLength(45)
                        .HasColumnType("nvarchar(45)");

                    b.Property<int>("PadreId")
                        .HasColumnType("int");

                    b.Property<string>("RelacionAutorizado")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("RelacionContacto")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<int>("TelefonoAutorizado")
                        .HasMaxLength(10)
                        .HasColumnType("int");

                    b.Property<int>("TelefonoContacto")
                        .HasMaxLength(10)
                        .HasColumnType("int");

                    b.HasKey("IdAlumno");

                    b.HasIndex("PadreId");

                    b.ToTable("Alumno");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Categoria", b =>
                {
                    b.Property<int>("IdCategoria")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdCategoria"));

                    b.Property<string>("NombreCategoria")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("IdCategoria");

                    b.ToTable("Categoria");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.DetalleFactura", b =>
                {
                    b.Property<int>("IdDetalleFactura")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdDetalleFactura"));

                    b.Property<int>("AlumnoId")
                        .HasColumnType("int");

                    b.Property<int>("EncabezadoFacturaId")
                        .HasColumnType("int");

                    b.Property<int>("Monto")
                        .HasColumnType("int");

                    b.Property<int>("ProductoId")
                        .HasColumnType("int");

                    b.HasKey("IdDetalleFactura");

                    b.HasIndex("AlumnoId");

                    b.HasIndex("EncabezadoFacturaId");

                    b.HasIndex("ProductoId");

                    b.ToTable("DetalleFactura");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.EncabezadoFactura", b =>
                {
                    b.Property<int>("IdFactura")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdFactura"));

                    b.Property<double>("Descuento")
                        .HasColumnType("float");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<string>("ImagenPago")
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Iva")
                        .HasColumnType("float");

                    b.Property<string>("MetodoPago")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Referencia")
                        .HasColumnType("int");

                    b.Property<double>("Subtotal")
                        .HasColumnType("float");

                    b.Property<double>("Total")
                        .HasColumnType("float");

                    b.Property<int>("UsuarioId")
                        .HasColumnType("int");

                    b.Property<int>("status")
                        .HasColumnType("int");

                    b.HasKey("IdFactura");

                    b.HasIndex("UsuarioId");

                    b.ToTable("EncabezadoFactura");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Gasto", b =>
                {
                    b.Property<int>("IdGasto")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdGasto"));

                    b.Property<int>("CategoriaId")
                        .HasColumnType("int");

                    b.Property<DateOnly>("Fecha")
                        .HasColumnType("date");

                    b.Property<double>("Monto")
                        .HasColumnType("float");

                    b.HasKey("IdGasto");

                    b.HasIndex("CategoriaId");

                    b.ToTable("Gasto");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Grupos", b =>
                {
                    b.Property<int>("IdGrupos")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdGrupos"));

                    b.Property<int>("Anno")
                        .HasColumnType("int");

                    b.Property<int>("Cupo")
                        .HasColumnType("int");

                    b.Property<int>("EdadFinal")
                        .HasColumnType("int");

                    b.Property<int>("EdadInicial")
                        .HasColumnType("int");

                    b.Property<string>("NombreGrupo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Status")
                        .HasColumnType("bit");

                    b.Property<int>("UsuarioId")
                        .HasColumnType("int");

                    b.HasKey("IdGrupos");

                    b.HasIndex("UsuarioId");

                    b.ToTable("Grupos");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.GruposAlumnos", b =>
                {
                    b.Property<int>("IdGruposAlumnos")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdGruposAlumnos"));

                    b.Property<int>("AlumnoId")
                        .HasColumnType("int");

                    b.Property<int>("GrupoId")
                        .HasColumnType("int");

                    b.HasKey("IdGruposAlumnos");

                    b.HasIndex("AlumnoId");

                    b.HasIndex("GrupoId");

                    b.ToTable("GruposAlumnos");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Inventario", b =>
                {
                    b.Property<int>("IdInventario")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdInventario"));

                    b.Property<int>("Cantidad")
                        .HasColumnType("int");

                    b.Property<int>("CategoriaId")
                        .HasColumnType("int");

                    b.Property<string>("Descripcion")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("IdInventario");

                    b.HasIndex("CategoriaId");

                    b.ToTable("Inventario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Matricula", b =>
                {
                    b.Property<int>("IdMatricula")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdMatricula"));

                    b.Property<int>("AlumnoId")
                        .HasColumnType("int");

                    b.Property<string>("Dias")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("FechaFin")
                        .HasColumnType("datetime2");

                    b.Property<int>("IdFact")
                        .HasColumnType("int");

                    b.Property<int>("ProductoId")
                        .HasColumnType("int");

                    b.Property<bool>("Status")
                        .HasColumnType("bit");

                    b.HasKey("IdMatricula");

                    b.HasIndex("AlumnoId");

                    b.HasIndex("ProductoId");

                    b.ToTable("Matricula");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.MovimientosInventario", b =>
                {
                    b.Property<int>("IdMovimientosInventario")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdMovimientosInventario"));

                    b.Property<int>("Cantidad")
                        .HasColumnType("int");

                    b.Property<DateOnly>("Fecha")
                        .HasColumnType("date");

                    b.Property<int>("InventarioId")
                        .HasColumnType("int");

                    b.Property<bool>("Movimiento")
                        .HasColumnType("bit");

                    b.Property<string>("Responsable")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("IdMovimientosInventario");

                    b.HasIndex("InventarioId");

                    b.ToTable("MovimientosInventario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Producto", b =>
                {
                    b.Property<int>("IdProducto")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdProducto"));

                    b.Property<int>("Frecuencias")
                        .HasColumnType("int");

                    b.Property<int>("Monto")
                        .HasColumnType("int");

                    b.Property<string>("NombreProducto")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("IdProducto");

                    b.ToTable("Producto");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Rol", b =>
                {
                    b.Property<int>("IdRol")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdRol"));

                    b.Property<string>("NombreRol")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("nvarchar(10)");

                    b.HasKey("IdRol");

                    b.ToTable("Rol");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.SetingCorreo", b =>
                {
                    b.Property<int>("IdRegistro")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdRegistro"));

                    b.Property<string>("ContrasennaOrigen")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CorreoOrigen")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("asunto")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("cuerpo")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("smtpClient")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("IdRegistro");

                    b.ToTable("SetingCorreo");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Usuario", b =>
                {
                    b.Property<int>("IdUsuario")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdUsuario"));

                    b.Property<string>("ApellidosUsuario")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("CedulaUsuario")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<string>("ContrasennaUsuario")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("CorreoUsuario")
                        .IsRequired()
                        .HasMaxLength(50)
                        .IsUnicode(true)
                        .HasColumnType("nvarchar(50)");

                    b.Property<DateTime>("FechaIngreso")
                        .HasColumnType("datetime2");

                    b.Property<string>("NombreUsuario")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("nvarchar(15)");

                    b.Property<bool>("PassGenerico")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(true);

                    b.Property<int>("RolId")
                        .HasColumnType("int");

                    b.Property<int>("TelefonoUsuario")
                        .HasMaxLength(10)
                        .HasColumnType("int");

                    b.Property<bool>("estado")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bit")
                        .HasDefaultValue(true);

                    b.HasKey("IdUsuario");

                    b.HasIndex("CedulaUsuario")
                        .IsUnique();

                    b.HasIndex("CorreoUsuario")
                        .IsUnique();

                    b.HasIndex("RolId");

                    b.ToTable("Usuario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Alumno", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Usuario", "Usuario")
                        .WithMany("Alumnos")
                        .HasForeignKey("PadreId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.DetalleFactura", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Alumno", "Alumno")
                        .WithMany("DetalleFacturas")
                        .HasForeignKey("AlumnoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinder_consenti2.Server.Models.EncabezadoFactura", "EncabezadoFactura")
                        .WithMany("DetalleFacturas")
                        .HasForeignKey("EncabezadoFacturaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinder_consenti2.Server.Models.Producto", "Producto")
                        .WithMany()
                        .HasForeignKey("ProductoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Alumno");

                    b.Navigation("EncabezadoFactura");

                    b.Navigation("Producto");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.EncabezadoFactura", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Usuario", "Usuario")
                        .WithMany("EncabezadoFacturas")
                        .HasForeignKey("UsuarioId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Gasto", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Categoria", "Categoria")
                        .WithMany("Gastos")
                        .HasForeignKey("CategoriaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Categoria");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Grupos", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Usuario", "Usuario")
                        .WithMany("Grupos")
                        .HasForeignKey("UsuarioId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.GruposAlumnos", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Alumno", "Alumno")
                        .WithMany("AlumnosAlumnos")
                        .HasForeignKey("AlumnoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinder_consenti2.Server.Models.Grupos", "Grupo")
                        .WithMany("GruposAlumnos")
                        .HasForeignKey("GrupoId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.Navigation("Alumno");

                    b.Navigation("Grupo");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Inventario", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Categoria", "Categoria")
                        .WithMany("Inventarios")
                        .HasForeignKey("CategoriaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Categoria");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Matricula", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Alumno", "Alumno")
                        .WithMany("Matriculas")
                        .HasForeignKey("AlumnoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinder_consenti2.Server.Models.Producto", "Producto")
                        .WithMany("Matriculas")
                        .HasForeignKey("ProductoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Alumno");

                    b.Navigation("Producto");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.MovimientosInventario", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Inventario", "Inventario")
                        .WithMany("Movimientos")
                        .HasForeignKey("InventarioId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Inventario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Usuario", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Rol", "Rol")
                        .WithMany()
                        .HasForeignKey("RolId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Rol");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Alumno", b =>
                {
                    b.Navigation("AlumnosAlumnos");

                    b.Navigation("DetalleFacturas");

                    b.Navigation("Matriculas");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Categoria", b =>
                {
                    b.Navigation("Gastos");

                    b.Navigation("Inventarios");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.EncabezadoFactura", b =>
                {
                    b.Navigation("DetalleFacturas");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Grupos", b =>
                {
                    b.Navigation("GruposAlumnos");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Inventario", b =>
                {
                    b.Navigation("Movimientos");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Producto", b =>
                {
                    b.Navigation("Matriculas");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Usuario", b =>
                {
                    b.Navigation("Alumnos");

                    b.Navigation("EncabezadoFacturas");

                    b.Navigation("Grupos");
                });
#pragma warning restore 612, 618
        }
    }
}
