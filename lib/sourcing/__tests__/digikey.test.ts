import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("DIGIKEY_CLIENT_ID", "test-id");
vi.stubEnv("DIGIKEY_CLIENT_SECRET", "test-secret");

const { digikeyProvider } = await import("../providers/digikey");

const MOCK_TOKEN = { access_token: "tok", expires_in: 3600 };
const MOCK_SEARCH = {
  Products: [
    {
      ManufacturerProductNumber: "MPU-6000",
      DigiKeyPartNumber: "1458-1018-ND",
      QuantityAvailable: 2500,
      MinimumOrderQuantity: 1,
      StandardPackage: 1,
      Currency: "USD",
      StandardPricing: [
        { BreakQuantity: 1, UnitPrice: 8.5 },
        { BreakQuantity: 10, UnitPrice: 7.9 },
      ],
      ManufacturerLeadWeeks: 2,
      PrimaryDatasheet: "https://example.com/mpu6000.pdf",
      ProductUrl: "https://digikey.com/product/mpu6000",
    },
  ],
};

beforeEach(() => {
  let callCount = 0;
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(async (url: string) => {
      callCount++;
      // First call = token, subsequent = search
      if (String(url).includes("oauth2/token")) {
        return { ok: true, status: 200, json: async () => MOCK_TOKEN };
      }
      return { ok: true, status: 200, json: async () => MOCK_SEARCH };
    }),
  );
});

describe("digikeyProvider", () => {
  it("is enabled when both env vars present", () => {
    expect(digikeyProvider.enabled).toBe(true);
  });

  it("fetches token then searches", async () => {
    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => MOCK_TOKEN })
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => MOCK_SEARCH });
    vi.stubGlobal("fetch", mockFetch);

    const offers = await digikeyProvider.search(["MPU-6000"]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(offers).toHaveLength(1);
  });

  it("converts lead weeks to days", async () => {
    const [o] = await digikeyProvider.search(["MPU-6000"]);
    expect(o!.leadTimeDays).toBe(14); // 2 weeks * 7
  });

  it("returns correct price breaks", async () => {
    const [o] = await digikeyProvider.search(["MPU-6000"]);
    expect(o!.priceBreaks).toEqual([
      { qty: 1, price: 8.5 },
      { qty: 10, price: 7.9 },
    ]);
  });
});
