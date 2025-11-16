namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetOrdersInputPort
{
    Task Handle(SearchRequest request);
}
