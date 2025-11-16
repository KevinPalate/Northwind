namespace NorthWind.Sales.Entities.Dtos.Search;
public class CustomerResult
{
    public string CustomerId { get; set; } = default!;
    public string FirstName { get; set; } = default!;
    public string LastName { get; set; } = default!;
    public string Address { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
}
