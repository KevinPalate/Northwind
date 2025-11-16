namespace NorthWind.Sales.Backend.BusinessObjects.ValueObjects;

/// <summary>
/// Los Value Objects: tienen 2 caracteristicas principales:
/// - No tienen identidad.
/// - Son inmutables (readOnly).
/// </summary>
/// <param name="productId"></param>
/// <param name="unitPrice"></param>
/// <param name="quantity"></param>
//public class OrderDetail (int productId, decimal unitPrice, short quantity)
//{
//    //public int ProductId { get; } = productId;
//    public int ProductId => productId;
//    public decimal UnitPrice => unitPrice;
//    public short Quantity => quantity;
//}

public class OrderDetail
{
    public int ProductId { get; }
    public decimal UnitPrice { get; }
    public short Quantity { get; }

    public OrderDetail(int productId, decimal unitPrice, short quantity)
    {
        ProductId = productId;
        UnitPrice = unitPrice;
        Quantity = quantity;
    }
}
