namespace Microsoft.AspNetCore.Builder;
public static class GetCustomersController
{
    public static WebApplication UseGetCustomersController(this WebApplication app)
    {
        app.MapGet(EndPoints.GetCustomers, GetCustomers);
        return app;
    }

    public static async Task<IEnumerable<CustomerResult>> GetCustomers(
        [AsParameters] SearchRequest request,
        IGetCustomersInputPort inputPort,
        IGetCustomersOutputPort presenter)
    {
        await inputPort.Handle(request);
        return presenter.Customers;
    }
}
