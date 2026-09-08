import { isAdminRequest } from "@/lib/admin";

export function unauthorizedIfLocked(request: Request): Response | null {
  if (!isAdminRequest(request)) {
    return Response.json({ error: "Admin unlock required" }, { status: 401 });
  }
  return null;
}
