import { NextRequest, NextResponse } from "next/server";
import { CATALOG, CatalogEntry } from "@/lib/catalog/parts";
import { searchAll, enabledProviders, type Offer } from "@/lib/sourcing";

/**
 * Relevance for one catalog entry. `matched` counts how many query terms hit
 * anywhere; `weight` favors hits in the family name over incidental hits in
 * specs/tags so "camera module" ranks camera families above every board that
 * merely carries a "module" tag.
 */
function score(entry: CatalogEntry, terms: string[]): { matched: number; weight: number } {
  if (!terms.length) return { matched: 1, weight: 1 };
  const family = entry.family.toLowerCase();
  const ident = `${entry.brand} ${entry.mpn}`.toLowerCase();
  const rest = [entry.mcu, entry.specs, ...entry.tags].join(" ").toLowerCase();

  let matched = 0;
  let weight = 0;
  for (const t of terms) {
    if (family.includes(t)) {
      matched++;
      weight += 3;
    } else if (ident.includes(t)) {
      matched++;
      weight += 2;
    } else if (rest.includes(t)) {
      matched++;
      weight += 1;
    }
  }
  return { matched, weight };
}

/** Lowest unit price across an offer's price breaks (0 when none). */
function bestPrice(offer: Offer): number {
  if (!offer.priceBreaks.length) return 0;
  return offer.priceBreaks.reduce((min, b) => (b.price < min ? b.price : min), Infinity);
}

/**
 * Turn live distributor Offers (keyed by real MPN) into the same group/entry
 * shape the local catalog returns, so search.html renders them identically.
 * Offer tuple: [distributor, price, stock, eta, url, displayName].
 */
function offersToGroups(offers: Offer[]) {
  const byMpn = new Map<string, Offer[]>();
  for (const o of offers) {
    const g = byMpn.get(o.mpn) ?? [];
    g.push(o);
    byMpn.set(o.mpn, g);
  }

  return Array.from(byMpn.entries()).map(([mpn, list]) => ({
    family: mpn,
    entries: [
      {
        family: mpn,
        brand: list[0]?.distributor ?? mpn,
        mpn,
        mcu: "",
        specs: list[0]?.leadTimeDays != null ? `${list[0].leadTimeDays}d factory lead` : "",
        tags: [] as string[],
        thumb: "",
        official: false,
        offers: list.map((o) => [
          o.distributor,
          bestPrice(o),
          o.stock,
          o.leadTimeDays != null ? `${o.leadTimeDays}d lead` : o.stock > 0 ? "In stock" : "Backorder",
          o.sourceUrl ?? "",
          o.distributor,
        ]),
      },
    ],
  }));
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

  // 1. Local catalog (fast, always available).
  let scored = CATALOG.map((e) => ({ entry: e, ...score(e, terms) })).filter(
    (x) => x.matched > 0,
  );
  // If any entry matches every query term, partial matches are noise — drop
  // them ("camera module" should not surface every entry tagged "module").
  if (scored.some((x) => x.matched === terms.length)) {
    scored = scored.filter((x) => x.matched === terms.length);
  }
  scored.sort((a, b) => b.weight - a.weight);

  const grouped = new Map<string, CatalogEntry[]>();
  for (const { entry } of scored) {
    const g = grouped.get(entry.family) ?? [];
    g.push(entry);
    grouped.set(entry.family, g);
  }
  const localGroups = Array.from(grouped.entries()).map(([family, entries]) => ({
    family,
    entries,
  }));

  // 2. Live distributor search via the sourcing layer (real manufacturer /
  //    distributor APIs). Only runs for a non-empty query.
  let liveGroups: ReturnType<typeof offersToGroups> = [];
  const providerErrors: Array<{ provider: string; error: string }> = [];
  if (q) {
    try {
      const { offers, errors } = await searchAll([q]);
      liveGroups = offersToGroups(offers);
      providerErrors.push(...errors);
    } catch (err) {
      providerErrors.push({
        provider: "sourcing",
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  const localMpns = new Set(
    localGroups.flatMap((g) => g.entries.map((e) => e.mpn.toLowerCase())),
  );
  // Avoid duplicating a part the local catalog already covers.
  const dedupedLive = liveGroups
    .filter((g) => !g.entries.some((e) => localMpns.has(e.mpn.toLowerCase())))
    // Offers only carry an MPN, so rank live groups by how many query terms
    // appear in it; in-stock breaks ties.
    .map((g) => {
      const mpn = g.family.toLowerCase();
      const hits = terms.filter((t) => mpn.includes(t)).length;
      const stock = g.entries[0]?.offers.some((o) => (o[2] as number) > 0) ? 1 : 0;
      return { g, hits, stock };
    })
    .sort((a, b) => b.hits - a.hits || b.stock - a.stock)
    .map((x) => x.g);

  const groups = [...localGroups, ...dedupedLive];
  const total = groups.reduce((n, g) => n + g.entries.length, 0);

  return NextResponse.json({
    total,
    groups,
    meta: {
      enabledProviders: enabledProviders(),
      providerErrors: providerErrors.length ? providerErrors : undefined,
    },
  });
}
