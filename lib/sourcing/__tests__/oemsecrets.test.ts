import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("OEMSECRETS_API_KEY", "test-key");

// Must import after env stub so `enabled` is evaluated with key present
const { oemsecretsProvider } = await import("../providers/oemsecrets");

const MOCK_RESPONSE = {
  parts: [
    {
      distributor: "DigiKey",
      sku: "GRM155R71C104KA01D-ND",
      stock: 14200,
      moq: 1,
      order_multiple: 1,
      currency: "USD",
      price_breaks: [
        { qty: 1, price: 0.12 },
        { qty: 100, price: 0.09 },
      ],
      lead_time: null,
      datasheet: "https://example.com/datasheet.pdf",
      product_url: "https://digikey.com/product",
    },
  ],
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

describe("oemsecretsProvider", () => {
  it("is enabled when API key present", () => {
    expect(oemsecretsProvider.enabled).toBe(true);
  });

  it("returns normalized Offer[]", async () => {
    const offers = await oemsecretsProvider.search(["GRM155R71C104KA01D"]);
    expect(offers).toHaveLength(1);
    const [o] = offers;
    expect(o!.mpn).toBe("GRM155R71C104KA01D");
    expect(o!.distributor).toBe("DigiKey");
    expect(o!.sku).toBe("GRM155R71C104KA01D-ND");
    expect(o!.stock).toBe(14200);
    expect(o!.priceBreaks).toEqual([
      { qty: 1, price: 0.12 },
      { qty: 100, price: 0.09 },
    ]);
    expect(o!.datasheetUrl).toBe("https://example.com/datasheet.pdf");
  });

  it("returns empty array on empty parts response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({}) }),
    );
    const offers = await oemsecretsProvider.search(["UNKNOWN"]);
    expect(offers).toEqual([]);
  });
});
