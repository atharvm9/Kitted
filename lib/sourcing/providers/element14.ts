import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const API_KEY = process.env.ELEMENT14_API_KEY;
const BASE = "https://api.element14.com/catalog/products";
// Newark (US) store — change to uk.farnell.com for UK
const STORE = "us.newark.com";

const bucket = new TokenBucket(10, 5);

export const element14Provider: SourcingProvider = {
  name: "element14",
  enabled: !!API_KEY,

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const url = new URL(BASE);
            url.searchParams.set("term", `id:${mpn}`);
            url.searchParams.set("storeInfo.id", STORE);
            url.searchParams.set("resultsSettings.offset", "0");
            url.searchParams.set("resultsSettings.numberOfResults", "10");
            url.searchParams.set("resultsSettings.refinements.filters", "inStock");
            url.searchParams.set("callInfo.apiKey", API_KEY!);
            url.searchParams.set("callInfo.responseDataFormat", "json");

            const res = await fetch(url.toString(), { signal });
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`Element14 ${res.status}`);

            const data = (await res.json()) as Element14Response;
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

interface Element14Response {
  keywordSearchReturn?: {
    products?: Array<{
      sku?: string;
      translatedManufacturerPartNumber?: string;
      displayName?: string;
      vendorName?: string;
      stock?: number;
      minOrder?: number;
      orderMultiple?: number;
      inv?: number;
      prices?: Array<{ from?: number; to?: number; cost?: number; currency?: string }>;
      datasheets?: Array<{ url?: string }> | null;
      productURL?: string | null;
      leadTime?: string | null;
    }>;
  };
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: Element14Response): Offer[] {
  return (data.keywordSearchReturn?.products ?? []).map((p) => {
    const currency =
      p.prices?.[0]?.currency ?? "USD";
    return {
      mpn: p.translatedManufacturerPartNumber ?? mpn,
      distributor: p.vendorName ?? "Newark",
      sku: p.sku ?? "",
      stock: p.stock ?? p.inv ?? 0,
      moq: p.minOrder ?? 1,
      orderMultiple: p.orderMultiple ?? 1,
      currency,
      priceBreaks: (p.prices ?? []).map((b) => ({
        qty: b.from ?? 1,
        price: b.cost ?? 0,
      })),
      leadTimeDays: parseLeadTime(p.leadTime),
      datasheetUrl: p.datasheets?.[0]?.url ?? null,
      sourceUrl: p.productURL ?? null,
    };
  });
}

function parseLeadTime(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = s.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
}
