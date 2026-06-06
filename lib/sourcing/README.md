# Sourcing Layer

Fetches live price/stock/MOQ/price-breaks from multiple distributor APIs behind one interface.

## Quick Start

```ts
import { searchAll } from "@/lib/sourcing";

const { offers, errors } = await searchAll(["STM32F405RGT6", "GRM155R71C104KA01D"]);
```

`offers` is a deduplicated `Offer[]` merged from all enabled providers. `errors` lists any providers that failed — a provider error never blocks others.

## Provider Pattern

Each provider lives in `lib/sourcing/providers/<name>.ts` and exports a `SourcingProvider`:

```ts
export interface SourcingProvider {
  readonly name: string;
  readonly enabled: boolean;              // true only when required env vars are set
  search(mpns: string[]): Promise<Offer[]>;
}
```

A provider is **enabled** when its required env vars are present at startup. Missing keys → `enabled: false` → silently skipped. No crashes.

## Enabling a Provider

1. Copy `.env.example` to `.env.local`
2. Fill in the key(s) for the provider you want
3. Restart the dev server — `enabled` is evaluated once at module load time

## Live Providers

| Provider | Env vars | Notes |
|---|---|---|
| `oemsecrets` | `OEMSECRETS_API_KEY` | Aggregator, 120+ distributors. Primary source. |
| `trustedparts` | `TRUSTEDPARTS_API_KEY` | ECIA aggregator. Batches at 50 MPNs/request. |
| `mouser` | `MOUSER_API_KEY` | 30 req/min + 1000/day. **Data must not be cached per ToS.** |
| `digikey` | `DIGIKEY_CLIENT_ID` + `DIGIKEY_CLIENT_SECRET` | OAuth2 client-credentials. Token cached in memory, auto-refreshed. |
| `arrow` | `ARROW_API_KEY` | Pricing & Availability v4. |
| `element14` | `ELEMENT14_API_KEY` | Newark (US) / Farnell. Store configurable in provider file. |
| `tti` | `TTI_API_KEY` | Best-effort shape — verify against live docs when you have credentials. |
| `tme` | `TME_TOKEN` + `TME_SECRET` | Signed HMAC-SHA1 requests. |

## Stub Providers (not implemented)

`lcsc`, `mcmaster`, `grainger`, `msc`, `misumi`, `adafruit` — registered in the registry but always disabled. Each throws `"<name> provider not implemented"` if called directly. Add a scraper or API adapter inside the file to enable.

## Adding a New Provider

1. Create `lib/sourcing/providers/myvendor.ts` implementing `SourcingProvider`
2. Import and add it to `ALL_PROVIDERS` in `lib/sourcing/index.ts`
3. Add the env var(s) to `.env.example`
4. Write a test in `lib/sourcing/__tests__/myvendor.test.ts`

## Rate Limiting

`lib/sourcing/rateLimit.ts` exports `TokenBucket`. Each provider instantiates its own bucket at module level:

```ts
const bucket = new TokenBucket(capacity, refillPerSecond);
// ...
await bucket.acquire(); // waits if rate limit would be exceeded
```

## Retry & Timeout

`lib/sourcing/retry.ts` exports `withRetry`. Wrap fetch calls in it:

```ts
await withRetry(async (signal) => {
  const res = await fetch(url, { signal });
  if (res.status === 429 || res.status >= 500) throw new RetryableError("...");
  return normalize(await res.json());
}, { maxAttempts: 3, baseDelayMs: 500, timeoutMs: 10_000 });
```

Throws `RetryableError` to trigger a retry; any other error propagates immediately after the last attempt.

## API Route

`POST /api/sourcing/search`

```json
// Request
{ "mpns": ["STM32F405RGT6", "GRM155R71C104KA01D"] }

// Response
{
  "offers": [ /* Offer[] */ ],
  "meta": {
    "mpns": [...],
    "enabledProviders": ["oemsecrets", "mouser"],
    "providerErrors": [ { "provider": "digikey", "error": "..." } ]
  }
}
```

## Tests

```bash
npm test
```

Tests use mocked fetch — no API keys required.
