import { NextResponse } from "next/server";
import { getRegions } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json({ regions: getRegions() });
}
