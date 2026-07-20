import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApplicationsByUser, getApprenticeshipById } from "@/lib/mock-db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const apps = getApplicationsByUser(session.id).map((app) => ({
    ...app,
    listing: getApprenticeshipById(app.listingId),
  }));

  return NextResponse.json({ applications: apps });
}
