namespace NorthWind.Sales.Backend.Ioc;

public static class DependencyContainer
{
    public static IServiceCollection AddNorthWindDependencies(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Lee DBOptions del appsettings
        services.Configure<DBOptions>(configuration.GetSection(DBOptions.SectionKey));

        // Agrega los DataContexts
        services.AddDataContexts(options =>
        {
            configuration.GetSection(DBOptions.SectionKey).Bind(options);
        });

        return services;
    }
}
