using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion13 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposIdGrupos",
                table: "GruposAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_GruposAlumnos_GruposIdGrupos",
                table: "GruposAlumnos");

            migrationBuilder.DropColumn(
                name: "GruposIdGrupos",
                table: "GruposAlumnos");

            migrationBuilder.RenameColumn(
                name: "GrupoId",
                table: "GruposAlumnos",
                newName: "GruposId");

            migrationBuilder.AddColumn<bool>(
                name: "Status",
                table: "GruposAlumnos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_GruposAlumnos_GruposId",
                table: "GruposAlumnos",
                column: "GruposId");

            migrationBuilder.AddForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposId",
                table: "GruposAlumnos",
                column: "GruposId",
                principalTable: "Grupos",
                principalColumn: "IdGrupos",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposId",
                table: "GruposAlumnos");

            migrationBuilder.DropIndex(
                name: "IX_GruposAlumnos_GruposId",
                table: "GruposAlumnos");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "GruposAlumnos");

            migrationBuilder.RenameColumn(
                name: "GruposId",
                table: "GruposAlumnos",
                newName: "GrupoId");

            migrationBuilder.AddColumn<int>(
                name: "GruposIdGrupos",
                table: "GruposAlumnos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GruposAlumnos_GruposIdGrupos",
                table: "GruposAlumnos",
                column: "GruposIdGrupos");

            migrationBuilder.AddForeignKey(
                name: "FK_GruposAlumnos_Grupos_GruposIdGrupos",
                table: "GruposAlumnos",
                column: "GruposIdGrupos",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");
        }
    }
}
