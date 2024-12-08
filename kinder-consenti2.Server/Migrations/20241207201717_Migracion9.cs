using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "EvaluacionDocente",
                columns: table => new
                {
                    IdEvaluacionDocente = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    Puntos = table.Column<int>(type: "int", nullable: false),
                    Comentarios = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluacionDocente", x => x.IdEvaluacionDocente);
                    table.ForeignKey(
                        name: "FK_EvaluacionDocente_Usuario_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuario",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EvaluacionKinder",
                columns: table => new
                {
                    IdEvaluacionKinder = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    PuntosIntalacion = table.Column<int>(type: "int", nullable: false),
                    PuntosPersonlAdm = table.Column<int>(type: "int", nullable: false),
                    PuntosEnsenaza = table.Column<int>(type: "int", nullable: false),
                    Sugerencias = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EvaluacionKinder", x => x.IdEvaluacionKinder);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EvaluacionDocente_UsuarioId",
                table: "EvaluacionDocente",
                column: "UsuarioId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "EvaluacionDocente");

            migrationBuilder.DropTable(
                name: "EvaluacionKinder");
        }
    }
}
