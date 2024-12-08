using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FotoAlumno",
                columns: table => new
                {
                    IdFotoAlumno = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    RutaFoto = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FotoAlumno", x => x.IdFotoAlumno);
                    table.ForeignKey(
                        name: "FK_FotoAlumno_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MaterialDidactico",
                columns: table => new
                {
                    IdMaterialDidactico = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    GruposId = table.Column<int>(type: "int", nullable: false),
                    RutaFoto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusAct = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MaterialDidactico", x => x.IdMaterialDidactico);
                    table.ForeignKey(
                        name: "FK_MaterialDidactico_Grupos_GruposId",
                        column: x => x.GruposId,
                        principalTable: "Grupos",
                        principalColumn: "IdGrupos",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FotoAlumno_AlumnoId",
                table: "FotoAlumno",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_MaterialDidactico_GruposId",
                table: "MaterialDidactico",
                column: "GruposId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FotoAlumno");

            migrationBuilder.DropTable(
                name: "MaterialDidactico");
        }
    }
}
