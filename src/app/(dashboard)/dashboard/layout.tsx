import { Suspense } from "react";
import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/dashboard/layout";
import { DashboardSkeleton } from "@/components/dashboard/skeleton";
import { getCurrentUser } from "@/lib/session";
import { getVendorPlan } from "@/lib/vendor-plan";
import Footer from "@/components/homepage/footer";

/**
 * Shell for every /dashboard/** route.
 *
 * Authorization happens here, server-side: `getCurrentUser` reads the real
 * Better Auth session and redirects signed-out visitors to /sign-in. Page
 * content ({children}) only renders after that check passes.
 *
 * The session read sits behind <Suspense> as required by Cache Components —
 * the skeleton ships instantly and the authenticated shell streams in.
 */
export default function DashboardRouteLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AuthorizedShell>{children}</AuthorizedShell>
    </Suspense>
  );
}

async function AuthorizedShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  // Vendors also resolve their plan from the backend so the shell can render
  // the Premium badge. A failed read simply means no badge — the backend is
  // still the only thing that enforces menu limits.
  const plan = user.role === "vendor" ? await getVendorPlan() : null;

  return (
    <div className="bg-red-50 ">
      <DashboardLayout user={{ ...user, isPremium: plan?.isPremium ?? false }}>
        {children}
         
      </DashboardLayout>
    
    </div>
  );
}

