import { NextRequest, NextResponse } from "next/server";
import { CATALOG, CatalogEntry } from "@/lib/catalog/parts";
import { searchAll, enabledProviders, type Offer } from "@/lib/sourcing";

function score(entry: CatalogEntry, terms: string[]): number {
  if (!terms.length) return 1;
  const text = [entry.family, entry.brand, entry.mpn, entry.mcu, entry.specs, ...entry.tags]
    .join(" ")
    .toLowerCase();
  return terms.filter((t) => text.includes(t)).length / terms.length;
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
  const scored = CATALOG.map((e) => ({ entry: e, s: score(e, terms) })).filter(
    (x) => x.s > 0,
  );
  scored.sort((a, b) => b.s - a.s);

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
  const dedupedLive = liveGroups.filter(
    (g) => !g.entries.some((e) => localMpns.has(e.mpn.toLowerCase())),
  );

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
