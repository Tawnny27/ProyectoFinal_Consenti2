using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumno_UsuarioInterno_PadreId",
                table: "Alumno");

            migrationBuilder.DropTable(
                name: "UsuarioInterno");

            migrationBuilder.CreateTable(
                name: "Usuario",
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
                    table.PrimaryKey("PK_Usuario", x => x.IdUsuario);
                    table.ForeignKey(
                        name: "FK_Usuario_Rol_RolId",
                        column: x => x.RolId,
                        principalTable: "Rol",
                        principalColumn: "IdRol",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_RolId",
                table: "Usuario",
                column: "RolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumno_Usuario_PadreId",
                table: "Alumno",
                column: "PadreId",
                principalTable: "Usuario",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Alumno_Usuario_PadreId",
                table: "Alumno");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.CreateTable(
                name: "UsuarioInterno",
                columns: table => new
                {
                    IdUsuario = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RolId = table.Column<int>(type: "int", nullable: false),
                    ApellidosUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CedulaUsuario = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    CorreoUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NombreUsuario = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    TelefonoUsuario = table.Column<int>(type: "int", maxLength: 10, nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_UsuarioInterno_RolId",
                table: "UsuarioInterno",
                column: "RolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Alumno_UsuarioInterno_PadreId",
                table: "Alumno",
                column: "PadreId",
                principalTable: "UsuarioInterno",
                principalColumn: "IdUsuario",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
