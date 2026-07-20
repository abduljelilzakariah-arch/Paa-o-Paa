import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getArtisanById, recordContactRequest } from "@/lib/mock-db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const artisan = getArtisanById(id);
  if (!artisan) {
    return NextResponse.json({ error: "Artisan not found" }, { status: 404 });
  }

  const { channel } = await request.json();
  if (channel !== "phone" && channel !== "whatsapp") {
    return NextResponse.json({ error: "Invalid channel" }, { status: 400 });
  }

  const session = await getSession();
  recordContactRequest(id, channel, session?.id ?? null);

  const contact =
    channel === "phone"
      ? { type: "phone", value: artisan.phone }
      : { type: "whatsapp", value: artisan.whatsapp };

  return NextResponse.json({ contact });
}
