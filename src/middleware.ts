import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ACCESS_COOKIE, isAccessDisabled, isAccessRequired } from "@/lib/access";

function isPublicPath(pathname: string): boolean {
  return pathname === "/login" || pathname.startsWith("/api/access");
}

export function middleware(request: NextRequest) {
  if (!isAccessRequired() || isAccessDisabled()) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const hasAccess = request.cookies.get(ACCESS_COOKIE)?.value === "1";

  if (isPublicPath(pathname)) {
    if (pathname === "/login" && hasAccess) {
      const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") ?? "/mindmap";
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
    return NextResponse.next();
  }

  if (!hasAccess) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
