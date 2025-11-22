namespace NorthWind.Sales.Backend.DataContext.EFCore.Services;

// Esta clase implementa el Contexto de Datos lo que permite encapsular la 
// funcionalidad del contexto de datos de Entity Framework Core.
// Esto permitira remplazar Entity Framework Core por otro framework (Dapper, ADONET).
internal class NorthWindSalesCommandsDataContext(IOptions<DBOptions> dbOptions) :
    NorthWindSalesContext(dbOptions), INorthWindSalesCommandDataContext
{
    public async Task AddOrderAsync(Order order) => await AddAsync(order);    

    public  async Task AddOrderDetailsAsync(IEnumerable<OrderDetail> orderDetails) => 
        await AddRangeAsync(orderDetails);

    public async Task<int> GetNextOrderIdAsync()
    {
        await using var connection = Database.GetDbConnection();
        await connection.OpenAsync();

        await using var command = connection.CreateCommand();
        command.CommandText = "SELECT CAST(IDENT_CURRENT('Orders') AS INT) + 1";

        var result = await command.ExecuteScalarAsync();

        return Convert.ToInt32(result);
    }

    public async Task SaveChangesAsync() => await base.SaveChangesAsync();
}
