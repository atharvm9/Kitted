export interface PriceBreak {
  qty: number;
  unitPrice: number;
  currency: string;
}

export interface Distributor {
  name: string;
  getPrice(partNumber: string, qty: number): Promise<PriceBreak[]>;
}
