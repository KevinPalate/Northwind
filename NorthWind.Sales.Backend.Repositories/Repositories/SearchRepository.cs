using NorthWind.Sales.Backend.BusinessObjects.POCOEntities;

namespace NorthWind.Sales.Backend.Repositories.Repositories;
internal class SearchRepository(INorthWindSalesSearchDataContext context) : ISearchRepository
{
    // ============================================
    // CLIENTES
    // ============================================
    public async Task<IEnumerable<CustomerResult>> GetCustomers(SearchRequest request)
    {
        IEnumerable<Customer> customers;

        if (string.IsNullOrWhiteSpace(request.Search))
        {
            customers = await context.GetCustomersAsync();
        }
        else
        {
            customers = await context.SearchCustomersAsync(request.Search);
        }

        // paginación
        customers = customers
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize);

        return customers.Select(c => new CustomerResult
        {
            CustomerId = c.CustomerId,
            FirstName = c.FirstName,
            LastName = c.LastName,
            Address = c.Address,
            Email = c.Email,
            PhoneNumber = c.PhoneNumber
        });
    }


    // ============================================
    // PRODUCTOS
    // ============================================
    public async Task<IEnumerable<ProductResult>> GetProducts(SearchRequest request)
    {
        IEnumerable<Product> products;

        if (string.IsNullOrWhiteSpace(request.Search))
        {
            products = await context.GetProductsAsync();
        }
        else
        {
            products = await context.SearchProductsAsync(request.Search);
        }

        // paginación
        products = products
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize);

        return products.Select(p => new ProductResult
        {
            ProductId = p.ProductId,
            Name = p.Name,
            UnitPrice = p.UnitPrice,
            Stock = p.Stock
        });
    }


    // ============================================
    // ÓRDENES / FACTURAS
    // ============================================
    public async Task<IEnumerable<OrderResult>> GetOrders(SearchRequest request)
    {
        IEnumerable<Order> orders;

        // Obtener órdenes según búsqueda
        if (string.IsNullOrWhiteSpace(request.Search))
        {
            orders = await context.GetOrdersAsync();
        }
        else
        {
            orders = await context.SearchOrdersAsync(request.Search);
        }

        // Paginación
        orders = orders
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize);

        // Proyección LINQ → DTO (Opción 1)
        return orders.Select(o => new OrderResult
        {
            OrderId = o.Id,
            CustomerId = o.Customer.CustomerId,
            CustomerR = new CustomerResult
            {
                CustomerId = o.Customer.CustomerId,
                FirstName = o.Customer.FirstName,
                LastName = o.Customer.LastName,
                Address = o.Customer.Address,
                Email = o.Customer.Email,
                PhoneNumber = o.Customer.PhoneNumber,
            },
            ShipAddress = o.ShipAddress,
            ShipCity = o.ShipCity,
            ShipCountry = o.ShipCountry,
            ShipPostalCode = o.ShipPostalCode,
            OrderDate = o.OrderDate,
            Total = o.Details.Sum(d => d.UnitPrice * d.Quantity), //Calculado
            OrderDetailR = o.Details
            .Select(d => new OrderDetailResult
            {
                OrderId = o.Id,
                ProductId = d.ProductId,
                UnitPrice = d.UnitPrice,
                Quantity = d.Quantity,
                SubTotal = d.UnitPrice * d.Quantity, //Calculado
                Product = new ProductResult
                {
                    ProductId = o.DetailsProducts[d.ProductId].ProductId,
                    Name = o.DetailsProducts[d.ProductId].Name,
                    UnitPrice = o.DetailsProducts[d.ProductId].UnitPrice,
                    Stock = o.DetailsProducts[d.ProductId].Stock
                }
            }).ToList()
        });
    }
}
