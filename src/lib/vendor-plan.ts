// Server-only module. Never import this from a "use client" component.
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface VendorPlan {
  subscription: string;
  isPremium: boolean;
  count: number;
  freeLimit: number;
  canAddMenu: boolean;
}

/**
 * Resolves the signed-in vendor's plan from the backend API
 * (GET /api/menu/vendor/count) by forwarding only the Better Auth session
 * cookie, so the backend — not this app — decides the plan.
 *
 * Returns `null` when the API is unreachable, the session cookie is missing,
 * or the caller isn't a vendor. Callers must treat `null` as "not premium"
 * (display only — the backend enforces the real limits regardless).
 *
 * Must be called behind a <Suspense> boundary: it reads `cookies()`, which
 * cannot be part of the Cache Components static shell.
 */
export async function getVendorPlan(): Promise<VendorPlan | null> {
  if (!API_URL) return null;

  try {
    const cookieStore = await cookies();

    // Forward only the auth cookies (not the whole jar) to the API origin.
    const sessionCookie = cookieStore
      .getAll()
      .filter((cookie) => cookie.name.includes("better-auth"))
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");

    if (!sessionCookie) return null;

    const response = await fetch(`${API_URL}/api/menu/vendor/count`, {
      headers: { cookie: sessionCookie },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();

    return {
      subscription:
        typeof data?.subscription === "string" ? data.subscription : "free",
      isPremium: Boolean(data?.isPremium),
      count: Number(data?.count ?? 0),
      freeLimit: Number(data?.freeLimit ?? 3),
      canAddMenu: Boolean(data?.canAddMenu),
    };
  } catch {
    // Backend unreachable — never let a failed plan read break the dashboard.
    return null;
  }
}
