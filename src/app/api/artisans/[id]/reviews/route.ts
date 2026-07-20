import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getArtisanById, createReview } from "@/lib/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  if (!getArtisanById(id)) {
    return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
  }

  const { rating, comment } = await request.json();
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const review = createReview({
    artisanId: id,
    userId: session.id,
    userName: session.name,
    rating,
    comment: comment ?? "",
  });

  return NextResponse.json({ review });
}
