namespace NorthWind.Sales.Backend.Presenters.Search;
public class GetOrdersPresenter : IGetOrdersOutputPort
{
    public IEnumerable<OrderResult> Orders { get; private set; }

    public Task Handle(IEnumerable<OrderResult> orders)
    {
        Orders = orders;
        return Task.CompletedTask;
    }
}
