namespace NorthWind.Sales.Backend.UseCases.Search;
internal class GetOrdersInteractor(IGetOrdersOutputPort outputPort, ISearchRepository repository) : IGetOrdersInputPort
{
    public async Task Handle(SearchRequest request)
    {
        var result = await repository.GetOrders(request);
        await outputPort.Handle(result);
    }
}
