namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetOrdersOutputPort
{
    IEnumerable<OrderResult> Orders { get; }
    Task Handle(IEnumerable<OrderResult> orders);
}
