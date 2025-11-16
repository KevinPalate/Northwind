namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Repositories;
public interface ISearchRepository
{
    Task<IEnumerable<CustomerResult>> GetCustomers(SearchRequest request);
    Task<IEnumerable<ProductResult>> GetProducts(SearchRequest request);
    Task<IEnumerable<OrderResult>> GetOrders(SearchRequest request);
}
