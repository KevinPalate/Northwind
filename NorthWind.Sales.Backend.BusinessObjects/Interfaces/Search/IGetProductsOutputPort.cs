namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetProductsOutputPort
{
    IEnumerable<ProductResult> Products { get; }
    Task Handle(IEnumerable<ProductResult> products);
}
