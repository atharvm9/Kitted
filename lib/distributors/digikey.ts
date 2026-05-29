import { Distributor, PriceBreak } from "./types";

const SANDBOX_BASE = "https://sandbox-api.digikey.com";
const TOKEN_URL = "https://sandbox-api.digikey.com/v1/oauth2/token";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const clientId = process.env.DIGIKEY_CLIENT_ID;
  const clientSecret = process.env.DIGIKEY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("DIGIKEY_CLIENT_ID and DIGIKEY_CLIENT_SECRET must be set");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`DigiKey token fetch failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  return cachedToken.value;
}

export const digikeyDistributor: Distributor = {
  name: "digikey",

  async getPrice(partNumber: string, qty: number): Promise<PriceBreak[]> {
    const token = await getAccessToken();

    const res = await fetch(
      `${SANDBOX_BASE}/products/v4/search/${encodeURIComponent(partNumber)}/productdetails`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-DIGIKEY-Client-Id": process.env.DIGIKEY_CLIENT_ID!,
          "X-DIGIKEY-Locale-Site": "US",
          "X-DIGIKEY-Locale-Language": "en",
          "X-DIGIKEY-Locale-Currency": "USD",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`DigiKey product lookup failed: ${res.status}`);
    }

    const data = await res.json();

    // Sandbox response shape: data.Product.StandardPricing[]
    const pricing: Array<{ BreakQuantity: number; UnitPrice: number }> =
      data?.Product?.StandardPricing ?? [];

    if (pricing.length === 0) return [];

    return pricing.map((p) => ({
      qty: p.BreakQuantity,
      unitPrice: p.UnitPrice,
      currency: "USD",
    }));
  },
};
