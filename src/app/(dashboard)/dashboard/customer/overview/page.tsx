
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Activity,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShoppingBag,
  XCircle,

} from "lucide-react";

import { toast } from "sonner";

import { authFetch } from "@/lib/api/auth-fetch";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Pie,
  PieChart,
  Cell,
} from "recharts";

// Minimal fields required for this overview.
// The backend already returns these fields.
type CustomerOrder = {
  _id: string;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
};

const chartConfig = {
  Pending: {
    label: "Pending",
    color: "#F59E0B",
  },
  Accepted: {
    label: "Accepted",
    color: "#16A34A",
  },
  Rejected: {
    label: "Rejected",
    color: "#EF4444",
  },
  Cancelled: {
    label: "Cancelled",
    color: "#64748B",
  },
} satisfies ChartConfig;

const statusColors = {
  Pending: "#F59E0B",
  Accepted: "#16A34A",
  Rejected: "#EF4444",
  Cancelled: "#64748B",
};

export default function CustomerDashboardPage() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch logged-in customer's orders.
 const fetchOrders = useCallback(async (showLoading = true) => {
  try {
    if (showLoading) {
      setLoading(true);
    }

    setError(null);

    const result = await authFetch("/api/orders/my-orders", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    setOrders(Array.isArray(result.data) ? result.data : []);
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to load your orders.";

    setError(message);
    toast.error(message);
  } finally {
    setLoading(false);
  }
}, []);

useEffect(() => {
  let active = true;

  const loadOrders = async () => {
    try {
      const result = await authFetch("/api/orders/my-orders", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (active) {
        setOrders(Array.isArray(result.data) ? result.data : []);
        setError(null);
      }
    } catch (err) {
      if (active) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load your orders.";

        setError(message);
        toast.error(message);
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  };

  loadOrders();

  return () => {
    active = false;
  };
}, []);

  // Calculate statistics from actual API data.
  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.status === "Pending"
      ).length,

      accepted: orders.filter(
        (order) => order.status === "Accepted"
      ).length,

      rejected: orders.filter(
        (order) => order.status === "Rejected"
      ).length,

      cancelled: orders.filter(
        (order) => order.status === "Cancelled"
      ).length,
    };
  }, [orders]);

  // Chart data.
  const chartData = useMemo(
    () => [
      {
        status: "Pending",
        count: stats.pending,
        fill: statusColors.Pending,
      },
      {
        status: "Accepted",
        count: stats.accepted,
        fill: statusColors.Accepted,
      },
      {
        status: "Rejected",
        count: stats.rejected,
        fill: statusColors.Rejected,
      },
      {
        status: "Cancelled",
        count: stats.cancelled,
        fill: statusColors.Cancelled,
      },
    ],
    [stats]
  );

  const percentage = (value: number) =>
    stats.total > 0
      ? Math.round((value / stats.total) * 100)
      : 0;

  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: ShoppingBag,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      description: "All your orders",
    },
    {
      title: "Pending Orders",
      value: stats.pending,
      icon: Clock3,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-50",
      description: "Waiting for response",
    },
    {
      title: "Accepted Orders",
      value: stats.accepted,
      icon: CheckCircle2,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      description: "Confirmed orders",
    },
    {
      title: "Rejected Orders",
      value: stats.rejected,
      icon: XCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      description: "Orders not accepted",
    },
  ];

  return (
    <div className="space-y-7 bg-red-50/20">

      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Customer Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track your orders and monitor their status.
          </p>
        </div>

        <Button
          onClick={() => fetchOrders()}
          disabled={loading}
          variant="outline"
          className="w-fit border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh Orders
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-start justify-between gap-3 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold text-red-700">
                Unable to load your orders
              </p>
              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>
            </div>

            <Button
             onClick={() => fetchOrders()}
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistics cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="rounded-2xl border-gray-100 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {loading ? "—" : stat.value}
                    </p>
                  </div>

                  <div
                    className={`rounded-xl p-3 ${stat.iconBg}`}
                  >
                    <Icon
                      className={`size-6 ${stat.iconColor}`}
                    />
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Order chart */}
      <Card className="overflow-hidden rounded-2xl border-gray-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Activity className="size-5 text-red-600" />
              Order Activity
            </CardTitle>

            <CardDescription className="mt-1">
              A breakdown of your order statuses.
            </CardDescription>
          </div>

          <span className="rounded-lg bg-red-50 px-3 py-1.5 text-sm font-bold text-red-600">
            {loading ? "..." : `${stats.total} Orders`}
          </span>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="grid min-h-[280px] place-items-center">
              <div className="text-center">
                <RefreshCw className="mx-auto size-7 animate-spin text-red-500" />
                <p className="mt-3 text-sm text-gray-500">
                  Loading your order statistics...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="grid min-h-[220px] place-items-center text-center">
              <p className="text-sm text-gray-500">
                Your chart will appear when orders load successfully.
              </p>
            </div>
          ) : stats.total === 0 ? (
            <div className="grid min-h-62.5 place-items-center text-center">
              <div>
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50">
                  <ShoppingBag className="size-7 text-red-500" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  No orders yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your order statistics will appear here after your first order.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid items-center gap-8 md:grid-cols-2">

              {/* Donut chart */}
              <div className="relative mx-auto w-full max-w-70">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square h-65"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent hideLabel />
                      }
                    />

                    <Pie
                      data={chartData.filter(
                        (item) => item.count > 0
                      )}
                      dataKey="count"
                      nameKey="status"
                      innerRadius={76}
                      outerRadius={112}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {chartData
                        .filter((item) => item.count > 0)
                        .map((item) => (
                          <Cell
                            key={item.status}
                            fill={item.fill}
                          />
                        ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {stats.total}
                  </span>

                  <span className="text-xs font-medium text-gray-500">
                    Total Orders
                  </span>
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-5">
                {chartData.map((item) => {
                  const value = percentage(item.count);

                  return (
                    <div key={item.status}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-3 rounded-full"
                            style={{
                              backgroundColor: item.fill,
                            }}
                          />

                          <span className="text-sm font-medium text-gray-600">
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-900">
                            {item.count}
                          </span>

                          <span className="w-10 text-right text-xs text-gray-400">
                            {value}%
                          </span>
                        </div>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${value}%`,
                            backgroundColor: item.fill,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom information */}
          {!loading && !error && stats.total > 0 && (
            <div className="mt-6 flex flex-col justify-between gap-2 rounded-xl bg-linear-to-r from-red-50 to-orange-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Your PizzaHub order summary
                </p>

                <p className="text-xs text-gray-500">
                  Your order statistics are calculated from your account.
                </p>
              </div>

              <p className="text-sm font-bold text-red-600">
                {percentage(stats.accepted)}% Accepted
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
