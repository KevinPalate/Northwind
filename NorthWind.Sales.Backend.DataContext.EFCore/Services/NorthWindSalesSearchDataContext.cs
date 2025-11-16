namespace NorthWind.Sales.Backend.DataContext.EFCore.Services;
internal class NorthWindSalesSearchDataContext(IOptions<DBOptions> dbOptions) :
    NorthWindSalesContext(dbOptions), INorthWindSalesSearchDataContext
{
    // ============================
    // CLIENTES
    // ============================

    public async Task<Customer?> GetCustomerByIdAsync(string customerId) =>
        await Customers
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.CustomerId == customerId);

    public Task<IEnumerable<Customer>> GetCustomersAsync() =>
        Task.FromResult(
            Customers
                .AsNoTracking()
                .AsEnumerable()
        );

    public Task<IEnumerable<Customer>> SearchCustomersAsync(string filter)
    {
        filter = filter.ToLower();

        return Task.FromResult(
            Customers
                .AsNoTracking()
                .Where(c =>
                    c.FirstName.ToLower().Contains(filter) ||
                    c.LastName.ToLower().Contains(filter) ||
                    c.CustomerId.ToString().Contains(filter) ||
                    c.Email.ToLower().Contains(filter))
                .AsEnumerable()
        );
    }

    // ============================
    // PRODUCTOS
    // ============================

    public async Task<Product?> GetProductByIdAsync(int productId) =>
        await Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProductId == productId);

    public Task<IEnumerable<Product>> GetProductsAsync() =>
        Task.FromResult(
            Products
                .AsNoTracking()
                .AsEnumerable()
        );

    public Task<IEnumerable<Product>> SearchProductsAsync(string filter)
    {
        filter = filter.ToLower();

        int? filterId = null;
        if (int.TryParse(filter, out int parsedId))
            filterId = parsedId;

        return Task.FromResult(
            Products
                .AsNoTracking()
                .Where(p =>
                    p.Name.ToLower().Contains(filter) ||
                    (filterId.HasValue && p.ProductId == filterId.Value))
                .AsEnumerable()
        );
    }

    // ============================
    // ÓRDENES  
    // ============================
    // Obtener una orden por Id
    public async Task<Order?> GetOrderByIdAsync(int orderId)
    {
        var order = await Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return null;

        // Cargar los detalles manualmente
        var details = await OrderDetails
            .Where(d => d.OrderId == order.Id)
            .Select(d => new NorthWind.Sales.Backend.BusinessObjects.ValueObjects.OrderDetail(
                d.ProductId,
                d.UnitPrice,
                d.Quantity
            ))
            .ToListAsync();

        order.Details = details;

        return order;
    }

    // Obtener todas las órdenes
    public async Task<IEnumerable<Order>> GetOrdersAsync()
    {
        var orders = await Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .ToListAsync();
        // Cargar los detalles de cada orden con datos del producto
        foreach (var order in orders)
        {
            var details = await OrderDetails
                .Where(d => d.OrderId == order.Id)
                .Join(Products,
                      od => od.ProductId,
                      p => p.ProductId,
                      (od, p) => new
                      {
                          OrderDetail = new NorthWind.Sales.Backend.BusinessObjects.ValueObjects.OrderDetail(
                              od.ProductId,
                              od.UnitPrice,
                              od.Quantity
                          ),
                          Product = p
                      })
                .ToListAsync();

            // Asignar los Value Objects a la orden
            order.Details = details.Select(d => d.OrderDetail).ToList();

            // Guardar los productos en una propiedad temporal de la orden para mapear luego
            order.DetailsProducts = details.ToDictionary(d => d.OrderDetail.ProductId, d => d.Product);
        }

        // Cargar los detalles de cada orden
        //foreach (var order in orders)
        //{
        //    var details = await OrderDetails
        //       .Where(d => d.OrderId == order.Id)
        //       .Select(d => new NorthWind.Sales.Backend.BusinessObjects.ValueObjects.OrderDetail(
        //           d.ProductId,
        //           d.UnitPrice,
        //           d.Quantity
        //       ))
        //       .ToListAsync();

        //    order.Details = details;
        //}

        return orders;
    }

    // Buscar órdenes por filtro
    public async Task<IEnumerable<Order>> SearchOrdersAsync(string filter)
    {
        filter = filter.ToLower();

        var orders = await Orders
            .AsNoTracking()
            .Include(o => o.Customer)
            .Where(o =>
                o.Id.ToString().Contains(filter) ||
                o.CustomerId.ToString().Contains(filter) ||
                o.ShipCity.ToLower().Contains(filter))
            .ToListAsync();

        // Cargar los detalles de cada orden con datos del producto
        foreach (var order in orders)
        {
            var details = await OrderDetails
                .Where(d => d.OrderId == order.Id)
                .Join(Products,
                      od => od.ProductId,
                      p => p.ProductId,
                      (od, p) => new
                      {
                          OrderDetail = new NorthWind.Sales.Backend.BusinessObjects.ValueObjects.OrderDetail(
                              od.ProductId,
                              od.UnitPrice,
                              od.Quantity
                          ),
                          Product = p
                      })
                .ToListAsync();

            // Asignar los Value Objects a la orden
            order.Details = details.Select(d => d.OrderDetail).ToList();

            // Guardar los productos en una propiedad temporal de la orden para mapear luego
            order.DetailsProducts = details.ToDictionary(d => d.OrderDetail.ProductId, d => d.Product);
        }

        //foreach (var order in orders)
        //{
        //    var details = await OrderDetails
        //        .Where(d => d.OrderId == order.Id)
        //        .Select(d => new NorthWind.Sales.Backend.BusinessObjects.ValueObjects.OrderDetail(
        //            d.ProductId,
        //            d.UnitPrice,
        //            d.Quantity
        //        ))
        //        .ToListAsync();

        //    order.Details = details;

        //}

        return orders;
    }

}