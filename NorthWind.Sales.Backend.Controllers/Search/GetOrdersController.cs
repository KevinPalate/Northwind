namespace Microsoft.AspNetCore.Builder;
public static class GetOrdersController
{
    public static WebApplication UseGetOrdersController(this WebApplication app)
    {
        app.MapGet(EndPoints.GetOrders, GetOrders);
        return app;
    }

    public static async Task<IEnumerable<OrderResult>> GetOrders(
        [AsParameters] SearchRequest request,
        IGetOrdersInputPort inputPort,
        IGetOrdersOutputPort presenter)
    {
        await inputPort.Handle(request);
        return presenter.Orders;
    }
}
