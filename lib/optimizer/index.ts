import { OptimizerInput, OptimizationResult, OptimizationStrategy } from "./types";
import { runGreedy } from "./greedy";
import { runLP } from "./lp";

export const DEFAULT_STRATEGY: OptimizationStrategy = "lp";

export function optimize(input: OptimizerInput): OptimizationResult {
  const strategy = input.strategy ?? DEFAULT_STRATEGY;
  return strategy === "greedy" ? runGreedy(input) : runLP(input);
}

export type { OptimizationStrategy, OptimizationResult, OptimizerInput, Allocation, BomItem, DistributorQuote } from "./types";
