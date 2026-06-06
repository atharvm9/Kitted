import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("TRUSTEDPARTS_API_KEY", "test-key");

const { trustedpartsProvider } = await import("../providers/trustedparts");

const MOCK_RESPONSE = {
  results: [
    {
      mpn: "STM32F405RGT6",
      offers: [
        {
          seller: { name: "Mouser" },
          sku: "511-STM32F405RGT6",
          in_stock_quantity: 42,
          moq: 1,
          order_multiple: 1,
          currency: "USD",
          prices: [
            { quantity: 1, price: "12.50" },
            { quantity: 10, price: "10.80" },
          ],
          factory_lead_days: 14,
          datasheet_url: "https://example.com/stm32.pdf",
          click_url: "https://mouser.com/product/stm32",
        },
      ],
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

describe("trustedpartsProvider", () => {
  it("is enabled when API key present", () => {
    expect(trustedpartsProvider.enabled).toBe(true);
  });

  it("returns normalized Offer[]", async () => {
    const offers = await trustedpartsProvider.search(["STM32F405RGT6"]);
    expect(offers).toHaveLength(1);
    const [o] = offers;
    expect(o!.mpn).toBe("STM32F405RGT6");
    expect(o!.distributor).toBe("Mouser");
    expect(o!.stock).toBe(42);
    expect(o!.leadTimeDays).toBe(14);
    expect(o!.priceBreaks).toEqual([
      { qty: 1, price: 12.5 },
      { qty: 10, price: 10.8 },
    ]);
  });

  it("batches >50 MPNs into multiple requests", async () => {
    const mpns = Array.from({ length: 55 }, (_, i) => `PART${i}`);
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    });
    vi.stubGlobal("fetch", mockFetch);
    await trustedpartsProvider.search(mpns);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
