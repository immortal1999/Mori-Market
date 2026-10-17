using System.ComponentModel.DataAnnotations;
namespace Mori.Api.Models;

public record Product(string Id, string Name, decimal? Price, string Pack, string Origin,
    string Category, string Photo, string? PhotoSource, bool Review);
public record CartLine([Required] string ProductId, [Range(1, 99)] int Quantity);
public record Shipping(
    [Required, StringLength(140)] string Name,
    [Required, StringLength(140)] string Address,
    [Required, StringLength(140)] string City,
    [Required, StringLength(140)] string State,
    [Required, RegularExpression(@"^\d{5}$")] string Zip,
    [Required, RegularExpression("^(standard|express)$")] string Method);
public record PlaceOrderRequest(
    [Required, StringLength(100)] string RequestId,
    [Required, MinLength(1), MaxLength(300)] List<CartLine> Items,
    [Required] Shipping Shipping);
public record OrderItem(string Id, string Name, decimal? Price, string Pack, string Photo, int Quantity, bool Quote);
public record TrackingEvent(string Status, DateTimeOffset At);
public record ReviewRequest([Range(1, 5)] int Rating, [Required(AllowEmptyStrings = true), StringLength(1000)] string Comment);
public record Order(string Id, string RequestId, Shipping Shipping, DateTimeOffset CreatedAt,
    List<OrderItem> Items, decimal Subtotal, decimal Delivery, decimal Total,
    string Payment, List<TrackingEvent> Tracking, ReviewRequest? Review);
public record ChatMessage([Required, RegularExpression("^(user|model)$")] string Role,
    [Required, StringLength(2000, MinimumLength = 1)] string Text);
public record ChatRequest([Required, MinLength(1), MaxLength(10)] List<ChatMessage> Messages);
