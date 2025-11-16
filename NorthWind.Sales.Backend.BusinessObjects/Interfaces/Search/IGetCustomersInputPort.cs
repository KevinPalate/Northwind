namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetCustomersInputPort
{
    Task Handle(SearchRequest request);
}
