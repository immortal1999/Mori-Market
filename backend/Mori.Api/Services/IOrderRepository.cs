using Mori.Api.Models;
namespace Mori.Api.Services;
// TODO: Implement with EF Core and SQL Server/PostgreSQL, scoped to authenticated user ID.
public interface IOrderRepository
{
    IReadOnlyList<Order> List();
    Order? Find(string id);
    Order GetOrAdd(string requestId, Func<Order> create);
    Order? Update(string id, Func<Order, Order> update);
}
