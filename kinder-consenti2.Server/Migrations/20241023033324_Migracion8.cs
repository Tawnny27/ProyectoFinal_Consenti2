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
                name: "SetingCorreo",
                columns: table => new
                {
                    IdRegistro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CorreoOrigen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContrasennaOrigen = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    smtpClient = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    asunto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    cuerpo = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SetingCorreo", x => x.IdRegistro);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SetingCorreo");
        }
    }
}
