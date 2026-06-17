import { cookies } from "next/headers";
import { ADMIN_COOKIE, getAdminPin } from "@/lib/admin";

export async function GET() {
  const cookieStore = await cookies();
  const unlocked = cookieStore.get(ADMIN_COOKIE)?.value === "1";
  return Response.json({ unlocked });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { pin?: string };
  if (body.pin !== getAdminPin()) {
    return Response.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return Response.json({ unlocked: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  return Response.json({ unlocked: false });
}
