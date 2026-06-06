import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const API_KEY = process.env.TRUSTEDPARTS_API_KEY;
const BASE = "https://api.trustedparts.com/api/v1/search";
const BATCH = 50; // max 50 MPNs per request

const bucket = new TokenBucket(10, 5);

export const trustedpartsProvider: SourcingProvider = {
  name: "trustedparts",
  enabled: !!API_KEY,

  async search(mpns: string[]): Promise<Offer[]> {
    const batches = chunk(mpns, BATCH);
    const results: Offer[] = [];

    await Promise.all(
      batches.map(async (batch) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const res = await fetch(BASE, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
              },
              body: JSON.stringify({ parts: batch }),
              signal,
            });
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`TrustedParts ${res.status}`);

            const data = (await res.json()) as TrustedPartsResponse;
            return normalizeAll(data);
          },
          { maxAttempts: 3, baseDelayMs: 500, timeoutMs: 15_000 },
        );
        results.push(...offers);
      }),
    );

    return results;
  },
};

// ---- types ----------------------------------------------------------------

interface TrustedPartsResponse {
  results?: Array<{
    mpn?: string;
    offers?: Array<{
      seller?: { name?: string };
      sku?: string;
      in_stock_quantity?: number;
      moq?: number;
      order_multiple?: number;
      currency?: string;
      prices?: Array<{ quantity?: number; price?: string }>;
      factory_lead_days?: number | null;
      datasheet_url?: string | null;
      click_url?: string | null;
    }>;
  }>;
}

// ---- normalizer -----------------------------------------------------------

function normalizeAll(data: TrustedPartsResponse): Offer[] {
  const offers: Offer[] = [];
  for (const result of data.results ?? []) {
    const mpn = result.mpn ?? "";
    for (const o of result.offers ?? []) {
      offers.push({
        mpn,
        distributor: o.seller?.name ?? "unknown",
        sku: o.sku ?? "",
        stock: o.in_stock_quantity ?? 0,
        moq: o.moq ?? 1,
        orderMultiple: o.order_multiple ?? 1,
        currency: o.currency ?? "USD",
        priceBreaks: (o.prices ?? []).map((p) => ({
          qty: p.quantity ?? 1,
          price: parseFloat(p.price ?? "0"),
        })),
        leadTimeDays: o.factory_lead_days ?? null,
        datasheetUrl: o.datasheet_url ?? null,
        sourceUrl: o.click_url ?? null,
      });
    }
  }
  return offers;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}
