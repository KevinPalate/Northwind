namespace Northwind.Sales.Backend.BusinessObjects.Interfaces.CreateOrder;
/// <summary>
/// Los puertos (InputPort, OutPort) son abstracciones (interfaces) que permiten al INTERACTOR del caso de uso
/// (CreateOrder) recibir los datos de entrada y pproporcionar el resultado de salida del caso de uso (CreateOrder)
/// 
/// El InputPort del; caso de uso(CreateOrder) es una abstraccion que permite al INTERATOR recibir los datos necesarios
/// para resolver el caso de uso (CreateOrdeer), estos datos son proporcionados por algun elemento (objeto) de la capa externa
/// (Controller).
/// En terminos de POO, el InputPort puede ser definido usando una interface o una clase abstracta que el INTERACTOR 
/// debe/tiene que implementar y el (Controller) debe/tiene que utilizar.
/// </summary>
public interface ICreateOrderInputPort
{
    Task Handle(CreateOrderDto orderDto);
}
