namespace NorthWind.Sales.Backend.UseCases;

//  Agregar el contenedor de dependencias (IoC)
//  Inversion de dependencias/Inyección de dependencias
public static class DependencyContainer
{
    // Debido a que hemos creada un servicio/funcionalidad (ICreateOrderInputPort), debemos crear
    // el codigo que permita el REGISTRO de la implementación en el contenedor de dependencias
    // "Microsoft.Extensions.DependencyInjection". "ServiceCollection".


    // Una tecnica para facilitar el registro de dependencias es crear una CLASE ESTATICA que 
    // exponga (tenga) un MÉTODO DE EXTENSIÓN que tambien debe ser estatico de tipo IServiceCollection
    // donde se deben registrar los servicios (funcionalidades) implementados.
    // Posteriormente, el cliente podrá invocar a este método para registrar los servicios en el 
    // contenedor de dependencias.
    public static IServiceCollection AddUseCaseServices(this IServiceCollection services)
    {

        // Se envia una interfaz: "ICreateOrderInputPort"
        // y el segundo parametro debe ser la clase que implementa la interfaz suministrada.
        // con el contenedor de dependencias hace lo siguiente:
        //        1) Regresa una instancia de la clase: CreateOrderInteractor
        //        2) Administra y gestiona el ciclo de vida de la instancia (CreateOrderInteractor)
        // Agrega el servicio
        //services.AddSingleton
        //services.AddTransient

        services.AddScoped<ICreateOrderInputPort, CreateOrderInteractor>();
        services.AddScoped<IGetCustomersInputPort, GetCustomersInteractor>();
        services.AddScoped<IGetProductsInputPort, GetProductsInteractor>();
        services.AddScoped<IGetOrdersInputPort, GetOrdersInteractor>();

        return services;
    }
}
