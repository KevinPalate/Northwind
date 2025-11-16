namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetProductsInputPort
{
    Task Handle(SearchRequest request);
}
