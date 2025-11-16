namespace NorthWind.Sales.Backend.Repositories.Entities;

// Entidad-modelo de datos que representa el detalle de la orden
// Entidades para comunicarnos con el ORM (Entity Framework, Dapper, ADONET)
public class OrderDetail
{
    public int OrderId { get; set; }
    //   La propiedad "Order" permite establecer la relación entre una orden
    //   y su detalle. 
    //public Order order { get; set; }
    public Order Order { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; }
    public decimal UnitPrice { get; set; }
    public short Quantity { get; set; }

    public OrderDetail() { }
    public OrderDetail(int productId, decimal unitPrice, short quantity) 
    {
        ProductId = productId;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }
}
