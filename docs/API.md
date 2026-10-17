# HTTP API contract

All paths start with `/api`. JSON names use camelCase. Failed validation returns ASP.NET Core Problem Details. The frontend displays `detail` or `title`.

| Method | Path | Result |
| --- | --- | --- |
| GET | `/health` | Development status |
| GET | `/products` | Catalog array |
| GET | `/orders` | Newest-first demo orders |
| GET | `/orders/{id}` | One order or 404 |
| POST | `/orders` | Create/reuse order; mock payment approved |
| POST | `/orders/{id}/advance` | Advance one demo milestone; Delivered is terminal |
| PUT | `/orders/{id}/review` | Create or replace shopping review |
| POST | `/chat` | Gemini reply; 503 when key is missing |

## Create order

```json
{
  "requestId": "a-client-generated-uuid-kept-for-retries",
  "items": [{"productId": "tom-1", "quantity": 2}],
  "shipping": {
    "name": "Alex Shopper", "address": "123 Demo Lane",
    "city": "Garden Grove", "state": "CA", "zip": "92840", "method": "standard"
  }
}
```

The server calculates prices from its catalog. Quantity: 1–99. Method: `standard` or `express`. No real card details or client prices are accepted. Response fields: `id`, `requestId`, `shipping`, `createdAt`, `items`, `subtotal`, `delivery`, `total`, `payment`, `tracking`, `review`. Tracking events contain `status` and `at`.

## Review

```json
{"rating": 5, "comment": "Easy checkout."}
```

Integer rating 1–5, comment up to 1,000 characters; an existing order is required.

## Chat

```json
{"messages": [{"role": "user", "text": "How does checkout work?"}]}
```

Up to 10 messages of 2,000 characters; roles `user` or `model`, ending in `user`. Response: `{"reply":"..."}`. Replies are plain text. No order addresses are sent automatically.

This scaffold has no user authentication. API-mode orders are shared within a single local developer process and disappear on restart. Implement user ownership before deployment.
