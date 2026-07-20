import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCustomerDashboard } from "@/lib/mock-db";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  const dashboard = getCustomerDashboard(
    session.id,
    lat ? parseFloat(lat) : undefined,
    lng ? parseFloat(lng) : undefined
  );

  return NextResponse.json({ dashboard });
}
