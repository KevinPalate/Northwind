namespace Northwind.Sales.Backend.BusinessObjects.ValueObjects;
/// <summary>
/// Los Value Objects: tienen dos caracteristicas principales
/// 1. No tienen identidad ni un ID
/// 2. Son inmutables
/// </summary>
/// <param name="productId"></param>
/// <param name="unitPrice"></param>
/// <param name="quantity"></param>
public class OrderDetail(int productId, decimal unitPrice, short quantity)
{
    //public int ProductId { get; } = productId;
    public int ProductId => productId; //propiedad de solo lectura
    public decimal UnitPrice => unitPrice;
    public short Quantity => quantity;
}
