namespace NorthWind.Sales.Backend.DataContext.EFCore.Options;

public class DBOptions
{
    // DBOptions se puede almacenar en el archivo de configuración Web:AppSettings.json 
    public const string SectionKey = nameof(DBOptions);
    public string ConnectionString { get; set; }
}
