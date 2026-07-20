import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { updateApplicationStatus } from "@/lib/mock-db";
import type { Application } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (session.role !== "artisan" && session.role !== "business") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await request.json();

  const valid: Application["status"][] = [
    "submitted",
    "under_review",
    "accepted",
    "declined",
  ];
  if (!valid.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = updateApplicationStatus(id, status, session);
  if (!updated) {
    return NextResponse.json({ error: "Application not found or forbidden" }, { status: 404 });
  }

  return NextResponse.json({ application: updated });
}
