namespace NorthWind.Sales.Entities.Dtos.Search;
public class OrderResult
{
    public int OrderId { get; set; }
    public string CustomerId { get; set; } = default!;
    public CustomerResult CustomerR { get; set; }
    public string ShipAddress { get; set; }
    public string ShipCity { get; set; }
    public string ShipCountry { get; set; }
    public string ShipPostalCode { get; set; }
    public DateTime OrderDate { get; set; }

    public decimal Total { get; set; }
    public IEnumerable<OrderDetailResult> OrderDetailR { get; set; }
}
