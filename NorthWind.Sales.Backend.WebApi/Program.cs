using NorthWind.Sales.Backend.Ioc;
using NorthWind.Sales.Backend.UseCases;
using NorthWind.Sales.Backend.Presenters;
using NorthWind.Sales.Backend.Repositories;

namespace NorthWind.Sales.Backend.WebApi;

public class Program
{
    public static void Main(string[] args)
    {


        var builder = WebApplication.CreateBuilder(args);

        // -------------------------------
        // Configurar servicios y dependencias
        // -------------------------------

        // Configura DBOptions desde appsettings.json
        builder.Services.AddNorthWindDependencies(builder.Configuration);

        // Agrega UseCases y Presenters
        builder.Services.AddUseCaseServices();  // CreateOrderInteractor
        builder.Services.AddRepositories();     // CommandsRepository
        builder.Services.AddPresenters();       // CreateOrderPresenter

        // Agregar controladores con opciones JSON
        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.IncludeFields = true; // Para campos públicos
                options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // Ignorar mayúsculas/minúsculas
            });

        // Swagger para documentación de la API
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Configuración de CORS
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                policy.AllowAnyOrigin()
                      .AllowAnyMethod()
                      .AllowAnyHeader();
            });
        });

        var app = builder.Build();

        // -------------------------------
        // Middleware y pipeline
        // -------------------------------

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors();

        // Mapear Minimal API
        app.UseCreateOrderController();
        app.UseGetCustomersController();
        app.UseGetProductsController();
        app.UseGetOrdersController();
        app.UseGetNextIdOrderController();


        // Mapear controladores si los agregas después
        app.MapControllers();


        app.Run();
    }
}
