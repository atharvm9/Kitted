import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const CLIENT_ID = process.env.DIGIKEY_CLIENT_ID;
const CLIENT_SECRET = process.env.DIGIKEY_CLIENT_SECRET;

const TOKEN_URL = "https://api.digikey.com/v1/oauth2/token";
const SEARCH_URL = "https://api.digikey.com/products/v4/search/keyword";

// DigiKey doesn't publish exact rate limits; conservative 5 req/s
const bucket = new TokenBucket(10, 5);

// In-memory token cache (not persisted — safe under Mouser-style ToS concerns)
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID!,
      client_secret: CLIENT_SECRET!,
    }),
  });

  if (!res.ok) throw new Error(`DigiKey token ${res.status}`);

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.value;
}

export const digikeyProvider: SourcingProvider = {
  name: "digikey",
  enabled: !!(CLIENT_ID && CLIENT_SECRET),

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const token = await getToken();
            const res = await fetch(SEARCH_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                "X-DIGIKEY-Client-Id": CLIENT_ID!,
                "X-DIGIKEY-Locale-Site": "US",
                "X-DIGIKEY-Locale-Language": "en",
                "X-DIGIKEY-Locale-Currency": "USD",
              },
              body: JSON.stringify({
                Keywords: mpn,
                Limit: 20,
                Offset: 0,
                FilterOptionsRequest: { MarketplaceFilter: "ExcludeMarketPlace" },
              }),
              signal,
            });

            if (res.status === 401) {
              // Force token refresh on next attempt
              cachedToken = null;
              throw new RetryableError("DigiKey 401 — refreshing token");
            }
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`DigiKey ${res.status}`);

            const data = (await res.json()) as DigiKeyResponse;
            return normalize(mpn, data);
          },
          { maxAttempts: 3, baseDelayMs: 1_000, timeoutMs: 12_000 },
        );
        results.push(...offers);
      }),
    );

    return results;
  },
};

// ---- types ----------------------------------------------------------------

interface DigiKeyResponse {
  Products?: Array<{
    ManufacturerProductNumber?: string;
    DigiKeyPartNumber?: string;
    QuantityAvailable?: number;
    MinimumOrderQuantity?: number;
    StandardPackage?: number;
    UnitPrice?: number;
    StandardPricing?: Array<{ BreakQuantity?: number; UnitPrice?: number }>;
    QuantityOnOrder?: number;
    ManufacturerLeadWeeks?: number | null;
    PrimaryDatasheet?: string | null;
    ProductUrl?: string | null;
    Currency?: string;
  }>;
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: DigiKeyResponse): Offer[] {
  return (data.Products ?? []).map((p) => ({
    mpn: p.ManufacturerProductNumber ?? mpn,
    distributor: "DigiKey",
    sku: p.DigiKeyPartNumber ?? "",
    stock: p.QuantityAvailable ?? 0,
    moq: p.MinimumOrderQuantity ?? 1,
    orderMultiple: p.StandardPackage ?? 1,
    currency: p.Currency ?? "USD",
    priceBreaks: (p.StandardPricing ?? []).map((b) => ({
      qty: b.BreakQuantity ?? 1,
      price: b.UnitPrice ?? 0,
    })),
    leadTimeDays:
      p.ManufacturerLeadWeeks != null
        ? Math.round(p.ManufacturerLeadWeeks * 7)
        : null,
    datasheetUrl: p.PrimaryDatasheet ?? null,
    sourceUrl: p.ProductUrl ?? null,
  }));
}
