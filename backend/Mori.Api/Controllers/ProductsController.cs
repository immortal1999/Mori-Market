using Microsoft.AspNetCore.Mvc;
using Mori.Api.Services;
namespace Mori.Api.Controllers;
[ApiController, Route("api/products")]
public sealed class ProductsController(CatalogService catalog) : ControllerBase
{
    [HttpGet] public IActionResult Get() => Ok(catalog.Products);
}
