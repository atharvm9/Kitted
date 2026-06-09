import type { Offer, SourcingProvider } from "../types";

export const mcmasterProvider: SourcingProvider = {
  name: "mcmaster",
  // Registered but always disabled — scraper not yet implemented.
  enabled: false,

  // No public buyer API — surfaced via link-only storefront tiles in the UI.
  // Safe no-op so the sourcing fan-out can never throw if re-enabled.
  search(_mpns: string[]): Promise<Offer[]> {
    return Promise.resolve([]);
  },
};
