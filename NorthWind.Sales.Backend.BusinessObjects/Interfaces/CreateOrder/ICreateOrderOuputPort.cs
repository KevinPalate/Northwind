namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.CreateOrder;

/// <summary>
/// El OutputPort del caso de uso (CreateOrder) es una abstracción que permite al INTERACTOR
/// devolver el resultado del caso de uso (CreateOrder) a un elemento de la capa externa (Presenter).
/// En terminos de POO, el OutputPort puede ser definado usando uan interface o una clase abstracta
/// y que el PRESENTER debe/tiene implementar y el INTERACTOR debe/tiene que utilizar.
/// El OutputPort que se difine a continuacíón recibe una instancia de la orden que se vaya 
/// a agregar.
/// La función de PRESENTER es la de convertir los datos del formato mas conveniente para 
/// los "Casos de uso y entidades", y tambien convierte al formato más conveniente para algún
/// agente externo como: la base de datos, una pagina web, app movil, app de escritorio, web API.
/// Para el ejemplo (CreateOrder) el PRESENTER simplemente va a devolver el id (OrderId) de la 
/// orden creada
/// </summary>
public interface ICreateOrderOuputPort
{
    // Retornar el numero de orden creado que lo utiliza el Presentar
    int OrderId { get; }
    Task Handle(OrderAggregate addedOrder);
}
