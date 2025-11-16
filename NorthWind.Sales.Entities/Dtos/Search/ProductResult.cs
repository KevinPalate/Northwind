namespace NorthWind.Sales.Entities.Dtos.Search;
public class ProductResult
{
    public int ProductId { get; set; }
    public string Name { get; set; } = default!;
    public decimal UnitPrice { get; set; }
    public int Stock { get; set; }
}
