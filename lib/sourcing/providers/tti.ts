// Best-effort implementation based on publicly available TTI API documentation.
// Request/response shape may need adjustment once you have live credentials.
import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const API_KEY = process.env.TTI_API_KEY;
const BASE = "https://www.tti.com/api/Search/";

const bucket = new TokenBucket(10, 5);

export const ttiProvider: SourcingProvider = {
  name: "tti",
  enabled: !!API_KEY,

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const res = await fetch(BASE, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-TTI-API-Key": API_KEY!,
              },
              body: JSON.stringify({
                SearchCriteria: {
                  ManufacturerPartNumber: mpn,
                  SearchType: "BeginsWith",
                  RecordCount: 25,
                  RecordStartPosition: 0,
                },
              }),
              signal,
            });

            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`TTI ${res.status}`);

            const data = (await res.json()) as TTIResponse;
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

// ---- types ----------------------------------------------------------------

interface TTIResponse {
  SearchResults?: {
    Parts?: Array<{
      ManufacturerPartNumber?: string;
      TTIPartNumber?: string;
      AvailableToSell?: number;
      SalesMinimum?: number;
      SalesMultiple?: number;
      PriceBreaks?: Array<{
        MinimumQuantity?: number;
        UnitPrice?: number;
        Currency?: string;
      }>;
      LeadTimeDays?: number | null;
      DatasheetURL?: string | null;
      ProductDetailURL?: string | null;
    }>;
  };
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: TTIResponse): Offer[] {
  return (data.SearchResults?.Parts ?? []).map((p) => {
    const currency = p.PriceBreaks?.[0]?.Currency ?? "USD";
    return {
      mpn: p.ManufacturerPartNumber ?? mpn,
      distributor: "TTI",
      sku: p.TTIPartNumber ?? "",
      stock: p.AvailableToSell ?? 0,
      moq: p.SalesMinimum ?? 1,
      orderMultiple: p.SalesMultiple ?? 1,
      currency,
      priceBreaks: (p.PriceBreaks ?? []).map((b) => ({
        qty: b.MinimumQuantity ?? 1,
        price: b.UnitPrice ?? 0,
      })),
      leadTimeDays: p.LeadTimeDays ?? null,
      datasheetUrl: p.DatasheetURL ?? null,
      sourceUrl: p.ProductDetailURL ?? null,
    };
  });
}
