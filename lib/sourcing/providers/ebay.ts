// eBay Browse API — real consumer/surplus-market listings for a part.
// Good for hobbyist, NOS, and end-of-life components a distributor won't stock.
import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const CLIENT_ID = process.env.EBAY_CLIENT_ID;
const CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET;

const TOKEN_URL = "https://api.ebay.com/identity/v1/oauth2/token";
const SEARCH_URL = "https://api.ebay.com/buy/browse/v1/item_summary/search";
const MARKETPLACE = "EBAY_US";

const bucket = new TokenBucket(10, 5);

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  });

  if (!res.ok) throw new Error(`eBay token ${res.status}`);

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.value;
}

export const ebayProvider: SourcingProvider = {
  name: "ebay",
  enabled: !!(CLIENT_ID && CLIENT_SECRET),

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const token = await getToken();
            const url = new URL(SEARCH_URL);
            url.searchParams.set("q", mpn);
            url.searchParams.set("limit", "10");

            const res = await fetch(url.toString(), {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-EBAY-C-MARKETPLACE-ID": MARKETPLACE,
              },
              signal,
            });

            if (res.status === 401) {
              cachedToken = null;
              throw new RetryableError("eBay 401 — refreshing token");
            }
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`eBay ${res.status}`);

            const data = (await res.json()) as EbayResponse;
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

interface EbayResponse {
  itemSummaries?: Array<{
    itemId?: string;
    legacyItemId?: string;
    title?: string;
    price?: { value?: string; currency?: string };
    estimatedAvailabilities?: Array<{ estimatedAvailableQuantity?: number }>;
    itemWebUrl?: string;
    seller?: { username?: string };
  }>;
}

// ---- normalizer -----------------------------------------------------------

function normalize(mpn: string, data: EbayResponse): Offer[] {
  return (data.itemSummaries ?? []).map((it) => {
    const qty = it.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity;
    return {
      mpn,
      // Seller name keeps listings distinguishable; prefix marks the market.
      distributor: `eBay${it.seller?.username ? ` (${it.seller.username})` : ""}`,
      sku: it.legacyItemId ?? it.itemId ?? "",
      stock: qty ?? 0,
      moq: 1,
      orderMultiple: 1,
      currency: it.price?.currency ?? "USD",
      priceBreaks: it.price?.value
        ? [{ qty: 1, price: parseFloat(it.price.value) }]
        : [],
      leadTimeDays: null,
      datasheetUrl: null,
      sourceUrl: it.itemWebUrl ?? null,
    };
  });
}
