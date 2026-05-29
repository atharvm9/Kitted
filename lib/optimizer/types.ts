import { PriceBreak } from "../distributors/types";

export type OptimizationStrategy = "lp" | "greedy";

export interface BomItem {
  partNumber: string;
  qty: number;
}

export interface DistributorQuote {
  distributor: string;
  partNumber: string;
  priceBreaks: PriceBreak[];
}

export interface Allocation {
  partNumber: string;
  distributor: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  currency: string;
}

export interface OptimizationResult {
  strategy: OptimizationStrategy;
  allocations: Allocation[];
  totalCost: number;
  currency: string;
}

export interface OptimizerInput {
  items: BomItem[];
  quotes: DistributorQuote[];
  strategy?: OptimizationStrategy;
}
