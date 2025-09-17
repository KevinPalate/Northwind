namespace Northwind.Sales.Backend.BusinessObjects.Interfaces.CreateOrder;
/// <summary>
/// El OutputPort del caso de uso (CreateOrder) es una abstraccion que permite al INTERACTOR
/// devolover el resultado del caso de uso (CreateOrder) a un elementyo de la capa esxterna (Presenter).
/// En terminos de POO, el OutPortPort puede ser definido usando una interface o unqa clase abstracta
/// y que el PRESENTER debe/tiene implementar y ell INTERACTOR debe/tiene que utilizar.
/// El OutPortPort que se define a continuacion recibe una instancia de la orden que se vaya a agregado.
/// la funcion PRESENTER es la de covertir los datos del formato mas conveniente para
/// los "Casos de uso y entidades", y tambien convierte el formato mas conveniente para algun
/// agente externo como: la base de datos, una pagina web,  app movil, app  de escritorio, web API.
/// Para el ejemplo (CreateOrder) el PRESENTER simplemente va devolviendo el Id (OrderId) de la 
/// orden creada.
/// </summary>
public interface ICreateOrderOutputPort
{
    //Retornar el numero de orden creado que lo utiliza el Presentar
    int OrderId { get; }
    Task Handle(OrderAggregate addedOrder);
}
