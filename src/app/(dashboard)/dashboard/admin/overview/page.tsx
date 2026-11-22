
"use client";

import { useEffect, useState } from "react";
import AdminOverviewTable from "@/components/card/admin/AdminOverviewTable";
import { getAdminOverview } from "@/lib/api/admin/adminOverview";

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalTransactions: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await getAdminOverview();
        setStats(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Admin Overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your PizzaHub platform from one place.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          Loading admin overview...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive p-8 text-center text-destructive">
          {error}
        </div>
      ) : stats ? (
        <AdminOverviewTable stats={stats} />
      ) : null}
    </div>
  );
}
