
namespace NorthWind.Sales.Backend.UseCases.Search;
internal class GetNextOrderIdInteractor(IGetNextOrderIdOutputPort outputPort, ICommandsRepository repository) : IGetNextOrderIdInputPort
{
    public async Task Handle()
    {
        int nextId = await repository.GetNextOrderIdAsync();
        await outputPort.Handle(new GetNextOrderIdResponse { NextOrderId = nextId });
    }
}
