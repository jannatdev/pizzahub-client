import { Suspense } from "react";
import type { ReactNode } from "react";

import { ContentSkeleton } from "@/components/dashboard/skeleton";
import { requireRole } from "@/lib/session";

/**
 * Route protection for /dashboard/admin/** — admin-only. Customers and
 * vendors are redirected to their own dashboard before any admin page renders.
 */
export default function AdminLayout({ children }: LayoutProps<"/dashboard/admin">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <AdminOnly>{children}</AdminOnly>
    </Suspense>
  );
}

async function AdminOnly({ children }: { children: ReactNode }) {
  await requireRole("admin");
  return <>{children}</>;
}
