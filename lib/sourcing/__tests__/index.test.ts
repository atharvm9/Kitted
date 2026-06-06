import { describe, it, expect, vi } from "vitest";

// No real providers enabled — test registry/dedupe logic with manual mocks
vi.mock("../providers/oemsecrets", () => ({
  oemsecretsProvider: { name: "oemsecrets", enabled: true, search: vi.fn() },
}));
vi.mock("../providers/trustedparts", () => ({
  trustedpartsProvider: { name: "trustedparts", enabled: false, search: vi.fn() },
}));
vi.mock("../providers/mouser", () => ({
  mouserProvider: { name: "mouser", enabled: true, search: vi.fn() },
}));
vi.mock("../providers/digikey", () => ({
  digikeyProvider: { name: "digikey", enabled: false, search: vi.fn() },
}));
vi.mock("../providers/arrow", () => ({
  arrowProvider: { name: "arrow", enabled: false, search: vi.fn() },
}));
vi.mock("../providers/element14", () => ({
  element14Provider: { name: "element14", enabled: false, search: vi.fn() },
}));
vi.mock("../providers/tti", () => ({
  ttiProvider: { name: "tti", enabled: false, search: vi.fn() },
}));
vi.mock("../providers/tme", () => ({
  tmeProvider: { name: "tme", enabled: false, search: vi.fn() },
}));
vi.mock("../providers/lcsc", () => ({ lcscProvider: { name: "lcsc", enabled: false, search: vi.fn() } }));
vi.mock("../providers/mcmaster", () => ({ mcmasterProvider: { name: "mcmaster", enabled: false, search: vi.fn() } }));
vi.mock("../providers/grainger", () => ({ graingerProvider: { name: "grainger", enabled: false, search: vi.fn() } }));
vi.mock("../providers/msc", () => ({ mscProvider: { name: "msc", enabled: false, search: vi.fn() } }));
vi.mock("../providers/misumi", () => ({ misumiProvider: { name: "misumi", enabled: false, search: vi.fn() } }));
vi.mock("../providers/adafruit", () => ({ adafruitProvider: { name: "adafruit", enabled: false, search: vi.fn() } }));

const { searchAll, enabledProviders } = await import("../index");
const { oemsecretsProvider } = await import("../providers/oemsecrets");
const { mouserProvider } = await import("../providers/mouser");

const OFFER_A = {
  mpn: "STM32F405", distributor: "DigiKey", sku: "STM32F405-ND",
  stock: 100, moq: 1, orderMultiple: 1, currency: "USD",
  priceBreaks: [{ qty: 1, price: 10 }],
  leadTimeDays: 3, datasheetUrl: null, sourceUrl: null,
};
const OFFER_B = { ...OFFER_A, distributor: "Mouser", sku: "STM32F405-MOUSER" };
// Duplicate of OFFER_A — same mpn/distributor/sku
const OFFER_A_DUP = { ...OFFER_A, stock: 999 };

describe("searchAll", () => {
  it("merges results from multiple providers", async () => {
    vi.mocked(oemsecretsProvider.search).mockResolvedValue([OFFER_A]);
    vi.mocked(mouserProvider.search).mockResolvedValue([OFFER_B]);

    const { offers, errors } = await searchAll(["STM32F405"]);
    expect(offers).toHaveLength(2);
    expect(errors).toHaveLength(0);
  });

  it("dedupes same mpn/distributor/sku", async () => {
    vi.mocked(oemsecretsProvider.search).mockResolvedValue([OFFER_A, OFFER_A_DUP]);
    vi.mocked(mouserProvider.search).mockResolvedValue([]);

    const { offers } = await searchAll(["STM32F405"]);
    expect(offers).toHaveLength(1);
  });

  it("captures provider errors without throwing", async () => {
    vi.mocked(oemsecretsProvider.search).mockRejectedValue(new Error("network fail"));
    vi.mocked(mouserProvider.search).mockResolvedValue([OFFER_B]);

    const { offers, errors } = await searchAll(["STM32F405"]);
    expect(offers).toHaveLength(1);
    expect(errors).toHaveLength(1);
    expect(errors[0]!.provider).toBe("oemsecrets");
    expect(errors[0]!.error).toContain("network fail");
  });

  it("returns empty for empty input", async () => {
    const { offers } = await searchAll([]);
    expect(offers).toHaveLength(0);
  });
});

describe("enabledProviders", () => {
  it("only lists enabled providers", () => {
    const names = enabledProviders();
    expect(names).toContain("oemsecrets");
    expect(names).toContain("mouser");
    expect(names).not.toContain("trustedparts");
    expect(names).not.toContain("lcsc");
  });
});
