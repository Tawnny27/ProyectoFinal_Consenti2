using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Expediente",
                columns: table => new
                {
                    IdExpediente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Suceso = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Expediente", x => x.IdExpediente);
                    table.ForeignKey(
                        name: "FK_Expediente_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ListaAsistencia",
                columns: table => new
                {
                    IdListaAsistencia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GruposId = table.Column<int>(type: "int", nullable: false),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    StatusAsistencia = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListaAsistencia", x => x.IdListaAsistencia);
                    table.ForeignKey(
                        name: "FK_ListaAsistencia_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ListaAsistencia_Grupos_GruposId",
                        column: x => x.GruposId,
                        principalTable: "Grupos",
                        principalColumn: "IdGrupos",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Expediente_AlumnoId",
                table: "Expediente",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_ListaAsistencia_AlumnoId",
                table: "ListaAsistencia",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_ListaAsistencia_GruposId",
                table: "ListaAsistencia",
                column: "GruposId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Expediente");

            migrationBuilder.DropTable(
                name: "ListaAsistencia");
        }
    }
}
