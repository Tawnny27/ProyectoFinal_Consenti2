using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class MigracionInicial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rol",
                columns: table => new
                {
                    IdRol = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreRol = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rol", x => x.IdRol);
                });

            migrationBuilder.CreateTable(
                name: "UsuarioInterno",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RolId = table.Column<int>(type: "int", nullable: false),
                    NombreUsuario = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    ApellidosUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CedulaUsuario = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    TelefonoUsuario = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    CorreoUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UsuarioInterno", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_UsuarioInterno_Rol_RolId",
                        column: x => x.RolId,
                        principalTable: "Rol",
                        principalColumn: "IdRol",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Alumno",
                columns: table => new
                {
                    IdAlumno = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PadreId = table.Column<int>(type: "int", nullable: false),
                    NombreAlumno = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    ApellidosAlumno = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    FechaNacimiento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CedulaAlumno = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    GeneroAlumno = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    DireccionAlumno = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    InformacionAdicional = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FotoAlumno = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NombreCompAutorizado = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: false),
                    CedulaAutorizado = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    TelefonoAutorizado = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    RelacionAutorizado = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    NombreCompContacto = table.Column<string>(type: "nvarchar(45)", maxLength: 45, nullable: false),
                    CedulaContacto = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    TelefonoContacto = table.Column<int>(type: "int", maxLength: 10, nullable: false),
                    RelacionContacto = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alumno", x => x.IdAlumno);
                    table.ForeignKey(
                        name: "FK_Alumno_UsuarioInterno_PadreId",
                        column: x => x.PadreId,
                        principalTable: "UsuarioInterno",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alumno_PadreId",
                table: "Alumno",
                column: "PadreId");

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioInterno_RolId",
                table: "UsuarioInterno",
                column: "RolId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Alumno");

            migrationBuilder.DropTable(
                name: "UsuarioInterno");

            migrationBuilder.DropTable(
                name: "Rol");
        }
    }
}
