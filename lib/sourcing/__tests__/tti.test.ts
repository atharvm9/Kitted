import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("TTI_API_KEY", "test-key");

const { ttiProvider } = await import("../providers/tti");

const MOCK_RESPONSE = {
  SearchResults: {
    Parts: [
      {
        ManufacturerPartNumber: "GRM155R71C104KA01D",
        TTIPartNumber: "TTI-GRM155R71C104KA01D",
        AvailableToSell: 50000,
        SalesMinimum: 10,
        SalesMultiple: 10,
        PriceBreaks: [
          { MinimumQuantity: 10, UnitPrice: 0.08, Currency: "USD" },
          { MinimumQuantity: 1000, UnitPrice: 0.06, Currency: "USD" },
        ],
        LeadTimeDays: 3,
        DatasheetURL: "https://example.com/grm155.pdf",
        ProductDetailURL: "https://tti.com/product",
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

describe("ttiProvider", () => {
  it("is enabled when API key present", () => {
    expect(ttiProvider.enabled).toBe(true);
  });

  it("returns normalized offer", async () => {
    const [o] = await ttiProvider.search(["GRM155R71C104KA01D"]);
    expect(o!.distributor).toBe("TTI");
    expect(o!.stock).toBe(50000);
    expect(o!.moq).toBe(10);
    expect(o!.leadTimeDays).toBe(3);
    expect(o!.priceBreaks).toEqual([
      { qty: 10, price: 0.08 },
      { qty: 1000, price: 0.06 },
    ]);
  });
});
