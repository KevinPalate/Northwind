namespace NorthWind.Sales.Backend.Repositories.Interfaces;

// DataContext: El contexto de datos permitira agregar al repositorio una orden, el detalle
//              de la orden y guardar los datos utilizando el método: "SaveChangesAsync".
public interface INorthWindSalesCommandDataContext
{   
    // insert
    // delete
    // update
    // Insertar el encabezado de la orden
    Task AddOrderAsync(Order order);
    // Insertar el detalle de la orden
    Task AddOrderDetailsAsync(IEnumerable<Entities.OrderDetail> orderDetails);
    // Guardar los cambios en la fuente de datos
    Task SaveChangesAsync();
}
