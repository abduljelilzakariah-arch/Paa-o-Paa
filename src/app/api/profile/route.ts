import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserById, updateUser, toSessionUser } from "@/lib/mock-db";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const user = getUserById(session.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json({ user: toSessionUser(user) });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const updates = await request.json();
  const user = updateUser(session.id, updates);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sessionUser = toSessionUser(user);
  const response = NextResponse.json({ user: sessionUser });
  response.cookies.set(SESSION_COOKIE, createSessionToken(sessionUser), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
