namespace Microsoft.AspNetCore.Builder;
public static class GetNextOrderIdController
{
    public static WebApplication UseGetNextIdOrderController(this WebApplication app)
    {
        app.MapGet(EndPoints.GetNextOrderId, GetNextOrderId);
        return app;
    }

    public static async Task<int> GetNextOrderId(
        IGetNextOrderIdInputPort inputPort,
        IGetNextOrderIdOutputPort presenter)
    {
        await inputPort.Handle();
        return presenter.NextOrderId;
    }
}
