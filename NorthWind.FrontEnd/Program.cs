namespace NorthWind.FrontEnd;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var app = builder.Build();

        app.UseStaticFiles(); // Permite servir archivos en wwwroot

        app.MapFallbackToFile("index.html");

        app.Run();
    }
}
