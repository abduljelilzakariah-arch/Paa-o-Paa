import { NextResponse } from "next/server";
import { getUserByEmailOrPhone, toSessionUser } from "@/lib/mock-db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Email/phone and password are required" },
        { status: 400 }
      );
    }

    const user = getUserByEmailOrPhone(identifier);
    if (!user || user.password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const session = toSessionUser(user);
    const response = NextResponse.json({ success: true, user: session });
    response.cookies.set(SESSION_COOKIE, createSessionToken(session), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
