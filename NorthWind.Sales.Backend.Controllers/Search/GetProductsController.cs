namespace Microsoft.AspNetCore.Builder;
public static class GetProductsController
{
    public static WebApplication UseGetProductsController(this WebApplication app)
    {
        app.MapGet(EndPoints.GetProducts, GetProducts);
        return app;
    }

    public static async Task<IEnumerable<ProductResult>> GetProducts(
        [AsParameters] SearchRequest request,
        IGetProductsInputPort inputPort,
        IGetProductsOutputPort presenter)
    {
        await inputPort.Handle(request);
        return presenter.Products;
    }
}
