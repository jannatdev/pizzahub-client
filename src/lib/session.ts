// Server-only module. Never import this from a "use client" component.
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { DASHBOARD_HOME } from "@/lib/dashboard-paths";
import type { AuthUser, UserRole } from "@/context/auth-context";



export const getCurrentUser = cache(async (): Promise<AuthUser> => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

  return {
    name: user.name,
    email: user.email,
    image: user.image ?? "",
    // `role` is registered as an additional field in src/lib/auth.ts, but it is
    // not part of Better Auth's inferred client type, so it is read defensively
    // and falls back to "customer".
    role: (user.role as UserRole | undefined) ?? "customer",
  };
});

/**
 * Same as `getCurrentUser`, but also enforces which role may visit the current
 * route. Anyone with the wrong role is sent to their own dashboard instead.
 *
 * Used by the role-based segment layouts:
 *   /dashboard/customer/**  → requireRole("customer")
 *   /dashboard/vendor/**    → requireRole("vendor")
 *   /dashboard/admin/**     → requireRole("admin")
 */
export async function requireRole(role: UserRole): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (user.role !== role) {
    redirect(DASHBOARD_HOME[user.role]);
  }

  return user;
}
