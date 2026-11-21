
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import type { Order, OrderStatus } from "@/type/order";
import { getMyOrders } from "@/lib/api/order";
import OrderCard from "@/components/card/customer/myOrderCard";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ShoppingBag,
  RefreshCw,
  PackageOpen,
} from "lucide-react";

type Filter = "All" | OrderStatus;

const FILTERS: Filter[] = [
  "All",
  "Pending",
  "Accepted",
  "Rejected",
  "Cancelled",
];

const FILTER_STYLES: Record<Filter, string> = {
  All: "border-transparent bg-red-600 text-white shadow-sm",
  Pending:
    "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
  Accepted:
    "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
  Rejected: "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  Cancelled:
    "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100",
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders();

      setOrders(data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load orders.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Deferred so the initial load doesn't set state synchronously in the
    // effect body (react-hooks/set-state-in-effect) — same pattern as the
    // browse-menu page.
    const timer = setTimeout(fetchOrders, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders((previous) =>
      previous.map((order) =>
        order._id === updatedOrder._id ? updatedOrder : order
      )
    );
  };

  // Counts per status for the filter pills
  const counts = useMemo(() => {
    const base: Record<Filter, number> = {
      All: orders.length,
      Pending: 0,
      Accepted: 0,
      Rejected: 0,
      Cancelled: 0,
    };

    for (const order of orders) {
      base[order.status] += 1;
    }

    return base;
  }, [orders]);

  const visibleOrders =
    filter === "All"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShoppingBag className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              My Orders
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Track and manage your pizza orders.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchOrders}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Status filter pills (hidden while loading/erroring) */}
      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${FILTER_STYLES[value]}`}
            >
              {value}
              <span
                className={`rounded-full px-1.5 text-xs ${
                  filter === value && value === "All"
                    ? "bg-white/20"
                    : "bg-black/5"
                }`}
              >
                {counts[value]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Card key={item}>
              <CardContent className="flex gap-4 p-5">
                <Skeleton className="h-28 w-28 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <Button onClick={fetchOrders} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty — no orders at all */}
      {!loading && !error && orders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <PackageOpen className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-semibold">No Orders Yet</h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t placed any orders yet. Browse the menu
              and order your favorite pizza!
            </p>

            <Button
              render={<Link href="/browse-menu" />}
              className="mt-5 bg-red-600 text-white hover:bg-red-700"
            >
              Browse Menu
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty — filter has no matches */}
      {!loading &&
        !error &&
        orders.length > 0 &&
        visibleOrders.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <PackageOpen className="mb-3 h-9 w-9 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No {filter.toLowerCase()} orders.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setFilter("All")}
              >
                Show All Orders
              </Button>
            </CardContent>
          </Card>
        )}

      {/* Orders */}
      {!loading && !error && visibleOrders.length > 0 && (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onOrderUpdate={handleOrderUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
