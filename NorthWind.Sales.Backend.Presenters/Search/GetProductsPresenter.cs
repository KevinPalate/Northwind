namespace NorthWind.Sales.Backend.Presenters.Search;
public class GetProductsPresenter : IGetProductsOutputPort
{
    public IEnumerable<ProductResult> Products { get; private set; }

    public Task Handle(IEnumerable<ProductResult> products)
    {
        Products = products;
        return Task.CompletedTask;
    }
}
