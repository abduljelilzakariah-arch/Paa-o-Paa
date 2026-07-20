import { cookies } from "next/headers";
import type { SessionUser } from "@/lib/types";

const SESSION_COOKIE = "paa_session";

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as SessionUser;
  } catch {
    return null;
  }
}

export function createSessionToken(user: SessionUser): string {
  return encodeURIComponent(JSON.stringify(user));
}

export { SESSION_COOKIE };
