
using System.ComponentModel.DataAnnotations.Schema;

namespace NorthWind.Sales.Backend.BusinessObjects.POCOEntities;

public class Order
{
    public int Id { get; set; }
    public string CustomerId { get; set; }
    public Customer Customer { get; set; }
    public string ShipAddress   { get; set; }
    public string ShipCity { get; set; }
    public string ShipCountry { get; set; }
    public string ShipPostalCode { get; set; }

    public ShippingType ShippingType { get; set; } = ShippingType.Road;
    public DiscountType DiscountType { get; set; } = DiscountType.Percentage;
    public double Discount { get; set; } = 10;
    public DateTime OrderDate { get; set; } = DateTime.Now;

    // EF Core solo verá esta lista como ignorada
    public List<OrderDetail> Details { get; set; } = new();

    // Diccionario temporal para mapear productos por detalle
    [NotMapped] // EF Core ignorará esta propiedad
    public Dictionary<int, Product> DetailsProducts { get; set; } = new();
}