import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Optimistic route protection (Next.js 16: the middleware file is now called
 * `proxy`).
 *
 * This only checks that a Better Auth session cookie EXISTS — no database work
 * happens here, because Proxy runs on every request (including prefetches).
 *
 * The real authorization (valid session + correct role per route) is enforced
 * server-side in the dashboard layouts via src/lib/session.ts, so this file is
 * just an early redirect for clearly signed-out visitors.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isDashboardRoute && !getSessionCookie(request)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
