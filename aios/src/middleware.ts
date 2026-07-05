import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/api/auth", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const sessionUrl = new URL("/api/auth/get-session", request.url);
  const response = await fetch(sessionUrl, {
    headers: { cookie: request.headers.get("cookie") || "" },
  });

  if (!response.ok) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const body = await response.json().catch(() => null);
  if (!body || !body.user) {
    const loginUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
