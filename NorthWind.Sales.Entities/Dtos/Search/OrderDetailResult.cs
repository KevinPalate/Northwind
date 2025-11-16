namespace NorthWind.Sales.Entities.Dtos.Search;
public class OrderDetailResult
{
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public ProductResult Product { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal SubTotal { get; set; }
}