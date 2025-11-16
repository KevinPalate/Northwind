namespace NorthWind.Sales.Backend.DataContext.EFCore;

//namespace Microsoft.Extensions.DependencyInjection;
public static class DependencyContainer
{
    public static IServiceCollection AddDataContexts(this IServiceCollection services, Action<DBOptions> configureDBOptions)
    {
        services.Configure(configureDBOptions);

        services.AddScoped<INorthWindSalesCommandDataContext, NorthWindSalesCommandsDataContext>();
        services.AddScoped<INorthWindSalesSearchDataContext, NorthWindSalesSearchDataContext>();

        return services;
    }
}
