using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumno_Usuario_PadreId",
                table: "Alumno");

            migrationBuilder.DropIndex(
                name: "IX_Alumno_PadreId",
                table: "Alumno");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioIdUsuario",
                table: "Alumno",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActividadBanno",
                columns: table => new
                {
                    IdActividadBanno = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Catidad = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadBanno", x => x.IdActividadBanno);
                    table.ForeignKey(
                        name: "FK_ActividadBanno_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActividadComida",
                columns: table => new
                {
                    IdActividadComida = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    TipoComida = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StatusComida = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadComida", x => x.IdActividadComida);
                    table.ForeignKey(
                        name: "FK_ActividadComida_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActividadDormir",
                columns: table => new
                {
                    IdActividadDormir = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Tiempo = table.Column<TimeOnly>(type: "time", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadDormir", x => x.IdActividadDormir);
                    table.ForeignKey(
                        name: "FK_ActividadDormir_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActividadHuerta",
                columns: table => new
                {
                    IdActividadHuerta = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateOnly>(type: "date", nullable: false),
                    Descripcion = table.Column<int>(type: "int", nullable: false),
                    StatusParticipacion = table.Column<int>(type: "int", nullable: false),
                    Comentario = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActividadHuerta", x => x.IdActividadHuerta);
                    table.ForeignKey(
                        name: "FK_ActividadHuerta_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alumno_UsuarioIdUsuario",
                table: "Alumno",
                column: "UsuarioIdUsuario");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadBanno_AlumnoId",
                table: "ActividadBanno",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadComida_AlumnoId",
                table: "ActividadComida",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadDormir_AlumnoId",
                table: "ActividadDormir",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadHuerta_AlumnoId",
                table: "ActividadHuerta",
                column: "AlumnoId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumno_Usuario_UsuarioIdUsuario",
                table: "Alumno",
                column: "UsuarioIdUsuario",
                principalTable: "Usuario",
                principalColumn: "IdUsuario");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumno_Usuario_UsuarioIdUsuario",
                table: "Alumno");

            migrationBuilder.DropTable(
                name: "ActividadBanno");

            migrationBuilder.DropTable(
                name: "ActividadComida");

            migrationBuilder.DropTable(
                name: "ActividadDormir");

            migrationBuilder.DropTable(
                name: "ActividadHuerta");

            migrationBuilder.DropIndex(
                name: "IX_Alumno_UsuarioIdUsuario",
                table: "Alumno");

            migrationBuilder.DropColumn(
                name: "UsuarioIdUsuario",
                table: "Alumno");

            migrationBuilder.CreateIndex(
                name: "IX_Alumno_PadreId",
                table: "Alumno",
                column: "PadreId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumno_Usuario_PadreId",
                table: "Alumno",
                column: "PadreId",
                principalTable: "Usuario",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
