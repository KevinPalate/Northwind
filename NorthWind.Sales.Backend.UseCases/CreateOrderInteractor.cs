namespace NorthWind.Sales.Backend.UseCases;

/// <summary>
/// El código de la clase "CreateOrderInteractor" recibe los servicios (clases, interfaces) mediante
/// inyección de dependencias a través del constructor.
/// </summary>
/// <param name="ouputPort"></param>
/// <param name="repository"></param>
internal class CreateOrderInteractor(ICreateOrderOuputPort ouputPort, ICommandsRepository repository) : ICreateOrderInputPort
{
    public async Task Handle(CreateOrderDto orderDto)
    {
        //  Transformar de Dto a Agreggate
        // Permite crear un objeto de tipo: OrderAggregate a partir de los datos
        // de entrada que recibe como parametro en Dto (CreateOrderDto)
        OrderAggregate Order = OrderAggregate.From(orderDto);

        // Crear la orden
        // ICommandsRepository//insert
        await repository.CreateOrder(Order);
      
        //  IUnitOfWork
        //  Realizar la persistencia de los datos
        await repository.SaveChanges();

        // Regresar el id de la orden por medio de la invocación método "Handle" del OutputPort
        // 
        await ouputPort.Handle(Order);
    }
}


// Sin utilizar: Constructores primarios
//internal class CreateOrderInteractor : ICreateOrderInputPort
//{
// private ICreateOrderOuputPort ouputPort;
//private ICommandsRepository repository;

// Esto estuliza inyección de dependencias por Constructor
//internal CreateOrderInteractor(ICreateOrderOuputPort ouputPort, ICommandsRepository repository)
//{
//    this.ouputPort = ouputPort;
//    this.repository = repository;
//}

//public async Task Handle(CreateOrderDto orderDto)
//{
//    //  Transformar de Dto a Agreggate
//    OrderAggregate Order = OrderAggregate.From(orderDto);

//    // Crear la orden
//    // ICommandsRepository
//    await repository.CreateOrder(Order);

//    //  IUnitOfWork
//    await repository.SaveChanges();

//    // Regresar el id de la orden al OutputPort
//    await ouputPort.Handle(Order);
//}
//}
