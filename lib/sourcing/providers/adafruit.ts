import type { Offer, SourcingProvider } from "../types";

export const adafruitProvider: SourcingProvider = {
  name: "adafruit",
  // Registered but always disabled — scraper not yet implemented.
  enabled: false,

  // TODO: scraper, not yet implemented
  search(_mpns: string[]): Promise<Offer[]> {
    throw new Error("adafruit provider not implemented");
  },
};
