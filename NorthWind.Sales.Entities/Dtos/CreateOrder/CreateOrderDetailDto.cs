namespace NorthWind.Sales.Entities.Dtos.CreateOrder;


#region Primary Constructors c# 12

public class CreateOrderDetailDto(int productId, decimal unitPrice, short quantity)
{
    public int ProductId => productId;
    public decimal UnitPrice => unitPrice;
    public short Quantity => quantity;
}
#endregion


#region c# 2.0
//public class CreateOrderDetailDto
//{
//    private int _productId;
//    private decimal _unitPrice;
//    private short _quantity;

//    public CreateOrderDetailDto(int productId, decimal unitPrice, short quantity)
//    {
//        _productId = productId;
//        _unitPrice = unitPrice;
//        _quantity = quantity;

//    }

//    public int ProductId
//    {
//        get
//        {
//            return _productId;
//        }
//    }
//    public decimal UnitPrice
//    {
//        get
//        {
//            return _unitPrice;
//        }
//    }

//    public short Quantity
//    {
//        get
//        {
//            return _quantity;
//        }
//    }

//}

#endregion

#region Propiedades automáticas c# 3.0

//public class CreateOrderDetailDto
//{
//    public int ProductId { get; private set; }
//    public decimal UnitPrice { get; private set; }
//    public short Quantity { get; private set; }

//    public CreateOrderDetailDto(int productId, decimal unitPrice, short quantity)
//    {
//        ProductId = productId;
//        UnitPrice = unitPrice;
//        Quantity = quantity;
//    }
//}

#endregion