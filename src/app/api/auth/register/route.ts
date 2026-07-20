import { NextResponse } from "next/server";
import { createUser, getUserByEmailOrPhone, toSessionUser } from "@/lib/mock-db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role, region, town } = body;

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    if (getUserByEmailOrPhone(email)) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 409 }
      );
    }

    const user = createUser({
      name,
      email,
      phone,
      password,
      role: (role as UserRole) ?? "user",
      region: region ?? "Greater Accra",
      town: town ?? "Accra",
      verified: false,
    });

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
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
