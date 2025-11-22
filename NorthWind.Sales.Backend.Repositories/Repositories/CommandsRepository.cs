namespace NorthWind.Sales.Backend.Repositories.Repositories;

internal class CommandsRepository(INorthWindSalesCommandDataContext context) : ICommandsRepository
{
    // Agregar/Crear la orden al repositorio usando el Contexto de Datos
    public async Task CreateOrder(OrderAggregate order)
    {
        // agregar el encabezado
        await context.AddOrderAsync(order);

        // agregar el detalle (LINQ)
        await context.AddOrderDetailsAsync(
            order.OrderDetails
            .Select(d => new Entities.OrderDetail
            {               
                Order = order,
                ProductId = d.ProductId,
                Quantity = d.Quantity,
                UnitPrice = d.UnitPrice 
            }).ToArray()); 
    }

    // Obtener el Id de la factura
    public async Task<int> GetNextOrderIdAsync() => await context.GetNextOrderIdAsync();

    // Realizar la persistencia usando el Contenxto de Datos
    public async Task SaveChanges() => await context.SaveChangesAsync();    
}

