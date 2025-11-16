namespace NorthWind.Sales.Backend.Repositories.Interfaces;
// DataContext exclusivo para consultas (lectura)
public interface INorthWindSalesSearchDataContext
{
    // =======================
    // CLIENTES
    // =======================
    Task<IEnumerable<Customer>> GetCustomersAsync();
    Task<Customer?> GetCustomerByIdAsync(string customerId);
    Task<IEnumerable<Customer>> SearchCustomersAsync(string filter);


    // =======================
    // PRODUCTOS
    // =======================
    Task<IEnumerable<Product>> GetProductsAsync();
    Task<Product?> GetProductByIdAsync(int productId);
    Task<IEnumerable<Product>> SearchProductsAsync(string filter);


    // =======================
    // ÓRDENES / FACTURAS
    // =======================
    Task<IEnumerable<Order>> GetOrdersAsync();
    Task<Order?> GetOrderByIdAsync(int orderId);
    Task<IEnumerable<Order>> SearchOrdersAsync(string filter);
}
