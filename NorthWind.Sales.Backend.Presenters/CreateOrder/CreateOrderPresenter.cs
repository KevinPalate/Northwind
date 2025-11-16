namespace NorthWind.Sales.Backend.Presenters.CreateOrder;

// La función del Presenter es la de convertir los datos del formato
// más conveniente (requerido) por los casos de uso (Use Cases)
// y entidades (Entities), al formato más conveniente (requerido)
// por algun agente externo como por ejempo la base de datos o una pagina web.
internal class CreateOrderPresenter : ICreateOrderOuputPort
{
    // regresar el Id de la orden
    public int OrderId { get; private set; }

    public Task Handle(OrderAggregate addedOrder)
    {
        // propiedad de escritura (private)
        OrderId = addedOrder.Id;

        // tarea completada
        return Task.CompletedTask;
    }
}
// El "Interactor" del caso de uso invocara al método "Handle" definido "IMPLEMENTA"
// en la interfaz "ICreateOrderOuputPort" para enviar el resultado del caso de uso.
// El "Presenter" en este caso únicamente almacenará el valor recibido para que después
// sea obtenido por el "Controlador".
// En esta de uso especifico "NO SE REQUIERE" de alguna transformación del resultado, por ejemplo
// que se convierta a un formato especifico como por ejemplo a un formato JSON, XML o algún otro
// formato.

