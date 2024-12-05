using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GrupoId",
                table: "ActividadHuerta",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GruposIdGrupos",
                table: "ActividadHuerta",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GrupoId",
                table: "ActividadDormir",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GruposIdGrupos",
                table: "ActividadDormir",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GrupoId",
                table: "ActividadComida",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GruposIdGrupos",
                table: "ActividadComida",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GrupoId",
                table: "ActividadBanno",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GruposIdGrupos",
                table: "ActividadBanno",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActividadHuerta_GruposIdGrupos",
                table: "ActividadHuerta",
                column: "GruposIdGrupos");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadDormir_GruposIdGrupos",
                table: "ActividadDormir",
                column: "GruposIdGrupos");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadComida_GruposIdGrupos",
                table: "ActividadComida",
                column: "GruposIdGrupos");

            migrationBuilder.CreateIndex(
                name: "IX_ActividadBanno_GruposIdGrupos",
                table: "ActividadBanno",
                column: "GruposIdGrupos");

            migrationBuilder.AddForeignKey(
                name: "FK_ActividadBanno_Grupos_GruposIdGrupos",
                table: "ActividadBanno",
                column: "GruposIdGrupos",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");

            migrationBuilder.AddForeignKey(
                name: "FK_ActividadComida_Grupos_GruposIdGrupos",
                table: "ActividadComida",
                column: "GruposIdGrupos",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");

            migrationBuilder.AddForeignKey(
                name: "FK_ActividadDormir_Grupos_GruposIdGrupos",
                table: "ActividadDormir",
                column: "GruposIdGrupos",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");

            migrationBuilder.AddForeignKey(
                name: "FK_ActividadHuerta_Grupos_GruposIdGrupos",
                table: "ActividadHuerta",
                column: "GruposIdGrupos",
                principalTable: "Grupos",
                principalColumn: "IdGrupos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ActividadBanno_Grupos_GruposIdGrupos",
                table: "ActividadBanno");

            migrationBuilder.DropForeignKey(
                name: "FK_ActividadComida_Grupos_GruposIdGrupos",
                table: "ActividadComida");

            migrationBuilder.DropForeignKey(
                name: "FK_ActividadDormir_Grupos_GruposIdGrupos",
                table: "ActividadDormir");

            migrationBuilder.DropForeignKey(
                name: "FK_ActividadHuerta_Grupos_GruposIdGrupos",
                table: "ActividadHuerta");

            migrationBuilder.DropIndex(
                name: "IX_ActividadHuerta_GruposIdGrupos",
                table: "ActividadHuerta");

            migrationBuilder.DropIndex(
                name: "IX_ActividadDormir_GruposIdGrupos",
                table: "ActividadDormir");

            migrationBuilder.DropIndex(
                name: "IX_ActividadComida_GruposIdGrupos",
                table: "ActividadComida");

            migrationBuilder.DropIndex(
                name: "IX_ActividadBanno_GruposIdGrupos",
                table: "ActividadBanno");

            migrationBuilder.DropColumn(
                name: "GrupoId",
                table: "ActividadHuerta");

            migrationBuilder.DropColumn(
                name: "GruposIdGrupos",
                table: "ActividadHuerta");

            migrationBuilder.DropColumn(
                name: "GrupoId",
                table: "ActividadDormir");

            migrationBuilder.DropColumn(
                name: "GruposIdGrupos",
                table: "ActividadDormir");

            migrationBuilder.DropColumn(
                name: "GrupoId",
                table: "ActividadComida");

            migrationBuilder.DropColumn(
                name: "GruposIdGrupos",
                table: "ActividadComida");

            migrationBuilder.DropColumn(
                name: "GrupoId",
                table: "ActividadBanno");

            migrationBuilder.DropColumn(
                name: "GruposIdGrupos",
                table: "ActividadBanno");
        }
    }
}
