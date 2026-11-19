import { Suspense } from "react";
import type { ReactNode } from "react";

import { ContentSkeleton } from "@/components/dashboard/skeleton";
import { requireRole } from "@/lib/session";

/**
 * Route protection for /dashboard/vendor/** — only signed-in vendors may
 * enter; everyone else is redirected to their own dashboard (or /sign-in).
 */
export default function VendorLayout({ children }: LayoutProps<"/dashboard/vendor">) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <VendorOnly>{children}</VendorOnly>
    </Suspense>
  );
}

async function VendorOnly({ children }: { children: ReactNode }) {
  await requireRole("vendor");
  return <>{children}</>;
}
