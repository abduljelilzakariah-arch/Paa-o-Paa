import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getApprenticeshipById, createApplication } from "@/lib/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const listing = getApprenticeshipById(id);
  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  const { statement } = await request.json();
  if (!statement?.trim()) {
    return NextResponse.json(
      { error: "Statement of interest is required" },
      { status: 400 }
    );
  }

  const application = createApplication({
    listingId: id,
    applicantId: session.id,
    applicantName: session.name,
    statement: statement.trim(),
    status: "submitted",
  });

  return NextResponse.json({ application });
}
