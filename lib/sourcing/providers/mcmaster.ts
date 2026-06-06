import type { Offer, SourcingProvider } from "../types";

export const mcmasterProvider: SourcingProvider = {
  name: "mcmaster",
  // Registered but always disabled — scraper not yet implemented.
  enabled: false,

  // TODO: scraper, not yet implemented
  search(_mpns: string[]): Promise<Offer[]> {
    throw new Error("mcmaster provider not implemented");
  },
};
