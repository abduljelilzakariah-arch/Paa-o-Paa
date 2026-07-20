import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getArtisans, getTopReviewSnippet, isArtisanSaved } from "@/lib/mock-db";
import type { ArtisanSort } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radius = searchParams.get("radius");
  const minRating = searchParams.get("minRating");
  const verifiedOnly = searchParams.get("verifiedOnly") === "true";
  const sort = (searchParams.get("sort") as ArtisanSort) || undefined;

  const session = await getSession();

  const artisans = getArtisans({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    lat: lat ? parseFloat(lat) : undefined,
    lng: lng ? parseFloat(lng) : undefined,
    radiusKm: radius ? parseFloat(radius) : undefined,
    minRating: minRating ? parseFloat(minRating) : undefined,
    verifiedOnly,
    sort,
  }).map((a) => ({
    ...a,
    reviewSnippet: getTopReviewSnippet(a.id),
    saved: session ? isArtisanSaved(session.id, a.id) : false,
  }));

  return NextResponse.json({ artisans });
}