namespace NorthWind.Sales.Backend.BusinessObjects.Interfaces.CreateOrder;

/// <summary>
/// Los puertos (InputPort, OutPort) son abstracciones (Interfaces) que permiten 
/// al INTERACTOR del caso de uso (CreateOrder) recibir lo datos de entrada y proporcionar
/// el resultado de salida del caso de uso (CreateOrder).
/// 
/// El InputPort del caso de uso (CreateOrder) es una abstracción que permite al INTERACTOR
/// recibir los datos necesarios para resolver el caso de uso (CreateOrder), estos datos
/// son proporcionados por algun elemento (objeto) de la capa externa (Controller).
/// En terminos de POO, el InputPort puede ser definido usando una interface o una clase abstracta
/// que el INTERACTOR debe/tiene que implementar y el (Controller) debe/tiene que utilizar.
/// </summary>
public interface ICreateOrderInputPort
{
    Task Handle(CreateOrderDto orderDto);
}
