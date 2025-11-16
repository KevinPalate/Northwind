namespace NorthWind.Sales.Backend.Presenters.Search;
internal class GetCustomersPresenter : IGetCustomersOutputPort
{
    public IEnumerable<CustomerResult> Customers { get; private set; }
    public Task Handle(IEnumerable<CustomerResult> customers)
    {
        Customers = customers;
        return Task.CompletedTask;
    }
}
