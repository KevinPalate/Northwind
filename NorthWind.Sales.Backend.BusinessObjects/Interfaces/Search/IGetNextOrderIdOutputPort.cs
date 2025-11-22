namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Search;
public interface IGetNextOrderIdOutputPort
{
    int NextOrderId { get; }
    Task Handle(GetNextOrderIdResponse response);
}
