# C# backend extension points

1. Implement `IOrderRepository` with Entity Framework Core and SQL Server or PostgreSQL. Add migrations, decimal monetary columns and transactions. Make retry keys unique per user and compare retry payloads.
2. Add ASP.NET Core Identity or an OpenID Connect provider. Authorize every order/review operation using the server-authenticated owner ID.
3. Replace mock payment with provider-hosted or tokenized payment fields. Verify signed payment webhooks before confirming orders. Never store raw card numbers.
4. Replace the customer demo-advance endpoint with authenticated fulfillment/carrier events, validated transitions and immutable timestamps.
5. Persist reviews by order and owner. Decide whether feedback stays private or becomes a moderated public product review.
6. Add Gemini per-user rate limits, budget controls, logging and request-size limits. Keep keys server-only. Never let model output authorize mutations.
7. Add backend integration tests for authorization, pricing, retry conflicts, stock races and webhook replay. Add browser tests for checkout, tracking and reviews.
8. Build React with `npm run build`, serve its `dist` folder, and publish ASP.NET Core to your .NET host. Configure HTTPS and same-origin API routing. Remove the development-only startup guard only after security and persistence are implemented.

These are placeholders/extension points, not completed production capabilities.
