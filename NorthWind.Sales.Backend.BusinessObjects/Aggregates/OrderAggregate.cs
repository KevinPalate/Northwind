//using NorthWind.Sales.Backend.BusinessObjects.POCOEntities;
//using NorthWind.Sales.Backend.BusinessObjects.ValueObjects;
//using NorthWind.Sales.Entities.Dtos.CreateOrder;

namespace NorthWind.Sales.Backend.BusinessObjects.Aggregates;

/// <summary>
/// Un agregado es un grupo de objetos de dominio que puede ser 
/// tratados como una unidad. Por ejemplo: Una orden con el detalle.
/// </summary>
public class OrderAggregate : Order
{
    // Encabezado de la orden
    //public Order order;

    // Un auxliar para el Detalle de la orden
    // Collection Expressions: C# 12 y permite inicializar la coleccion
    readonly List<OrderDetail> OrderDetailsField = [];
    // Detalle de la orden
    public IReadOnlyCollection<OrderDetail> OrderDetails => OrderDetailsField;

    // Si en la orden se especifican productos con el mismo identificador de
    // producto, solo se agregará un producto con ese identificador y la cantidad
    // registrada será la suma de las cantidades de los productos con el mismo identificador.
    public void AddDetail(int producId, decimal unitPrice,  short quantity)
    {
        var ExistingOrderDetail = OrderDetailsField.FirstOrDefault(o => o.ProductId == producId);

        if (ExistingOrderDetail != default)
        {
            quantity += ExistingOrderDetail.Quantity;
            OrderDetailsField.Remove(ExistingOrderDetail);
        }

        OrderDetailsField.Add(new OrderDetail(producId, unitPrice, quantity));
    }

    public static OrderAggregate From(CreateOrderDto orderDto)
    {
        
        OrderAggregate OrderAggregate = new OrderAggregate
        { 
            CustomerId = orderDto.CustomerId,
            ShipAddress = orderDto.ShipAddress,
            ShipCity = orderDto.ShipCity,
            ShipCountry = orderDto.ShipCountry,
            ShipPostalCode = orderDto.ShipPostalCode,
        };

        foreach (var item in orderDto.OrderDetails)
        {
            // Si en la orden se especifican productos con el mismo identificador de
            // producto, solo se agregará un producto con ese identificador y la cantidad
            // registrada será la suma de las cantidades de los productos con el mismo identificador.
            OrderAggregate.AddDetail(item.ProductId, item.UnitPrice, item.Quantity);
        }

        return OrderAggregate;
    }
}
