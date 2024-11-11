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
                name: "EncabezadoFactura",
                columns: table => new
                {
                    IdFactura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Cliente = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Subtotal = table.Column<double>(type: "float", nullable: false),
                    Iva = table.Column<double>(type: "float", nullable: false),
                    Total = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EncabezadoFactura", x => x.IdFactura);
                });

            migrationBuilder.CreateTable(
                name: "Producto",
                columns: table => new
                {
                    IdProducto = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreProducto = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Frecuencias = table.Column<int>(type: "int", nullable: false),
                    Monto = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Producto", x => x.IdProducto);
                });

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

            migrationBuilder.CreateTable(
                name: "DetalleFactura",
                columns: table => new
                {
                    IdDetalleFactura = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EncabezadoId = table.Column<int>(type: "int", nullable: false),
                    ProductoId = table.Column<int>(type: "int", nullable: false),
                    Monto = table.Column<int>(type: "int", nullable: false),
                    EncabezadoFacturaIdFactura = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetalleFactura", x => x.IdDetalleFactura);
                    table.ForeignKey(
                        name: "FK_DetalleFactura_EncabezadoFactura_EncabezadoFacturaIdFactura",
                        column: x => x.EncabezadoFacturaIdFactura,
                        principalTable: "EncabezadoFactura",
                        principalColumn: "IdFactura");
                });

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
                    CorreoUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ContrasennaUsuario = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PassGenerico = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    FechaIngreso = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estado = table.Column<bool>(type: "bit", nullable: false, defaultValue: true)
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
                        name: "FK_Alumno_Usuario_PadreId",
                        column: x => x.PadreId,
                        principalTable: "Usuario",
                        principalColumn: "IdUsuario",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Matricula",
                columns: table => new
                {
                    IdMatricula = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductoId = table.Column<int>(type: "int", nullable: false),
                    AlumnoId = table.Column<int>(type: "int", nullable: false),
                    Fecha = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaFin = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Dias = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Monto = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matricula", x => x.IdMatricula);
                    table.ForeignKey(
                        name: "FK_Matricula_Alumno_AlumnoId",
                        column: x => x.AlumnoId,
                        principalTable: "Alumno",
                        principalColumn: "IdAlumno",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Matricula_Producto_ProductoId",
                        column: x => x.ProductoId,
                        principalTable: "Producto",
                        principalColumn: "IdProducto",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Alumno_PadreId",
                table: "Alumno",
                column: "PadreId");

            migrationBuilder.CreateIndex(
                name: "IX_DetalleFactura_EncabezadoFacturaIdFactura",
                table: "DetalleFactura",
                column: "EncabezadoFacturaIdFactura");

            migrationBuilder.CreateIndex(
                name: "IX_Matricula_AlumnoId",
                table: "Matricula",
                column: "AlumnoId");

            migrationBuilder.CreateIndex(
                name: "IX_Matricula_ProductoId",
                table: "Matricula",
                column: "ProductoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_CedulaUsuario",
                table: "Usuario",
                column: "CedulaUsuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_CorreoUsuario",
                table: "Usuario",
                column: "CorreoUsuario",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuario_RolId",
                table: "Usuario",
                column: "RolId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetalleFactura");

            migrationBuilder.DropTable(
                name: "Matricula");

            migrationBuilder.DropTable(
                name: "SetingCorreo");

            migrationBuilder.DropTable(
                name: "EncabezadoFactura");

            migrationBuilder.DropTable(
                name: "Alumno");

            migrationBuilder.DropTable(
                name: "Producto");

            migrationBuilder.DropTable(
                name: "Usuario");

            migrationBuilder.DropTable(
                name: "Rol");
        }
    }
}
