import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const API_KEY = process.env.OEMSECRETS_API_KEY;
const BASE = "https://www.oemsecrets.com/api/search_parts/";

const bucket = new TokenBucket(10, 5); // conservative: 5 req/s burst 10

export const oemsecretsProvider: SourcingProvider = {
  name: "oemsecrets",
  enabled: !!API_KEY,

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];
    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const url = new URL(BASE);
            url.searchParams.set("part_number", mpn);
            url.searchParams.set("api_key", API_KEY!);
            url.searchParams.set("format", "json");

            const res = await fetch(url.toString(), { signal });
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`OEMSecrets ${res.status}`);

            const data = (await res.json()) as OemSecretsResponse;
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

interface OemSecretsResponse {
  parts?: OemSecretsPart[];
}

interface OemSecretsPart {
  distributor?: string;
  sku?: string;
  stock?: number | string;
  moq?: number | string;
  order_multiple?: number | string;
  currency?: string;
  price_breaks?: Array<{ qty: number | string; price: number | string }>;
  lead_time?: number | string | null;
  datasheet?: string | null;
  product_url?: string | null;
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: OemSecretsResponse): Offer[] {
  return (data.parts ?? []).map((p) => ({
    mpn,
    distributor: p.distributor ?? "unknown",
    sku: p.sku ?? "",
    stock: Number(p.stock ?? 0),
    moq: Number(p.moq ?? 1),
    orderMultiple: Number(p.order_multiple ?? 1),
    currency: p.currency ?? "USD",
    priceBreaks: (p.price_breaks ?? []).map((b) => ({
      qty: Number(b.qty),
      price: Number(b.price),
    })),
    leadTimeDays: p.lead_time != null ? Number(p.lead_time) : null,
    datasheetUrl: p.datasheet ?? null,
    sourceUrl: p.product_url ?? null,
  }));
}
