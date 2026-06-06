import type { Offer, SourcingProvider } from "../types";

export const lcscProvider: SourcingProvider = {
  name: "lcsc",
  // Registered but always disabled — scraper not yet implemented.
  enabled: false,

  // TODO: scraper, not yet implemented
  search(_mpns: string[]): Promise<Offer[]> {
    throw new Error("lcsc provider not implemented");
  },
};
