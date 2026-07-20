import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getContactRequestsByUser } from "@/lib/mock-db";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = getContactRequestsByUser(session.id);
  return NextResponse.json({ contacts });
}
