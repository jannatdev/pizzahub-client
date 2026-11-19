import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ContentSkeleton } from "@/components/dashboard/skeleton";
import { DASHBOARD_HOME } from "@/lib/dashboard-paths";
import { getCurrentUser } from "@/lib/session";

/**
 * /dashboard is a shortcut URL: it sends each role to its own overview page
 * (customer → /dashboard/customer, vendor → /dashboard/vendor, admin → /dashboard/admin).
 */
export default function DashboardIndexPage() {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <RedirectToRoleHome />
    </Suspense>
  );
}

async function RedirectToRoleHome() {
  const user = await getCurrentUser();
  redirect(DASHBOARD_HOME[user.role]);
  return null; // unreachable — redirect() interrupts rendering
}
