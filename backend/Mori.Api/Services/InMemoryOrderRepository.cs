using Mori.Api.Models;
namespace Mori.Api.Services;
// Single-developer demo store. All data disappears on restart; not multi-user safe by design.
public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly object gate = new();
    private readonly Dictionary<string, Order> orders = new();
    public IReadOnlyList<Order> List() { lock (gate) return orders.Values.OrderByDescending(o => o.CreatedAt).ToList(); }
    public Order? Find(string id) { lock (gate) return orders.GetValueOrDefault(id); }
    public Order GetOrAdd(string requestId, Func<Order> create)
    {
        lock (gate)
        {
            var existing = orders.Values.FirstOrDefault(o => o.RequestId == requestId);
            if (existing is not null) return existing;
            var order = create(); orders.Add(order.Id, order); return order;
        }
    }
    public Order? Update(string id, Func<Order, Order> update)
    {
        lock (gate)
        {
            if (!orders.TryGetValue(id, out var order)) return null;
            var changed = update(order); orders[id] = changed; return changed;
        }
    }
}
