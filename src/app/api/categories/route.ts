import { NextResponse } from "next/server";
import { getCategories, getRegions } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json({ categories: getCategories() });
}
