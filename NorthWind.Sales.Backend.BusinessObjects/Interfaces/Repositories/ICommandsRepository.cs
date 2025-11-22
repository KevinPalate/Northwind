//using NorthWind.Sales.Backend.BusinessObjects.Interfaces.Common;

namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.Repositories;

/// <summary>
/// El patrón "Repository" es un patrón de diseño de software que utiliza con fuente de datos.
/// Este patrón permite SEPARAR la lógica de negocios de la lógica de acceso/recuperación de datos
/// y los asigna a un modelo de entidad (EntityFramework Core, ADONET, Dapper).
/// Un "Repository" es una capa intermedia entre la capa de dominio (Uses Cases) y las capas de 
/// mapeo de datos y actua como una intermediario omo una colección de objetos en memoria de la PC.
/// La implementación de un "Repository" es una clase que permite ocultar la lógica necesaria
/// almacenar (Insert, Delete, Update) o recuperar datos (Select). Por lo tanto al utilizar el 
/// patrón "Repository" a la aplicación no le importa que tipo de ORM se utilice ya que todo lo 
/// relacionado con el uso de un ORM se maneja dentro de la capa del "Repository".
/// Esto permite tener una separación mas limpia de responsabilidades.
/// </summary>
public interface ICommandsRepository : IUnitOfWork
{
    Task CreateOrder(OrderAggregate order);
    Task<int> GetNextOrderIdAsync();
    //Task InsertOrder(OrderAggregate order);
    //Task DeleteOrder(int idOrder);
    //Task UpdateOrder(OrderAggregate order);
}
