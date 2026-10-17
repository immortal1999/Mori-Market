using Mori.Api.Services;

var builder = WebApplication.CreateBuilder(args);
// This scaffold has no authentication or durable storage. Do not expose it publicly.
if (!builder.Environment.IsDevelopment())
    throw new InvalidOperationException("This demo backend is development-only. Implement authentication, per-user authorization and persistent storage before production deployment.");
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddSingleton<CatalogService>();
builder.Services.AddSingleton<IOrderRepository, InMemoryOrderRepository>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddHttpClient<GeminiService>(client => client.Timeout = TimeSpan.FromSeconds(25));
var app = builder.Build();
app.UseExceptionHandler();
app.MapGet("/api/health", () => new { status = "ok", mode = "development-demo" });
app.MapControllers();
app.Run();
