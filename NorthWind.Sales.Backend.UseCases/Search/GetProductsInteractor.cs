namespace NorthWind.Sales.Backend.UseCases.Search;
internal class GetProductsInteractor(IGetProductsOutputPort outputPort, ISearchRepository repository) : IGetProductsInputPort
{
    public async Task Handle(SearchRequest request)
    {
        var result = await repository.GetProducts(request);
        await outputPort.Handle(result);
    }
}
