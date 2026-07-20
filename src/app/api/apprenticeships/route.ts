import { NextResponse } from "next/server";
import { getApprenticeships } from "@/lib/mock-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listings = getApprenticeships({
    search: searchParams.get("search") ?? undefined,
    region: searchParams.get("region") ?? undefined,
    trade: searchParams.get("trade") ?? undefined,
  });
  return NextResponse.json({ listings });
}
