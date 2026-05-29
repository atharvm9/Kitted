import { OptimizerInput, OptimizationResult, Allocation } from "./types";
import { PriceBreak } from "../distributors/types";

function effectiveUnitPrice(breaks: PriceBreak[], qty: number): PriceBreak | null {
  // Find highest break quantity that is <= qty (standard tiered pricing)
  const applicable = breaks
    .filter((b) => b.qty <= qty)
    .sort((a, b) => b.qty - a.qty);
  return applicable[0] ?? null;
}

export function runGreedy(input: OptimizerInput): OptimizationResult {
  const allocations: Allocation[] = [];

  for (const item of input.items) {
    const quotes = input.quotes.filter((q) => q.partNumber === item.partNumber);

    let best: { distributor: string; unitPrice: number; currency: string } | null = null;

    for (const quote of quotes) {
      const pb = effectiveUnitPrice(quote.priceBreaks, item.qty);
      if (!pb) continue;
      if (!best || pb.unitPrice < best.unitPrice) {
        best = { distributor: quote.distributor, unitPrice: pb.unitPrice, currency: pb.currency };
      }
    }

    if (!best) continue;

    allocations.push({
      partNumber: item.partNumber,
      distributor: best.distributor,
      qty: item.qty,
      unitPrice: best.unitPrice,
      lineTotal: best.unitPrice * item.qty,
      currency: best.currency,
    });
  }

  const totalCost = allocations.reduce((sum, a) => sum + a.lineTotal, 0);

  return {
    strategy: "greedy",
    allocations,
    totalCost,
    currency: allocations[0]?.currency ?? "USD",
  };
}
