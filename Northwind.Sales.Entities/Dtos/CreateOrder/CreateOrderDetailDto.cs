namespace Northwind.Sales.Entities.Dtos.CreateOrder;

//Primary Constructors c# 12
public class CreateOrderDetailDto(int productId, decimal unitPrice, short quantity)
{
    public int ProductId => productId;  
    public decimal UnitPrice => unitPrice;
    public short Quantity => quantity;
}

public class CreateOrderDetailDto2
{
    private int productId;
    private decimal unitPrice;
    private short quantity;

    public int ProductId { get { return productId; } }
    public decimal UnitPrice { get { return unitPrice; } }
    public short Quantity { get { return quantity; } }
}