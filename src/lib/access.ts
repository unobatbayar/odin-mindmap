export const ACCESS_COOKIE = "odin_access_session";

export function isAccessDisabled(): boolean {
  return process.env.ACCESS_DISABLED === "true";
}

export function isAccessRequired(): boolean {
  if (isAccessDisabled()) return false;
  return Boolean(getAccessPin());
}

export function getAccessPin(): string | null {
  const pin = process.env.ACCESS_PIN?.trim();
  return pin || null;
}

export function isAccessRequest(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${ACCESS_COOKIE}=1(?:;|$)`).test(cookie);
}

export function accessCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === "production",
  };
}
