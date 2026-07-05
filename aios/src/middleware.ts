import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/api/auth", "/_next", "/favicon.ico"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (isPublic) {
    return NextResponse.next();
  }

  const authUrl = new URL("/api/auth/get-session", request.url);
  const response = await fetch(authUrl, {
    headers: { cookie: request.headers.get("cookie") || "" },
  });

  if (!response.ok) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("sign-in", "true");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
