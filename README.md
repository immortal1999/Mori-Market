# Mori Market — React + C# starter

A working, responsive React grocery storefront with a separate ASP.NET Core API scaffold. JavaScript/JSX is used on the frontend; C# is used on the backend. This is a maintainable development starter, **not a production commerce platform**.

## Included

- 257 existing Mori supplier products and product reference images.
- Responsive desktop/mobile shopping layout, search and category filtering.
- Persistent browser cart with quantities and removals.
- Delivery → mock payment → order confirmation.
- Confirmed → Processing → Label Created → Shipped → Delivered demo tracking.
- Reviews immediately after order confirmation; rating and editable comment.
- Order history, not just the most recent order.
- Gemini chat UI with a server-side C# integration. A key is required for live replies.
- Separate browser-demo and HTTP API adapters with the same operations.
- C# controllers, validation contracts, order service, repository interface and in-memory implementation.

## Quick start: frontend only

Install Node.js 22.13+ (or a compatible newer LTS) and npm.

```sh
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite. Demo mode is the default. Orders, reviews, tracking and the cart are saved in this browser. Clearing site data removes them. Chat reports that Gemini is not connected; it does not manufacture an AI response.

```sh
npm test
npm run build
npm run preview
```

## Connect the C# backend

Install the .NET 10 SDK. In one terminal:

```sh
cd backend/Mori.Api
dotnet restore
dotnet run --launch-profile http
```

The development API runs at `http://localhost:5080`. In `frontend/.env.local` add:

```dotenv
VITE_DATA_MODE=api
```

Restart `npm run dev`. Vite proxies `/api` to the backend; no permissive cross-origin policy is needed. The frontend receives server-calculated totals and uses the same screens in both modes. API-mode order data is in memory and resets on backend restart. Browser-demo orders do not migrate to API mode. The cart remains local.

For production hosting, serve frontend static output and the API under the same origin or explicitly configure a restricted cross-origin policy. Vite's proxy is development-only. The backend deliberately refuses to start outside Development until you replace the demo security/storage design.

## Gemini configuration

Keep the key on the C# backend. Never place a key in a `VITE_` variable, JavaScript source, or Git.

```sh
cd backend/Mori.Api
dotnet user-secrets set "Gemini:ApiKey" "YOUR_GOOGLE_AI_STUDIO_KEY"
```

The model is configured as `gemini-3.5-flash-lite` in `appsettings.json`, the verified 3.5 Flash-family model with a free tier at authoring time. Free access depends on your Google project and quotas; configuring a model does not enforce your billing tier. Use a free-tier Google project if that is your requirement. `Gemini__ApiKey` and `Gemini__Model` environment variables can override configuration. The C# service sends chat messages and catalog context to Google, but does not send stored orders or addresses automatically. No chat transcript is persisted by this app.

The chat returns a clear configuration error without a key. Network failures, missing model access and quota errors are surfaced without exposing credentials or upstream response bodies. Real Gemini calls were not tested because no key was provided.

## Project structure

| Path | Responsibility |
| --- | --- |
| `frontend/src/App.jsx` | Application shell, page navigation and shared cart/order state |
| `frontend/src/features/` | Catalog, cart, checkout and order/review screens |
| `frontend/src/components/ChatBox.jsx` | Floating chat interface |
| `frontend/src/services/api.js` | API adapter selection and HTTP client |
| `frontend/src/services/demoApi.js` | Browser-local demo backend |
| `frontend/src/services/orderRules.js` | Demo pricing and tracking rules |
| `frontend/src/data/catalog.json` | Demo product data |
| `frontend/public/assets/` | Existing Mori reference imagery |
| `backend/Mori.Api/Controllers/` | API endpoints and HTTP error handling |
| `backend/Mori.Api/Models/` | Validated request and response contracts |
| `backend/Mori.Api/Services/` | Order logic, repository boundary and Gemini service |
| `backend/Mori.Api/Data/catalog.json` | Authoritative API-mode catalog |
| `docs/API.md` | Endpoint contracts and integration examples |
| `docs/NEXT-STEPS.md` | Database, authentication, payment and fulfillment implementation points |

## Implementation notes

- Quote-only products remain in the order but are excluded from totals. No prices are guessed.
- Demo shipping is $4.99 standard or $9.99 express; tax is illustrative $0.00.
- The mock card always succeeds. The backend accepts no real card details.
- Duplicate checkout retries reuse a request ID to avoid creating duplicate demo orders.
- Tracking advances only through the demo button. It is not carrier tracking.
- Reviews describe the shopping experience; they do not require delivered goods.
- This is a mobile-responsive web app, not a native iOS/Android app. A future React Native app can reuse the HTTP contracts, but not these DOM components directly.
- Reference images and source credits were carried over from the existing Mori catalog. They are not a new grant of commercial image rights. Replace them with your own/licensed supplier assets before commercial release.
- Feature folders and small service interfaces are intentional. You can add a database without rewriting the UI.

## Verification

Frontend production build and the four pricing/tracking rule tests passed in the authoring environment. The .NET SDK was not installed there, so the C# scaffold was reviewed but **not compiled or executed**. No visual browser verification or live Gemini request was performed. Run `dotnet build` locally before extending the backend.

This package is a separate editable source handoff. It has not replaced the existing hosted Mori page.

## Official references

- React + build tools: https://react.dev/learn/build-a-react-app-from-scratch
- Vite: https://vite.dev/guide/
- ASP.NET Core controller APIs: https://learn.microsoft.com/aspnet/core/web-api
- Gemini model pricing: https://ai.google.dev/gemini-api/docs/pricing
- Gemini text generation: https://ai.google.dev/gemini-api/docs/text-generation
