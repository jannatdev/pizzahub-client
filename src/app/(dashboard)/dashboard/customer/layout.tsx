import { Suspense } from "react";
import type { ReactNode } from "react";

import { ContentSkeleton } from "@/components/dashboard/skeleton";
import { requireRole } from "@/lib/session";

/**
 * Route protection for /dashboard/customer/** — only signed-in customers may
 * enter; everyone else is redirected to their own dashboard (or /sign-in).
 */
export default function CustomerLayout({ children }: LayoutProps<"/dashboard/customer">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <CustomerOnly>{children}</CustomerOnly>
    </Suspense>
  );
}

async function CustomerOnly({ children }: { children: ReactNode }) {
  await requireRole("customer");
  return <>{children}</>;
}
