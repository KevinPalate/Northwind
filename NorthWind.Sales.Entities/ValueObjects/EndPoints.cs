namespace NorthWind.Sales.Entities.ValueObjects;

public class EndPoints
{
    public const string CreateOrder = $"/{nameof(CreateOrder)}";
    //public const string DeteteOrder = $"/{nameof(DeteteOrder)}";
    //public const string UpdateOrder = $"/{nameof(UpdateOrder)}";
    public const string GetCustomers = $"/{nameof(GetCustomers)}";
    public const string GetProducts = $"/{nameof(GetProducts)}";
    public const string GetOrders = $"/{nameof(GetOrders)}";
    public const string GetNextOrderId = $"/{nameof(GetNextOrderId)}";
}
