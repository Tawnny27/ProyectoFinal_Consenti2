using kinder_consenti2.Server.Models;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using QuestPDF.Companion;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QuestPDF.Previewer;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Globalization;


namespace kinder_consenti2.Server.Herramientas
{

    public class FacturaPDF
    {
        private readonly string _logo = Path.Combine(
            Directory.GetCurrentDirectory(), "..", // Subir un nivel desde la carpeta actual - raiz del proyecto
            "kinder-consenti2.client", "src", "assets","logo.png" 
        );

        public Document CrearFactura(EncabezadoFactura factura)
        {
            string numFactura = factura.IdFactura.ToString();
            string numFinal = "0";
            CultureInfo moneda = new CultureInfo("es-CR");

            if (numFactura.Length > 10)
            {
                numFinal = numFactura;
            }
            else
            {
                for (int i = 0; i < (10 - numFactura.Length); i++)
                {

                    numFinal = numFinal + "0";
                }
                numFinal = numFinal + numFactura;

            }



            Document document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    //Encabezado**************************************************
                    page.Header().ShowOnce().Row(row =>
                    {
                        //Imagen logo Derecha
                        //row.ConstantItem(140).Height(60).Placeholder();

                        // Datos de factura
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().AlignLeft().Text("Factura #").Bold().FontSize(14);
                            col.Item().AlignLeft().Text($"{numFinal}").FontSize(12);
                            col.Item().AlignLeft().Text("Fecha").Bold().FontSize(14);
                            col.Item().AlignLeft().Text($"{DateOnly.FromDateTime(factura.Fecha)}").FontSize(12);
                        });

                      

                        //Datos del cliente Centro
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().AlignCenter().Text("Kinder Concenti2").Bold().FontSize(14);
                            col.Item().AlignCenter().Text("Cedula Juridica: 000000000000").FontSize(12);

                            col.Item().AlignCenter().Text("Correo: Concenti2@gmail.com").FontSize(12);
                            col.Item().AlignCenter().Text("Telefono:  0000-0000").FontSize(12);

                        });

                        row.RelativeItem().AlignRight().Column(col => { 
                            col.Item().Width(80).AlignRight().Image(_logo);
                        });

                    });
                    //Contenido**************************************************
                    page.Content().PaddingVertical(20).Column(col =>
                    {

                        col.Item().Text(text =>
                        {
                            text.Span("Nombre Completo: ").Bold().FontSize(12);
                            text.Span($"{factura.Usuario.NombreUsuario}" + " " + $"{factura.Usuario.ApellidosUsuario}").FontSize(12);
                        });

                        col.Item().Text(text =>
                        {
                            text.Span("Correo: ").Bold().FontSize(12);
                            text.Span($"{factura.Usuario.CorreoUsuario}").FontSize(12);
                        });

                        col.Spacing(10);

                        col.Item().LineHorizontal(0.5f).LineColor("#d481f5");

                        col.Item().Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                                columns.RelativeColumn();
                            });

                            table.Header(header =>
                            {
                                header.Cell().Padding(8).Background("#d481f5").AlignCenter().Text("Alumno").Bold().FontColor("#fff");
                                header.Cell().Padding(8).Background("#d481f5").AlignCenter().Text("Rubro").Bold().FontColor("#fff");
                                header.Cell().Padding(8).Background("#d481f5").AlignCenter().Text("Monto").Bold().FontColor("#fff");
                            });

                            foreach (var item in factura.DetalleFacturas)
                            {

                                // Formato contable                               

                                table.Cell().BorderBottom(0.5f).Padding(5)
                                .BorderColor("#d481f5").AlignLeft()
                                .Text($"{item.Alumno.NombreAlumno}" + " " + $"{item.Alumno.ApellidosAlumno}").FontSize(8);

                                table.Cell().BorderBottom(0.5f).Padding(5)
                               .BorderColor("#d481f5").AlignLeft()
                               .Text($"{item.Producto.NombreProducto}").FontSize(8);

                                table.Cell().BorderBottom(0.5f).Padding(5)
                                .BorderColor("#d481f5").AlignCenter()
                                .Text($"{item.Monto.ToString("C", moneda)}").FontSize(8);
                            }
                        });

                        col.Spacing(10);

                        col.Item().Background(Colors.Grey.Lighten2).Padding(10).AlignRight().Column(colContent =>
                        {
                            colContent.Item().Text(text =>
                            {
                                text.Span("Subtotal: ").Bold().FontSize(12).FontColor(Colors.Black);
                                text.Span($"{factura.Subtotal.ToString("C", moneda)}").FontSize(12).FontColor(Colors.Black);
                            });

                            colContent.Item().Text(text =>
                            {
                                text.Span("Iva: ").Bold().FontSize(12).FontColor(Colors.Black);
                                text.Span($"{(factura.Subtotal * factura.Iva).ToString("C", moneda)}").FontSize(12).FontColor(Colors.Black);
                            });

                            colContent.Item().Text(text =>
                            {
                                text.Span("Total: ").Bold().FontSize(12).FontColor(Colors.Black);
                                text.Span($"{factura.Total.ToString("C", moneda)}").FontSize(12).FontColor(Colors.Black);
                            });

                        });

                    });


                    //Footer*****************************************************
                    page.Footer();
                });
            });


            return document;
        }


    }
}
