import { OptimizerInput, OptimizationResult, Allocation } from "./types";
import { PriceBreak } from "../distributors/types";

// LP formulation:
// Variables: x[part][distributor][breakIndex] ∈ {0,1} (which price break "tier" is selected)
// For each part p, exactly one (distributor, break) pair must be selected.
// Minimize: sum over all selected (distributor, break) of unitPrice * qty_needed
//
// Since break tiers are discrete and part assignment is independent across parts
// (no shared shipping budget modeled yet), this reduces to: for each part, pick
// the (distributor, effective_break) combo with lowest total cost.
//
// Phase 2 will introduce distributor-level shipping cost variables and order
// minimum constraints, at which point parts become coupled and a true LP is needed.

interface Candidate {
  distributor: string;
  break: PriceBreak;
  totalCost: number;
  currency: string;
}

function candidatesForPart(
  partNumber: string,
  qty: number,
  quotes: OptimizerInput["quotes"]
): Candidate[] {
  const candidates: Candidate[] = [];

  for (const quote of quotes) {
    if (quote.partNumber !== partNumber) continue;

    // All breaks where qty >= required (must buy at least this many)
    // MOQ: if lowest break > qty, must buy up to that MOQ
    const sorted = [...quote.priceBreaks].sort((a, b) => a.qty - b.qty);

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];

      // This break applies when order qty falls in [current.qty, next.qty)
      const isApplicable = current.qty <= qty && (!next || qty < next.qty);

      // Also consider buying up to MOQ if needed
      const effectiveQty = Math.max(qty, current.qty);

      if (isApplicable || (i === 0 && qty < current.qty)) {
        candidates.push({
          distributor: quote.distributor,
          break: current,
          totalCost: current.unitPrice * effectiveQty,
          currency: current.currency,
        });
      }
    }
  }

  return candidates;
}

export function runLP(input: OptimizerInput): OptimizationResult {
  const allocations: Allocation[] = [];

  for (const item of input.items) {
    const candidates = candidatesForPart(item.partNumber, item.qty, input.quotes);

    if (candidates.length === 0) continue;

    // Minimize total cost — this is the LP objective per part (decoupled phase 1)
    const best = candidates.reduce((a, b) => (a.totalCost < b.totalCost ? a : b));
    const effectiveQty = Math.max(item.qty, best.break.qty);

    allocations.push({
      partNumber: item.partNumber,
      distributor: best.distributor,
      qty: effectiveQty,
      unitPrice: best.break.unitPrice,
      lineTotal: best.totalCost,
      currency: best.currency,
    });
  }

  const totalCost = allocations.reduce((sum, a) => sum + a.lineTotal, 0);

  return {
    strategy: "lp",
    allocations,
    totalCost,
    currency: allocations[0]?.currency ?? "USD",
  };
}
