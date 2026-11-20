import AdminOverviewTable from "@/components/card/AdminOverviewTable";
import { getAdminOverview } from "@/lib/api/admin/adminOverview";
import { Suspense } from "react";

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
}


 async function AdminOverviewContent() {
  const stats = await getAdminOverview();

  return <AdminOverviewTable stats={stats} />;
}
export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your PizzaHub platform from one place.
        </p>
      </div>

      {/* Overview Table */}
      <Suspense
        fallback={
          <div className="rounded-xl border p-8 text-center text-muted-foreground">
            Loading admin overview...
          </div>
        }
      >
        <AdminOverviewContent />
      </Suspense>
    </div>
  );
}