using Mori.Api.Models;
namespace Mori.Api.Services;
public sealed class OrderService(CatalogService catalog, IOrderRepository repository)
{
    public static readonly string[] Stages = ["Confirmed", "Processing", "Label Created", "Shipped", "Delivered"];
    public Order Place(PlaceOrderRequest request)
    {
        if (request.Items.Select(i => i.ProductId).Distinct().Count() != request.Items.Count)
            throw new ArgumentException("Duplicate product lines are not allowed.");
        // Prices are calculated from the server catalog, never trusted from the browser.
        var items = request.Items.Select(line =>
        {
            var p = catalog.Products.FirstOrDefault(p => p.Id == line.ProductId)
                ?? throw new ArgumentException("Unknown product.");
            return new OrderItem(p.Id, p.Name, p.Price, p.Pack, p.Photo, line.Quantity, p.Price is null || p.Review);
        }).ToList();
        var subtotal = items.Sum(i => i.Quote ? 0m : decimal.Round(i.Price!.Value, 2, MidpointRounding.AwayFromZero) * i.Quantity);
        var delivery = request.Shipping.Method == "express" ? 9.99m : 4.99m;
        return repository.GetOrAdd(request.RequestId, () => new Order(
            "MORI-" + Guid.NewGuid().ToString("N")[..8].ToUpperInvariant(), request.RequestId,
            request.Shipping, DateTimeOffset.UtcNow, items, subtotal, delivery, subtotal + delivery,
            "Mock card •••• 4242", [new TrackingEvent(Stages[0], DateTimeOffset.UtcNow)], null));
    }
    public Order? Advance(string id) => repository.Update(id, o => o.Tracking.Count >= Stages.Length ? o : o with
    {
        Tracking = [.. o.Tracking, new TrackingEvent(Stages[o.Tracking.Count], DateTimeOffset.UtcNow)]
    });
    public Order? Review(string id, ReviewRequest review) => repository.Update(id, o => o with { Review = review });
}
