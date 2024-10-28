﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using kinder_consenti2.Server.Models;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    [DbContext(typeof(Concenti2pruebasContext))]
    partial class Concenti2pruebasContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
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

            modelBuilder.Entity("kinder_consenti2.Server.Models.DetalleFactura", b =>
                {
                    b.Property<int>("IdDetalleFactura")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdDetalleFactura"));

                    b.Property<int>("EncabezadoId")
                        .HasColumnType("int");

                    b.Property<int>("Monto")
                        .HasColumnType("int");

                    b.Property<int>("ProductoId")
                        .HasColumnType("int");

                    b.HasKey("IdDetalleFactura");

                    b.HasIndex("EncabezadoId");

                    b.HasIndex("ProductoId");

                    b.ToTable("DetalleFactura");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.EncabezadoFactura", b =>
                {
                    b.Property<int>("IdFactura")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("IdFactura"));

                    b.Property<string>("Cliente")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<double>("Iva")
                        .HasColumnType("float");

                    b.Property<double>("Subtotal")
                        .HasColumnType("float");

                    b.Property<double>("Total")
                        .HasColumnType("float");

                    b.HasKey("IdFactura");

                    b.ToTable("EncabezadoFactura");
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

                    b.Property<int>("Monto")
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

                    b.Property<bool?>("PassGenerico")
                        .IsRequired()
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
                        .WithMany("Hijos")
                        .HasForeignKey("PadreId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.DetalleFactura", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.EncabezadoFactura", "Encabezado")
                        .WithMany("Detalles")
                        .HasForeignKey("EncabezadoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinder_consenti2.Server.Models.Producto", "Producto")
                        .WithMany()
                        .HasForeignKey("ProductoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Encabezado");

                    b.Navigation("Producto");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Matricula", b =>
                {
                    b.HasOne("kinder_consenti2.Server.Models.Alumno", "Alumno")
                        .WithMany("Matriculas")
                        .HasForeignKey("AlumnoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("kinder_consenti2.Server.Models.Producto", "Productos")
                        .WithMany("Matricula")
                        .HasForeignKey("ProductoId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Alumno");

                    b.Navigation("Productos");
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
                    b.Navigation("Matriculas");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.EncabezadoFactura", b =>
                {
                    b.Navigation("Detalles");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Producto", b =>
                {
                    b.Navigation("Matricula");
                });

            modelBuilder.Entity("kinder_consenti2.Server.Models.Usuario", b =>
                {
                    b.Navigation("Hijos");
                });
#pragma warning restore 612, 618
        }
    }
}
