using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Monto",
                table: "Matricula");

            migrationBuilder.AddColumn<double>(
                name: "Descuento",
                table: "EncabezadoFactura",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "status",
                table: "EncabezadoFactura",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AlumnoId",
                table: "DetalleFactura",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_AlumnoId",
                table: "DetalleFactura",
                column: "AlumnoId");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFactura_Alumno_AlumnoId",
                table: "DetalleFactura",
                column: "AlumnoId",
                principalTable: "Alumno",
                principalColumn: "IdAlumno",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFactura_Alumno_AlumnoId",
                table: "DetalleFactura");

            migrationBuilder.DropIndex(
                name: "IX_DetalleFactura_AlumnoId",
                table: "DetalleFactura");

            migrationBuilder.DropColumn(
                name: "Descuento",
                table: "EncabezadoFactura");

            migrationBuilder.DropColumn(
                name: "status",
                table: "EncabezadoFactura");

            migrationBuilder.DropColumn(
                name: "AlumnoId",
                table: "DetalleFactura");

            migrationBuilder.AddColumn<int>(
                name: "Monto",
                table: "Matricula",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
