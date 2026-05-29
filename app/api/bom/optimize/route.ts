import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { optimize, DEFAULT_STRATEGY, OptimizationStrategy } from "@/lib/optimizer";

const RequestSchema = z.object({
  items: z
    .array(
      z.object({
        partNumber: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
  // Optional — sourced from boms.strategy at the UI layer; also accepted inline for direct API use
  strategy: z.enum(["lp", "greedy"]).optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { items, strategy } = parsed.data;
  const resolvedStrategy: OptimizationStrategy = strategy ?? DEFAULT_STRATEGY;

  // TODO: fetch quotes from distributor adapters in parallel
  const quotes: [] = [];

  const result = optimize({ items, quotes, strategy: resolvedStrategy });

  return NextResponse.json(result);
}
