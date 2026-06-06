export interface PriceBreak {
  qty: number;
  price: number;
}

export interface Offer {
  mpn: string;
  distributor: string;
  sku: string;
  stock: number;
  moq: number;
  orderMultiple: number;
  currency: string;
  priceBreaks: PriceBreak[];
  leadTimeDays: number | null;
  datasheetUrl: string | null;
  sourceUrl: string | null;
}

export interface SourcingProvider {
  readonly name: string;
  readonly enabled: boolean;
  search(mpns: string[]): Promise<Offer[]>;
}
