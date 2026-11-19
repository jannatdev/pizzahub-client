import { Skeleton } from "@/components/ui/skeleton";

/**
 * Full dashboard shell placeholder — shown on a direct visit to /dashboard
 * while the session is being read (behind a <Suspense> boundary).
 */
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50" aria-hidden="true">
      {/* Sidebar placeholder (desktop / tablet) */}
      <div className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-5 border-r bg-white p-4 md:flex">
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-lg" />
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>

      {/* Content placeholder */}
      <div className="md:pl-64">
        <div className="flex h-16 items-center gap-3 border-b bg-white px-4 md:px-6">
          <Skeleton className="size-7 rounded-lg md:hidden" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="space-y-4 p-4 md:p-6 lg:p-8">
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Content-only placeholder — shown inside an already-rendered dashboard shell
 * (role guards and page-level loading states).
 */
export function ContentSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>
  );
}
