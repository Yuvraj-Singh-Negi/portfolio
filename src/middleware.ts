import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger, logRequest } from "@/lib/logger";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT = {
  window: 60 * 1000,
  max: 30,
};

const AUTH_ROUTES = ["/api/auth", "/api/v1"];
const PROTECTED_METHODS = ["POST", "PUT", "PATCH", "DELETE"];

function generateRequestId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const path = request.nextUrl.pathname;
  const method = request.method;

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  if (path.startsWith("/api/")) {
    const now = Date.now();
    const key = `${ip}:${path}`;
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT.window });
    } else {
      entry.count++;
      if (entry.count > RATE_LIMIT.max) {
        logger.warn({ requestId, ip, path, count: entry.count }, 'Rate limit exceeded');
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429, headers: { "x-request-id": requestId } }
        );
      }
    }

    if (
      PROTECTED_METHODS.includes(method) &&
      !AUTH_ROUTES.some((route) => path.startsWith(route))
    ) {
      const origin = request.headers.get("origin");
      const host = request.headers.get("host");
      if (origin && host && !origin.includes(host)) {
        logger.warn({ requestId, ip, path, origin, host }, 'CSRF validation failed');
        return NextResponse.json(
          { error: "CSRF validation failed" },
          { status: 403, headers: { "x-request-id": requestId } }
        );
      }
    }
  }

  logRequest(request, requestId, startTime);
  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
