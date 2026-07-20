import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();
  if (!code || code.length !== 6) {
    return NextResponse.json(
      { success: false, error: "Enter a 6-digit code" },
      { status: 400 }
    );
  }
  // Dummy: accept any 6-digit code (demo: 123456)
  return NextResponse.json({ success: true, message: "Phone verified" });
}
