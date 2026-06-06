import type { Offer, SourcingProvider } from "../types";

export const graingerProvider: SourcingProvider = {
  name: "grainger",
  // Registered but always disabled — scraper not yet implemented.
  enabled: false,

  // TODO: scraper, not yet implemented
  search(_mpns: string[]): Promise<Offer[]> {
    throw new Error("grainger provider not implemented");
  },
};
