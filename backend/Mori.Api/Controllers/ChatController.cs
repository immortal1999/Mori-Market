using Microsoft.AspNetCore.Mvc;
using Mori.Api.Models;
using Mori.Api.Services;
namespace Mori.Api.Controllers;
[ApiController, Route("api/chat")]
public sealed class ChatController(GeminiService gemini) : ControllerBase
{
    [HttpPost] public async Task<IActionResult> Chat(ChatRequest request, CancellationToken cancellationToken)
    {
        if (!gemini.IsConfigured) return Problem(statusCode: 503, detail: "Gemini is not connected. Configure Gemini:ApiKey on the C# backend.");
        if (request.Messages.Last().Role != "user") return Problem(statusCode: 400, detail: "The final message must be from the user.");
        try { return Ok(new { reply = await gemini.ReplyAsync(request, cancellationToken) }); }
        catch (HttpRequestException) { return Problem(statusCode: 502, detail: "Gemini is unavailable or its quota has been reached. Please try again later."); }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested) { return Problem(statusCode: 504, detail: "Gemini took too long. Please try again."); }
        catch (InvalidOperationException) { return Problem(statusCode: 502, detail: "Gemini could not provide a reply. Please rephrase your question."); }
    }
}
