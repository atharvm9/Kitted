// Best-effort implementation of the TME signed API.
// Signatures use HMAC-SHA1 over the raw POST body.
import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const TME_TOKEN = process.env.TME_TOKEN;
const TME_SECRET = process.env.TME_SECRET;
const BASE = "https://api.tme.eu/";

const bucket = new TokenBucket(10, 3);

export const tmeProvider: SourcingProvider = {
  name: "tme",
  enabled: !!(TME_TOKEN && TME_SECRET),

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const endpoint = "Products/GetPricesAndStocks.json";
            const params: Record<string, string> = {
              Token: TME_TOKEN!,
              Country: "US",
              Currency: "USD",
              Language: "EN",
              SymbolList: mpn,
            };

            const signature = await signRequest(
              "POST",
              BASE + endpoint,
              params,
              TME_SECRET!,
            );

            const body = new URLSearchParams({ ...params, ApiSignature: signature });

            const res = await fetch(`${BASE}${endpoint}`, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: body.toString(),
              signal,
            });

            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`TME ${res.status}`);

            const data = (await res.json()) as TMEResponse;
            return normalize(mpn, data);
          },
          { maxAttempts: 3, baseDelayMs: 500, timeoutMs: 10_000 },
        );
        results.push(...offers);
      }),
    );

    return results;
  },
};

// ---- signing --------------------------------------------------------------

async function signRequest(
  method: string,
  url: string,
  params: Record<string, string>,
  secret: string,
): Promise<string> {
  // TME signature: HMAC-SHA1( method&encodedUrl&encodedSortedParams, secret )
  const sortedQuery = Object.keys(params)
    .sort()
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k]!)}`)
    .join("&");

  const base = [method, encodeURIComponent(url), encodeURIComponent(sortedQuery)].join(
    "&",
  );

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(base));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// ---- types ----------------------------------------------------------------

interface TMEResponse {
  Data?: {
    ProductList?: Array<{
      Symbol?: string;
      OriginalSymbol?: string;
      Amount?: number;
      Unit?: string;
      MinAmount?: number;
      Multiples?: number;
      Price?: number;
      Currency?: string;
      PriceList?: Array<{ Amount?: number; PriceValue?: number }>;
      VatRate?: number;
    }>;
  };
  Status?: string;
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: TMEResponse): Offer[] {
  return (data.Data?.ProductList ?? []).map((p) => ({
    mpn: p.OriginalSymbol ?? mpn,
    distributor: "TME",
    sku: p.Symbol ?? "",
    stock: p.Amount ?? 0,
    moq: p.MinAmount ?? 1,
    orderMultiple: p.Multiples ?? 1,
    currency: p.Currency ?? "USD",
    priceBreaks: (p.PriceList ?? []).map((b) => ({
      qty: b.Amount ?? 1,
      price: b.PriceValue ?? 0,
    })),
    leadTimeDays: null,
    datasheetUrl: null,
    sourceUrl: null,
  }));
}
