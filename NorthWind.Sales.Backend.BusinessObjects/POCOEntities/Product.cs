namespace NorthWind.Sales.Backend.BusinessObjects.POCOEntities;
public class Product
{
    public int ProductId { get; set; }
    public string Name { get; set; }
    public decimal UnitPrice { get; set; }
    public int Stock { get; set; }
}