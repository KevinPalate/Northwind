namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetCustomersOutputPort
{
    IEnumerable<CustomerResult> Customers { get; }
    Task Handle(IEnumerable<CustomerResult> customers);
}
