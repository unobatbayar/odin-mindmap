import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  accessCookieOptions,
  getAccessPin,
  isAccessRequired,
} from "@/lib/access";

export async function GET() {
  const cookieStore = await cookies();
  const granted = cookieStore.get(ACCESS_COOKIE)?.value === "1";

  return Response.json({
    granted,
    required: isAccessRequired(),
  });
}

export async function POST(request: Request) {
  const accessPin = getAccessPin();
  if (!accessPin) {
    return Response.json({ error: "Access PIN is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as { pin?: string };
  if (body.pin !== accessPin) {
    return Response.json({ error: "Invalid access PIN" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE, "1", accessCookieOptions());

  return Response.json({ granted: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
  return Response.json({ granted: false });
}
