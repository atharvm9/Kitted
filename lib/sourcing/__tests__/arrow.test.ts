import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubEnv("ARROW_API_KEY", "test-key");

const { arrowProvider } = await import("../providers/arrow");

const MOCK_RESPONSE = {
  itemserviceresult: {
    data: [
      {
        PartNum: "RC0603FR-0710KL",
        itemno: "RC0603FR-0710KL-ND",
        InvOrg: { Qty: 999999 },
        MinOrderQty: 1,
        SalesMult: 1,
        Prices: {
          currency: "USD",
          resaleList: [
            { minQty: 1, resalePrice: 0.01 },
            { minQty: 1000, resalePrice: 0.007 },
          ],
        },
        LeadTime: { Weeks: 0 },
        urlData: [{ type: "datasheet", value: "https://example.com/rc0603.pdf" }],
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

describe("arrowProvider", () => {
  it("is enabled when API key present", () => {
    expect(arrowProvider.enabled).toBe(true);
  });

  it("returns normalized offer", async () => {
    const [o] = await arrowProvider.search(["RC0603FR-0710KL"]);
    expect(o!.distributor).toBe("Arrow");
    expect(o!.stock).toBe(999999);
    expect(o!.priceBreaks).toHaveLength(2);
    expect(o!.datasheetUrl).toBe("https://example.com/rc0603.pdf");
    expect(o!.leadTimeDays).toBe(0);
  });
});
