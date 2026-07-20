import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getSavedArtisans, toggleSavedArtisan } from "@/lib/mock-db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const saved = getSavedArtisans(session.id);
  return NextResponse.json({ saved });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { artisanId } = await request.json();
  if (!artisanId) {
    return NextResponse.json({ error: "Artisan ID required" }, { status: 400 });
  }

  const result = toggleSavedArtisan(session.id, artisanId);
  return NextResponse.json(result);
}
