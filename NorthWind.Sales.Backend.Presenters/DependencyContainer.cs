namespace NorthWind.Sales.Backend.Presenters;

//  Agregar el contenedor de dependencias (IoC)
//  Inversion de dependencias/Inyección de dependencias
public static class DependencyContainer
{
    public static IServiceCollection AddPresenters(this IServiceCollection services)
    {
        services.AddScoped<ICreateOrderOuputPort, CreateOrderPresenter>();
        services.AddScoped<IGetCustomersOutputPort, GetCustomersPresenter>();
        services.AddScoped<IGetProductsOutputPort, GetProductsPresenter>();
        services.AddScoped<IGetOrdersOutputPort, GetOrdersPresenter>();
        services.AddScoped<IGetNextOrderIdOutputPort, GetNextOrderIdPresenter>();

        // Retornar el contenedor de servicios
        return services;
    }
}
