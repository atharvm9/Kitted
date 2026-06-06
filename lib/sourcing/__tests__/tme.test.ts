import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("TME_TOKEN", "test-token");
vi.stubEnv("TME_SECRET", "test-secret");

const { tmeProvider } = await import("../providers/tme");

const MOCK_RESPONSE = {
  Status: "OK",
  Data: {
    ProductList: [
      {
        Symbol: "GRM155R71C104KA01D",
        OriginalSymbol: "GRM155R71C104KA01D",
        Amount: 8200,
        MinAmount: 10,
        Multiples: 10,
        Price: 0.075,
        Currency: "USD",
        PriceList: [
          { Amount: 10, PriceValue: 0.075 },
          { Amount: 100, PriceValue: 0.065 },
        ],
      },
    ],
  },
};

beforeEach(() => {
  // crypto.subtle.importKey / sign are used for TME signing; mock the whole fetch
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => MOCK_RESPONSE,
    }),
  );
});

describe("tmeProvider", () => {
  it("is enabled when both env vars present", () => {
    expect(tmeProvider.enabled).toBe(true);
  });

  it("returns normalized offer", async () => {
    const [o] = await tmeProvider.search(["GRM155R71C104KA01D"]);
    expect(o!.distributor).toBe("TME");
    expect(o!.stock).toBe(8200);
    expect(o!.moq).toBe(10);
    expect(o!.priceBreaks).toEqual([
      { qty: 10, price: 0.075 },
      { qty: 100, price: 0.065 },
    ]);
    expect(o!.leadTimeDays).toBeNull();
  });
});
