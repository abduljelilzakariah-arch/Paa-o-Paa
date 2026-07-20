import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApplicationsByPoster } from "@/lib/mock-db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.role !== "artisan" && session.role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = getApplicationsByPoster(session);
  return NextResponse.json({ applications });
}
