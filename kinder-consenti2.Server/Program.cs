using kinder_consenti2.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
}); 

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// oporte para CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("https://localhost:5173") // Cambia esto según tus necesidades
                          .AllowAnyHeader()
                          .AllowAnyMethod());
});

builder.Services.AddDbContext<Concenti2pruebasContext>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("concenti2pruebaContex")));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseDefaultFiles();
app.UseStaticFiles();

// Usar CORS
app.UseCors("AllowSpecificOrigin");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("/index.html");

app.Run();
