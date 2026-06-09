// Nexar (Octopart) Supply API — aggregates most distributors a component
// search on Google would surface (DigiKey, Mouser, Arrow, Newark, LCSC, etc.)
// plus datasheets, in a single GraphQL call.
import type { Offer, SourcingProvider } from "../types";
import { TokenBucket } from "../rateLimit";
import { RetryableError, withRetry } from "../retry";

const CLIENT_ID = process.env.NEXAR_CLIENT_ID;
const CLIENT_SECRET = process.env.NEXAR_CLIENT_SECRET;

const TOKEN_URL = "https://identity.nexar.com/connect/token";
const GRAPHQL_URL = "https://api.nexar.com/graphql";

// Nexar quotas are usage-based; keep it conservative.
const bucket = new TokenBucket(8, 4);

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
      scope: "supply.domain",
    }),
  });

  if (!res.ok) throw new Error(`Nexar token ${res.status}`);

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.value;
}

const SEARCH_QUERY = `
  query SupSearch($q: String!, $limit: Int!) {
    supSearchMpn(q: $q, limit: $limit) {
      results {
        part {
          mpn
          bestDatasheet { url }
          sellers(authorizedOnly: false) {
            company { name }
            offers {
              sku
              inventoryLevel
              moq
              orderMultiple
              clickUrl
              factoryLeadDays
              prices { quantity price currency }
            }
          }
        }
      }
    }
  }
`;

export const nexarProvider: SourcingProvider = {
  name: "nexar",
  enabled: !!(CLIENT_ID && CLIENT_SECRET),

  async search(mpns: string[]): Promise<Offer[]> {
    const results: Offer[] = [];

    await Promise.all(
      mpns.map(async (mpn) => {
        await bucket.acquire();
        const offers = await withRetry(
          async (signal) => {
            const token = await getToken();
            const res = await fetch(GRAPHQL_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                query: SEARCH_QUERY,
                variables: { q: mpn, limit: 10 },
              }),
              signal,
            });

            if (res.status === 401) {
              cachedToken = null;
              throw new RetryableError("Nexar 401 — refreshing token");
            }
            if (res.status === 429 || res.status >= 500) {
              throw new RetryableError(`HTTP ${res.status}`, res.status);
            }
            if (!res.ok) throw new Error(`Nexar ${res.status}`);

            const data = (await res.json()) as NexarResponse;
            return normalize(data);
          },
          { maxAttempts: 3, baseDelayMs: 1_000, timeoutMs: 15_000 },
        );
        results.push(...offers);
      }),
    );

    return results;
  },
};

// ---- types ----------------------------------------------------------------

interface NexarResponse {
  data?: {
    supSearchMpn?: {
      results?: Array<{
        part?: {
          mpn?: string;
          bestDatasheet?: { url?: string } | null;
          sellers?: Array<{
            company?: { name?: string };
            offers?: Array<{
              sku?: string;
              inventoryLevel?: number;
              moq?: number;
              orderMultiple?: number;
              clickUrl?: string | null;
              factoryLeadDays?: number | null;
              prices?: Array<{ quantity?: number; price?: number; currency?: string }>;
            }>;
          }>;
        } | null;
      }>;
    };
  };
}

// ---- normalizer -----------------------------------------------------------

function normalize(data: NexarResponse): Offer[] {
  const offers: Offer[] = [];
  for (const result of data.data?.supSearchMpn?.results ?? []) {
    const part = result.part;
    if (!part) continue;
    const mpn = part.mpn ?? "";
    const datasheetUrl = part.bestDatasheet?.url ?? null;

    for (const seller of part.sellers ?? []) {
      for (const o of seller.offers ?? []) {
        offers.push({
          mpn,
          distributor: seller.company?.name ?? "unknown",
          sku: o.sku ?? "",
          stock: o.inventoryLevel ?? 0,
          moq: o.moq ?? 1,
          orderMultiple: o.orderMultiple ?? 1,
          currency: o.prices?.[0]?.currency ?? "USD",
          priceBreaks: (o.prices ?? []).map((p) => ({
            qty: p.quantity ?? 1,
            price: p.price ?? 0,
          })),
          leadTimeDays: o.factoryLeadDays ?? null,
          datasheetUrl,
          sourceUrl: o.clickUrl ?? null,
        });
      }
    }
  }
  return offers;
}
