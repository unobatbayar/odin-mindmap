export const ADMIN_COOKIE = "odin_admin_session";

export function getAdminPin(): string {
  return process.env.ADMIN_PIN ?? process.env.NEXT_PUBLIC_ADMIN_PIN ?? "1234";
}

export function isAdminRequest(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return new RegExp(`(?:^|;\\s*)${ADMIN_COOKIE}=1(?:;|$)`).test(cookie);
}
