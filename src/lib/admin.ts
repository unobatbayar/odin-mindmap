import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "odin_admin_session";
const SESSION_PAYLOAD = "odin-admin-session-v1";

/** Server-only admin PIN. Returns null if not configured. */
export function getAdminPin(): string | null {
  const pin = process.env.ADMIN_PIN?.trim();
  return pin || null;
}

/** HMAC of a fixed payload — cookie value cannot be forged without the PIN. */
export function adminSessionToken(pin = getAdminPin()): string | null {
  if (!pin) return null;
  return createHmac("sha256", pin).update(SESSION_PAYLOAD).digest("hex");
}

export function readCookieValue(
  cookieHeader: string,
  name: string,
): string | null {
  const prefix = `${name}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length);
    }
  }
  return null;
}

export function isAdminCookie(value: string | null | undefined): boolean {
  const expected = adminSessionToken();
  if (!expected || !value) return false;
  return safeEqualPin(value, expected);
}

export function isAdminRequest(request: Request): boolean {
  return isAdminCookie(readCookieValue(request.headers.get("cookie") ?? "", ADMIN_COOKIE));
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Constant-time string compare for PIN / session checks. */
export function safeEqualPin(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    timingSafeEqual(a, Buffer.alloc(a.length));
    return false;
  }
  return timingSafeEqual(a, b);
}
