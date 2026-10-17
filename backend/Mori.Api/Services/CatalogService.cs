using System.Text.Json;
using Mori.Api.Models;
namespace Mori.Api.Services;
public sealed class CatalogService
{
    public IReadOnlyList<Product> Products { get; }
    public CatalogService(IWebHostEnvironment environment)
    {
        var path = Path.Combine(environment.ContentRootPath, "Data", "catalog.json");
        Products = JsonSerializer.Deserialize<List<Product>>(File.ReadAllText(path), new JsonSerializerOptions(JsonSerializerDefaults.Web))
            ?? throw new InvalidOperationException("Catalog is missing.");
    }
}
