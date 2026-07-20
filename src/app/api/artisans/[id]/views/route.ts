import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getArtisanById, recordProfileView } from "@/lib/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!getArtisanById(id)) {
    return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
  }

  const session = await getSession();
  const view = recordProfileView(id, session?.id ?? null);
  return NextResponse.json({ view });
}
