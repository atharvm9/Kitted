import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("ELEMENT14_API_KEY", "test-key");

const { element14Provider } = await import("../providers/element14");

const MOCK_RESPONSE = {
  keywordSearchReturn: {
    products: [
      {
        sku: "58K4926",
        translatedManufacturerPartNumber: "LM741CN/NOPB",
        vendorName: "Newark",
        stock: 890,
        minOrder: 1,
        orderMultiple: 1,
        prices: [
          { from: 1, to: 9, cost: 0.72, currency: "USD" },
          { from: 10, to: 99, cost: 0.62, currency: "USD" },
        ],
        datasheets: [{ url: "https://example.com/lm741.pdf" }],
        productURL: "https://newark.com/product/lm741",
        leadTime: "3 days",
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

describe("element14Provider", () => {
  it("is enabled when API key present", () => {
    expect(element14Provider.enabled).toBe(true);
  });

  it("returns normalized offer", async () => {
    const [o] = await element14Provider.search(["LM741CN/NOPB"]);
    expect(o!.mpn).toBe("LM741CN/NOPB");
    expect(o!.distributor).toBe("Newark");
    expect(o!.stock).toBe(890);
    expect(o!.leadTimeDays).toBe(3);
    expect(o!.datasheetUrl).toBe("https://example.com/lm741.pdf");
    expect(o!.priceBreaks).toEqual([
      { qty: 1, price: 0.72 },
      { qty: 10, price: 0.62 },
    ]);
  });
});
