using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion14 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposId",
                table: "GruposAlumnos");

            migrationBuilder.DropColumn(
                name: "Anno",
                table: "Grupos");

            migrationBuilder.DropColumn(
                name: "EdadFinal",
                table: "Grupos");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_ProductoId",
                table: "DetalleFactura",
                column: "ProductoId");

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
                name: "FK_GruposAlumnos_Grupos_GruposId",
                table: "GruposAlumnos",
                column: "GruposId",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFactura_Producto_ProductoId",
                table: "DetalleFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura");

            migrationBuilder.DropForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposId",
                table: "GruposAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_DetalleFactura_ProductoId",
                table: "DetalleFactura");

            migrationBuilder.AddColumn<int>(
                name: "Anno",
                table: "Grupos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "EdadFinal",
                table: "Grupos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_EncabezadoFactura_Usuario_UsuarioId",
                table: "EncabezadoFactura",
                column: "UsuarioId",
                principalTable: "Usuario",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposId",
                table: "GruposAlumnos",
                column: "GruposId",
                principalTable: "Grupos",
                principalColumn: "IdGrupos",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
