namespace NorthWind.Sales.Backend.UseCases.Search;
internal class GetCustomersInteractor(IGetCustomersOutputPort outputPort, ISearchRepository repository) : IGetCustomersInputPort
{
    public async Task Handle(SearchRequest request)
    {
        var result = await repository.GetCustomers(request);
        await outputPort.Handle(result);
    }
}
