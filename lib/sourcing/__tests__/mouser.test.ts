import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("MOUSER_API_KEY", "test-key");

const { mouserProvider } = await import("../providers/mouser");

const MOCK_RESPONSE = {
  SearchResults: {
    Parts: [
      {
        ManufacturerPartNumber: "TPS63020DSJT",
        MouserPartNumber: "595-TPS63020DSJT",
        Availability: "42 In Stock",
        Min: "1",
        Mult: "1",
        PriceBreaks: [
          { Quantity: 1, Price: "$3.25", Currency: "USD" },
          { Quantity: 25, Price: "$2.89", Currency: "USD" },
        ],
        LeadTime: "14 weeks",
        DataSheetUrl: "https://example.com/tps63020.pdf",
        ProductDetailUrl: "https://mouser.com/product/tps63020",
      },
    ],
  },
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_RESPONSE,
    }),
  );
});

describe("mouserProvider", () => {
  it("is enabled when API key present", () => {
    expect(mouserProvider.enabled).toBe(true);
  });

  it("parses stock from availability string", async () => {
    const [o] = await mouserProvider.search(["TPS63020DSJT"]);
    expect(o!.stock).toBe(42);
  });

  it("strips currency symbol from price breaks", async () => {
    const [o] = await mouserProvider.search(["TPS63020DSJT"]);
    expect(o!.priceBreaks[0]!.price).toBe(3.25);
    expect(o!.priceBreaks[1]!.price).toBe(2.89);
  });

  it("parses lead time in weeks to days", async () => {
    const [o] = await mouserProvider.search(["TPS63020DSJT"]);
    expect(o!.leadTimeDays).toBe(14);
  });

  it("returns empty on no results", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ SearchResults: { Parts: [] } }),
      }),
    );
    const offers = await mouserProvider.search(["NOTFOUND"]);
    expect(offers).toEqual([]);
  });
});
