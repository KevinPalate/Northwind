namespace NorthWind.Sales.Backend.Repositories;

public static class DependencyContainer
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        // Interfaz: ICommandsRepository
        // Clase que implementa la interfaz: CommandsRepository
        services.AddScoped<ICommandsRepository, CommandsRepository>();
        services.AddScoped<ISearchRepository, SearchRepository>();

        // Agregar el servicio al contenedor de dependencias
        return services;
    }
}
