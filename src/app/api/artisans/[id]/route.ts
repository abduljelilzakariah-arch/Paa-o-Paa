import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getArtisanById, getReviewsByArtisan, isArtisanSaved } from "@/lib/mock-db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artisan = getArtisanById(id);
  if (!artisan) {
    return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
  }
  const reviews = getReviewsByArtisan(id);
  const session = await getSession();
  const saved = session ? isArtisanSaved(session.id, id) : false;
  const userReview = session
    ? reviews.find((r) => r.userId === session.id) ?? null
    : null;

  return NextResponse.json({ artisan, reviews, saved, userReview });
}