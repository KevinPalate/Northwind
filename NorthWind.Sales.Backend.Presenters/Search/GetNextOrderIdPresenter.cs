namespace NorthWind.Sales.Backend.Presenters.Search;
public class GetNextOrderIdPresenter : IGetNextOrderIdOutputPort
{
    public int NextOrderId { get; private set; }

    public Task Handle(GetNextOrderIdResponse response)
    {
        NextOrderId = response.NextOrderId;
        return Task.CompletedTask;
    }
}

