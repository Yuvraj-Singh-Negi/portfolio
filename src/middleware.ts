import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = {
  window: 60 * 1000,
  max: 30,
};

const AUTH_ROUTES = ["/api/auth", "/api/v1"];
const PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

export function middleware(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const path = request.nextUrl.pathname;
  const method = request.method;

  // Rate limiting for API routes
  if (path.startsWith("/api/")) {
    const now = Date.now();
    const key = `${ip}:${path}`;
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT.window });
    } else {
      entry.count++;
      if (entry.count > RATE_LIMIT.max) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    }
  }

  // CSRF check for state-changing requests on auth routes
  if (
    path.startsWith("/api/") &&
    PROTECTED_METHODS.includes(method) &&
    !AUTH_ROUTES.some((route) => path.startsWith(route))
  ) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json(
        { error: "CSRF validation failed" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
