import { NextRequest, NextResponse } from "next/server";
import { CATALOG, CatalogEntry } from "@/lib/catalog/parts";

function score(entry: CatalogEntry, terms: string[]): number {
  if (!terms.length) return 1;
  const text = [entry.family, entry.brand, entry.mpn, entry.mcu, entry.specs, ...entry.tags]
    .join(" ")
    .toLowerCase();
  return terms.filter((t) => text.includes(t)).length / terms.length;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);

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

  return NextResponse.json({
    total: scored.length,
    groups: Array.from(grouped.entries()).map(([family, entries]) => ({
      family,
      entries,
    })),
  });
}
