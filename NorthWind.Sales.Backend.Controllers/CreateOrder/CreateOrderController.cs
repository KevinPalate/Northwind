//using Microsoft.AspNetCore.Builder;
namespace Microsoft.AspNetCore.Builder;

// namespace Microsoft.AspNetCore.Builder: permite colocar a la clase  "CreateOrderController"
//           en el namespace "Microsoft.AspNetCore.Builder;"
// namespace: permite evitar el uso de la sentencia "using" en el código que consuma la 
//            clase: "CreateOrderController"

//namespace NorthWind.Sales.Backend.Controllers.CreateOrder;

public static class CreateOrderController
{
    // La clase extiende la funcionalidad de la clase: "WebApplication" para registrar
    // los "endpoints" de la aplicación.
    // Este método utiliza "envuelve" el método "CreateOrder" que es el método que invoca
    // al método "Handle" del "inputPort" y devulve el resultado desde el presenter
    // Este método podrá ser utilizado "consumido" por un cliente remoto a traves de la API Web

    public static WebApplication UseCreateOrderController(this WebApplication app)
    {
        // CreateOrder: helper
        // Minimal APIs
        app.MapPost(EndPoints.CreateOrder, CreateOrder);
        //app.MapPost("/CreateOrder", CreateOrder);
        return app;
    }

    // Este método podra ser utilizado "consumido" por un cliente de escritorio o un backend
    // pero solo que tenga tecnologia ".NET" por ejemplo una aplicación "MVC".
    public static async Task<int> CreateOrder(CreateOrderDto orderDto, ICreateOrderInputPort inputPort, ICreateOrderOuputPort presenter)
    {
        await inputPort.Handle(orderDto);
        return presenter.OrderId;
    }
}
