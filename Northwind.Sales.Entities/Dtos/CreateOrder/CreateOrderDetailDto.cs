namespace Northwind.Sales.Entities.Dtos.CreateOrder;

#region Primary Constructors c# 12
public class CreateOrderDetailDto(int productId, decimal unitPrice, short quantity)
{
    public int ProductId => productId;
    public decimal UnitPrice => unitPrice;
    public short Quantity => quantity;
}
#endregion

#region c# 2.0
//public class createorderdetaildto
//{
//    private int _productid;
//    private decimal _quantity;
//    private short _unitprice;

//    public createorderdetaildto(int productid, decimal quantity, short unitprice)
//    {
//        _productid = productid;
//        _quantity = quantity;
//        _unitprice = unitprice;
//    }

//    public int productid { get { return _productid; } }
//    public decimal quantity { get { return _quantity; } }
//    public short unitprice { get { return _unitprice; } }
//}
#endregion

#region Propiedades automaticas c# 3.0
//public class CreateOrderDetailDto
//{
//    public int ProductId { get; private set; }
//    public short Quantity { get; private set; }
//    public decimal UnitPrice { get; private set; }

//    public CreateOrderDetailDto(int productId, decimal unitPrice, short quantity)
//    {
//        ProductId = productId;
//        Quantity = quantity;
//        UnitPrice = unitPrice;
//    }
//}
#endregion
