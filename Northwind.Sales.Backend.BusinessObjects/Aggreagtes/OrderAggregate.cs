namespace Northwind.Sales.Backend.BusinessObjects.Aggreagtes;

/// <summary>
/// Un agregado es un grupo de objetos de dominio que puede ser tratados como una unidad.
/// Por ejemplo: Una orden con el detalle
/// </summary>
public class OrderAggregate : Order
{
    //Encabezado de la orden
    //public Order order;

    //Un auxiliar para el Detalle de la orden
    // Collection Expressions: C# 12 y permite inicializar la coleccion
    readonly List<OrderDetail> OrderDetailsField = [];
    public IReadOnlyCollection<OrderDetail> OrderDetails => OrderDetailsField;
    //Si en la orden se especifican productos con el mismo identificador de producto, solo se agregara un producto con ese
    //mismo identificador y la cantidad registrada sera la suma de las cantidades de los productos con el mismo identificador
    public void AddDetail(int productId, decimal unitPrice, short quantity)
    {
        var ExistingOrderDetail = OrderDetailsField.FirstOrDefault(o => o.ProductId == productId);
        if (ExistingOrderDetail != default)
        {
            quantity += ExistingOrderDetail.Quantity;
            OrderDetailsField.Remove(ExistingOrderDetail);
        }
        OrderDetailsField.Add(new OrderDetail(productId, unitPrice, quantity));
    }

    public static OrderAggregate From(CreateOrderDto orderDto)
    {
        // Collection Expressions: C# 12 y permite inicializar la coleccion
        OrderAggregate orderAggregate = new OrderAggregate
        {
            CustomerId = orderDto.CustomerId,
            ShipAddress = orderDto.ShipAddress,
            ShipCity = orderDto.ShipCity,
            ShipCountry = orderDto.ShipCountry,
            ShipPostalCode = orderDto.ShipPostalCode,
        };
        foreach (var item in orderDto.OrderDetails)
        {
            //Si en la orden se especifican productos con el mismo identificador de producto, solo se agregara un producto con ese
            //mismo identificador y la cantidad registrada sera la suma de las cantidades de los productos con el mismo identificador
            orderAggregate.AddDetail(item.ProductId, item.UnitPrice, item.Quantity);
        }
        return orderAggregate;
    }
}
