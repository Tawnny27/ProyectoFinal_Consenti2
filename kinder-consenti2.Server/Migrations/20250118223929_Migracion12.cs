using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumno_Usuario_UsuarioIdUsuario",
                table: "Alumno");

            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFactura_Producto_ProductoId",
                table: "DetalleFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_GruposAlumnos_Grupos_GrupoId",
                table: "GruposAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_GruposAlumnos_GrupoId",
                table: "GruposAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_DetalleFactura_ProductoId",
                table: "DetalleFactura");

            migrationBuilder.DropIndex(
                name: "IX_Alumno_UsuarioIdUsuario",
                table: "Alumno");

            migrationBuilder.DropColumn(
                name: "UsuarioIdUsuario",
                table: "Alumno");

            migrationBuilder.AddColumn<int>(
                name: "GruposIdGrupos",
                table: "GruposAlumnos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Eventos",
                columns: table => new
                {
                    IdEventos = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreEvento = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    DescripcionEvento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FotoEvento = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Eventos", x => x.IdEventos);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GruposAlumnos_GruposIdGrupos",
                table: "GruposAlumnos",
                column: "GruposIdGrupos");

            migrationBuilder.CreateIndex(
                name: "IX_Alumno_PadreId",
                table: "Alumno",
                column: "PadreId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumno_Usuario_PadreId",
                table: "Alumno",
                column: "PadreId",
                principalTable: "Usuario",
                principalColumn: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposIdGrupos",
                table: "GruposAlumnos",
                column: "GruposIdGrupos",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumno_Usuario_PadreId",
                table: "Alumno");

            migrationBuilder.DropForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposIdGrupos",
                table: "GruposAlumnos");

            migrationBuilder.DropTable(
                name: "Eventos");

            migrationBuilder.DropIndex(
                name: "IX_GruposAlumnos_GruposIdGrupos",
                table: "GruposAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_Alumno_PadreId",
                table: "Alumno");

            migrationBuilder.DropColumn(
                name: "GruposIdGrupos",
                table: "GruposAlumnos");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioIdUsuario",
                table: "Alumno",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GruposAlumnos_GrupoId",
                table: "GruposAlumnos",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_ProductoId",
                table: "DetalleFactura",
                column: "ProductoId");

            migrationBuilder.CreateIndex(
                name: "IX_Alumno_UsuarioIdUsuario",
                table: "Alumno",
                column: "UsuarioIdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumno_Usuario_UsuarioIdUsuario",
                table: "Alumno",
                column: "UsuarioIdUsuario",
                principalTable: "Usuario",
                principalColumn: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFactura_Producto_ProductoId",
                table: "DetalleFactura",
                column: "ProductoId",
                principalTable: "Producto",
                principalColumn: "IdProducto",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "IdUsuario");

            migrationBuilder.AddForeignKey(
                name: "FK_GruposAlumnos_Grupos_GrupoId",
                table: "GruposAlumnos",
                column: "GrupoId",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");
        }
    }
}
