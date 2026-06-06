// IMPORTANT: Per Mouser ToS, do NOT cache or persist any data from this API.
// Always fetch live.
import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const API_KEY = process.env.MOUSER_API_KEY;
// 30 req/min = 0.5 req/s; burst = 5
const bucket = new TokenBucket(5, 0.5);
const BATCH = 50;

const BASE = "https://api.mouser.com/api/v2/search/partnumber";

export const mouserProvider: SourcingProvider = {
  name: "mouser",
  enabled: !!API_KEY,

  async search(mpns: string[]): Promise<Offer[]> {
    const batches = chunk(mpns, BATCH);
    const results: Offer[] = [];

    await Promise.all(
      batches.map(async (batch) => {
        await bucket.acquire(batch.length);
        const offers = await withRetry(
          async (signal) => {
            const url = `${BASE}?apiKey=${encodeURIComponent(API_KEY!)}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                SearchByPartRequest: {
                  mouserPartNumber: batch.join(";"),
                  options: "None",
                },
              }),
              signal,
            });

            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`Mouser ${res.status}`);

            const data = (await res.json()) as MouserResponse;
            return normalize(data);
          },
          { maxAttempts: 3, baseDelayMs: 2_000, timeoutMs: 10_000 },
        );
        results.push(...offers);
      }),
    );

    return results;
  },
};

// ---- types ----------------------------------------------------------------

interface MouserResponse {
  SearchResults?: {
    Parts?: Array<{
      ManufacturerPartNumber?: string;
      MouserPartNumber?: string;
      Availability?: string;
      Min?: string;
      Mult?: string;
      PriceBreaks?: Array<{
        Quantity?: number;
        Price?: string;
        Currency?: string;
      }>;
      LeadTime?: string | null;
      DataSheetUrl?: string | null;
      ProductDetailUrl?: string | null;
    }>;
  };
}

// ---- normalizer -----------------------------------------------------------

function normalize(data: MouserResponse): Offer[] {
  return (data.SearchResults?.Parts ?? []).map((p) => {
    const currency = p.PriceBreaks?.[0]?.Currency ?? "USD";
    const stock = parseStock(p.Availability ?? "");
    return {
      mpn: p.ManufacturerPartNumber ?? "",
      distributor: "Mouser",
      sku: p.MouserPartNumber ?? "",
      stock,
      moq: parseInt(p.Min ?? "1", 10) || 1,
      orderMultiple: parseInt(p.Mult ?? "1", 10) || 1,
      currency,
      priceBreaks: (p.PriceBreaks ?? []).map((b) => ({
        qty: b.Quantity ?? 1,
        price: parseFloat((b.Price ?? "0").replace(/[^0-9.]/g, "")),
      })),
      leadTimeDays: parseLeadTime(p.LeadTime),
      datasheetUrl: p.DataSheetUrl ?? null,
      sourceUrl: p.ProductDetailUrl ?? null,
    };
  });
}

function parseStock(s: string): number {
  const m = s.match(/[\d,]+/);
  if (!m) return 0;
  return parseInt(m[0].replace(/,/g, ""), 10);
}

function parseLeadTime(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
