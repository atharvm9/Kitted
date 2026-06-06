import type { Offer, SourcingProvider } from "./types";
import { oemsecretsProvider } from "./providers/oemsecrets";
import { trustedpartsProvider } from "./providers/trustedparts";
import { mouserProvider } from "./providers/mouser";
import { digikeyProvider } from "./providers/digikey";
import { arrowProvider } from "./providers/arrow";
import { element14Provider } from "./providers/element14";
import { ttiProvider } from "./providers/tti";
import { tmeProvider } from "./providers/tme";
// Stubs — registered but always disabled
import { lcscProvider } from "./providers/lcsc";
import { mcmasterProvider } from "./providers/mcmaster";
import { graingerProvider } from "./providers/grainger";
import { mscProvider } from "./providers/msc";
import { misumiProvider } from "./providers/misumi";
import { adafruitProvider } from "./providers/adafruit";

export type { Offer, SourcingProvider } from "./types";

const ALL_PROVIDERS: SourcingProvider[] = [
  oemsecretsProvider,
  trustedpartsProvider,
  mouserProvider,
  digikeyProvider,
  arrowProvider,
  element14Provider,
  ttiProvider,
  tmeProvider,
  // stubs
  lcscProvider,
  mcmasterProvider,
  graingerProvider,
  mscProvider,
  misumiProvider,
  adafruitProvider,
];

/**
 * Run all enabled providers in parallel and return merged, deduped Offer[].
 * A provider failing never blocks the others.
 */
export async function searchAll(mpns: string[]): Promise<{
  offers: Offer[];
  errors: Array<{ provider: string; error: string }>;
}> {
  if (mpns.length === 0) return { offers: [], errors: [] };

  const enabled = ALL_PROVIDERS.filter((p) => p.enabled);
  const settled = await Promise.allSettled(
    enabled.map((p) => p.search(mpns).then((offers) => ({ provider: p.name, offers }))),
  );

  const offers: Offer[] = [];
  const errors: Array<{ provider: string; error: string }> = [];

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i]!;
    if (result.status === "fulfilled") {
      offers.push(...result.value.offers);
    } else {
      errors.push({
        provider: enabled[i]!.name,
        error: result.reason instanceof Error ? result.reason.message : String(result.reason),
      });
    }
  }

  return { offers: dedupe(offers), errors };
}

/**
 * Dedupe by (mpn, distributor, sku) — keeps the first seen.
 * When the same offer appears from multiple meta-aggregators, prefer the one
 * with more price breaks.
 */
function dedupe(offers: Offer[]): Offer[] {
  const seen = new Map<string, Offer>();
  for (const offer of offers) {
    const key = `${offer.mpn}|${offer.distributor.toLowerCase()}|${offer.sku}`;
    const existing = seen.get(key);
    if (!existing || offer.priceBreaks.length > existing.priceBreaks.length) {
      seen.set(key, offer);
    }
  }
  return Array.from(seen.values());
}

/** Expose enabled provider names for diagnostics. */
export function enabledProviders(): string[] {
  return ALL_PROVIDERS.filter((p) => p.enabled).map((p) => p.name);
}
