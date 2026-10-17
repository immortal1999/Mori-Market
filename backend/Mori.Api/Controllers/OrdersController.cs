using Microsoft.AspNetCore.Mvc;
using Mori.Api.Models;
using Mori.Api.Services;
namespace Mori.Api.Controllers;
[ApiController, Route("api/orders")]
public sealed class OrdersController(OrderService service, IOrderRepository repository) : ControllerBase
{
    [HttpGet] public IActionResult List() => Ok(repository.List());
    [HttpGet("{id}")] public IActionResult Get(string id) => repository.Find(id) is { } order ? Ok(order) : NotFound();
    [HttpPost] public IActionResult Place(PlaceOrderRequest request)
    {
        try { var order = service.Place(request); return CreatedAtAction(nameof(Get), new { id = order.Id }, order); }
        catch (ArgumentException e) { return Problem(statusCode: 400, detail: e.Message); }
    }
    // Demo-only endpoint. Replace with authenticated carrier/admin events for real fulfillment.
    [HttpPost("{id}/advance")] public IActionResult Advance(string id) => service.Advance(id) is { } order ? Ok(order) : NotFound();
    [HttpPut("{id}/review")] public IActionResult Review(string id, ReviewRequest review) => service.Review(id, review) is { } order ? Ok(order) : NotFound();
}
