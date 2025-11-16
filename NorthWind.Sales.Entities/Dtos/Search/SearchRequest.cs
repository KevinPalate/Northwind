namespace NorthWind.Sales.Entities.Dtos.Search;
public class SearchRequest
{
    // Texto para búsqueda (id, nombre, apellido, etc.)
    public string? Search { get; set; }

    // Opcional: paginación
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
