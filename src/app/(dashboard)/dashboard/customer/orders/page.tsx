

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

// All supported order filters
type Filter = "All" | OrderStatus;

// Filter options
const FILTERS: Filter[] = [
  "All",
  "Pending",
  "Accepted",
  "Rejected",
  "Delivered",
  "Cancelled",
];

// Filter styles
const FILTER_STYLES: Record<Filter, string> = {
  All: "border-transparent bg-red-600 text-white shadow-sm",

  Pending:
    "border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100",

  Accepted:
    "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",

  Rejected:
    "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",

  Delivered:
    "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",

  Cancelled:
    "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100",
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  // Fetch customer orders
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

  // Initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Update order after a successful status change
  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrders((previous) =>
      previous.map((order) =>
        order._id === updatedOrder._id
          ? updatedOrder
          : order
      )
    );
  };

  // Calculate counts for every filter
  const counts = useMemo(() => {
    const base = Object.fromEntries(
      FILTERS.map((item) => [item, 0])
    ) as Record<Filter, number>;

    base.All = orders.length;

    for (const order of orders) {
      base[order.status] += 1;
    }

    return base;
  }, [orders]);

  // Filter orders
  const visibleOrders = useMemo(() => {
    if (filter === "All") {
      return orders;
    }

    return orders.filter(
      (order) => order.status === filter
    );
  }, [orders, filter]);

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
          onClick={() => fetchOrders()}
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Status filter pills */}
      {!loading && !error && orders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === value
                  ? value === "All"
                    ? FILTER_STYLES.All
                    : FILTER_STYLES[value]
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {value === "Cancelled" ? "Cancelled" : value}

              <span
                className={`rounded-full px-1.5 text-xs ${
                  filter === value
                    ? value === "All"
                      ? "bg-white/20"
                      : "bg-black/5"
                    : "bg-gray-100"
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
                <Skeleton className="size-28 rounded-lg" />

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
            <p className="text-sm text-red-600">
              {error}
            </p>

            <Button
              onClick={() => fetchOrders()}
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty — no orders */}
      {!loading && !error && orders.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <PackageOpen className="size-7" />
            </div>

            <h3 className="text-lg font-semibold">
              No Orders Yet
            </h3>

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

      {/* Empty — no matching orders */}
      {!loading &&
        !error &&
        orders.length > 0 &&
        visibleOrders.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <PackageOpen className="mb-3 size-9 text-muted-foreground" />

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
