﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace kinder_consenti2.Server.Migrations
{
    /// <inheritdoc />
    public partial class Migracion10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFactura_EncabezadoFactura_EncabezadoId",
                table: "DetalleFactura");

            migrationBuilder.DropIndex(
                name: "IX_DetalleFactura_EncabezadoId",
                table: "DetalleFactura");

            migrationBuilder.AddColumn<int>(
                name: "AlumnoId",
                table: "EncabezadoFactura",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Dias",
                table: "EncabezadoFactura",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EncabezadoFacturaIdFactura",
                table: "DetalleFactura",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_EncabezadoFacturaIdFactura",
                table: "DetalleFactura",
                column: "EncabezadoFacturaIdFactura");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFactura_EncabezadoFactura_EncabezadoFacturaIdFactura",
                table: "DetalleFactura",
                column: "EncabezadoFacturaIdFactura",
                principalTable: "EncabezadoFactura",
                principalColumn: "IdFactura");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetalleFactura_EncabezadoFactura_EncabezadoFacturaIdFactura",
                table: "DetalleFactura");

            migrationBuilder.DropIndex(
                name: "IX_DetalleFactura_EncabezadoFacturaIdFactura",
                table: "DetalleFactura");

            migrationBuilder.DropColumn(
                name: "AlumnoId",
                table: "EncabezadoFactura");

            migrationBuilder.DropColumn(
                name: "Dias",
                table: "EncabezadoFactura");

            migrationBuilder.DropColumn(
                name: "EncabezadoFacturaIdFactura",
                table: "DetalleFactura");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_EncabezadoId",
                table: "DetalleFactura",
                column: "EncabezadoId");

            migrationBuilder.AddForeignKey(
                name: "FK_DetalleFactura_EncabezadoFactura_EncabezadoId",
                table: "DetalleFactura",
                column: "EncabezadoId",
                principalTable: "EncabezadoFactura",
                principalColumn: "IdFactura",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
