import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const API_KEY = process.env.ARROW_API_KEY;
const BASE = "https://api.arrow.com/itemservice/v4/en-US/search";

const bucket = new TokenBucket(10, 5);

export const arrowProvider: SourcingProvider = {
  name: "arrow",
  enabled: !!API_KEY,

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const url = new URL(BASE);
            url.searchParams.set("search_by", "partnum");
            url.searchParams.set("search_query", mpn);
            url.searchParams.set("apiKey", API_KEY!);
            url.searchParams.set("currency", "USD");
            url.searchParams.set("responseGroup", "prices,inventory");

            const res = await fetch(url.toString(), { signal });
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`Arrow ${res.status}`);

            const data = (await res.json()) as ArrowResponse;
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

interface ArrowResponse {
  itemserviceresult?: {
    data?: Array<{
      PartNum?: string;
      itemno?: string;
      InvOrg?: { Qty?: number } | null;
      MinOrderQty?: number;
      SalesMult?: number;
      Prices?: {
        resaleList?: Array<{ minQty?: number; resalePrice?: number }>;
        currency?: string;
      };
      LeadTime?: { Weeks?: number } | null;
      urlData?: Array<{ value?: string; type?: string }> | null;
    }>;
  };
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: ArrowResponse): Offer[] {
  return (data.itemserviceresult?.data ?? []).map((p) => {
    const datasheetEntry = (p.urlData ?? []).find((u) => u.type === "datasheet");
    const priceList = p.Prices?.resaleList ?? [];
    return {
      mpn: p.PartNum ?? mpn,
      distributor: "Arrow",
      sku: p.itemno ?? "",
      stock: p.InvOrg?.Qty ?? 0,
      moq: p.MinOrderQty ?? 1,
      orderMultiple: p.SalesMult ?? 1,
      currency: p.Prices?.currency ?? "USD",
      priceBreaks: priceList.map((b) => ({
        qty: b.minQty ?? 1,
        price: b.resalePrice ?? 0,
      })),
      leadTimeDays:
        p.LeadTime?.Weeks != null ? Math.round(p.LeadTime.Weeks * 7) : null,
      datasheetUrl: datasheetEntry?.value ?? null,
      sourceUrl: null,
    };
  });
}
