namespace Northwind.Sales.Backend.BusinessObjects.Interfaces.Repositories;
/// <summary>
/// El patron "Repository" es un patron de diseño de software que utiliza con fuente de datos.
/// Este patron permite SEPARAR la logica de negocios de la logica de acceso/recuperacion de datos
/// y los asigna a un modelo de entidad (EntityFramework Core, ADONET, Dapper).
/// Un "Repository" es una capa intermedia entre lla capa de dominio (Uses Cases) y las capas de 
/// mapeo de datos y actua como un intermediario  como una coleccion de objetos en memoria de la PC.
/// La implementacion un "Repository" en una clase que permite ocultar la logica necesaria almacenar
/// (Insert, Delete, Update) o recuperar datos (Select). por lo tanto al actualizar el 
/// patron "Repository" a la aplicacion no le importa que tipo de ORM se utilice ya que todo lo
/// relacionado con el uso de un ORM se maneja dentro de la capa del "Repository".
/// Esto permite tener una separacion mas limpia de responsabilidades.
/// </summary>
public interface ICommandsRepository : IUnitOfWork
{
    Task CreateOrder(OrderAggregate order);
    //Task InserOrder(OrderAggregate order);
    //Task DeleteOrder(OrderAggregate order);
    //Task UpdateOrder(OrderAggregate order);
}
