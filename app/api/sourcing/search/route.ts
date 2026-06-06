import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { searchAll, enabledProviders } from "@/lib/sourcing";

const RequestSchema = z.object({
  mpns: z.array(z.string().min(1).trim()).min(1).max(200),
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
      { status: 422 },
    );
  }

  const { mpns } = parsed.data;
  const { offers, errors } = await searchAll(mpns);

  return NextResponse.json({
    offers,
    meta: {
      mpns,
      enabledProviders: enabledProviders(),
      providerErrors: errors.length > 0 ? errors : undefined,
    },
  });
}
