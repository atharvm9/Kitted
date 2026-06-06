import type { Offer, SourcingProvider } from "../types";

export const misumiProvider: SourcingProvider = {
  name: "misumi",
  // Registered but always disabled — scraper not yet implemented.
  enabled: false,

  // TODO: scraper, not yet implemented
  search(_mpns: string[]): Promise<Offer[]> {
    throw new Error("misumi provider not implemented");
  },
};
