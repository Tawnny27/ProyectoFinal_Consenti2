using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion11 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NombreArchivo",
                table: "MaterialDidactico",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NombreArchivo",
                table: "MaterialDidactico");
        }
    }
}
