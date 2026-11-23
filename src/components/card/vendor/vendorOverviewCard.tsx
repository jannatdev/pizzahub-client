
"use client";

import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Crown,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type VendorOverviewProps = {
  totalMenuItems: number;
  activeMenuItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  isPremium: boolean;
};

export default function VendorOverviewCards({
  totalMenuItems,
  activeMenuItems,
  pendingOrders,
  acceptedOrders,
  isPremium,
}: VendorOverviewProps) {
  const inactiveMenuItems = Math.max(
    0,
    totalMenuItems - activeMenuItems
  );

  const totalOrders = pendingOrders + acceptedOrders;

  const menuPercentage =
    totalMenuItems > 0
      ? Math.min(100, (activeMenuItems / totalMenuItems) * 100)
      : 0;

  const orderPercentage =
    totalOrders > 0
      ? (acceptedOrders / totalOrders) * 100
      : 0;

  const stats = [
    {
      title: "Total Menu Items",
      value: totalMenuItems,
      description: "All menu items added",
      icon: Package,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      valueColor: "text-gray-900",
    },
    {
      title: "Active Menu Items",
      value: activeMenuItems,
      description: "Currently available",
      icon: ShoppingBag,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-gray-900",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      description: "Waiting for your response",
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      valueColor: "text-gray-900",
    },
    {
      title: "Accepted Orders",
      value: acceptedOrders,
      description: "Orders you have accepted",
      icon: CheckCircle2,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      valueColor: "text-gray-900",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="group border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <h2 className={`mt-3 text-3xl font-bold ${stat.valueColor}`}>
                      {stat.value}
                    </h2>

                    <p className="mt-2 text-xs text-gray-500">
                      {stat.description}
                    </p>
                  </div>

                  <div className={`flex size-12 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <Icon className={`size-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart and Subscription Cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Menu Performance Chart */}
        <Card className="border-gray-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">
                  Menu & Order Overview
                </CardTitle>
                <p className="mt-1 text-sm text-gray-500">
                  Your current menu and order statistics
                </p>
              </div>

              <div className="rounded-xl bg-orange-50 p-2.5">
                <TrendingUp className="size-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-7">
            {/* Menu Performance */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    Menu Availability
                  </p>
                  <p className="text-xs text-gray-500">
                    Active vs inactive items
                  </p>
                </div>

                <span className="text-sm font-bold text-orange-600">
                  {Math.round(menuPercentage)}%
                </span>
              </div>

              <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="rounded-full bg-orange-500 transition-all"
                  style={{ width: `${menuPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-orange-500" />
                  <span className="text-gray-500">
                    Active ({activeMenuItems})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-gray-300" />
                  <span className="text-gray-500">
                    Inactive ({inactiveMenuItems})
                  </span>
                </div>
              </div>
            </div>

            {/* Order Performance */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">
                    Order Acceptance
                  </p>
                  <p className="text-xs text-gray-500">
                    Accepted vs pending orders
                  </p>
                </div>

                <span className="text-sm font-bold text-green-600">
                  {Math.round(orderPercentage)}%
                </span>
              </div>

              <div className="flex h-4 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="rounded-full bg-green-500 transition-all"
                  style={{ width: `${orderPercentage}%` }}
                />
              </div>

              <div className="mt-3 flex flex-wrap gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-green-500" />
                  <span className="text-gray-500">
                    Accepted ({acceptedOrders})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-amber-500" />
                  <span className="text-gray-500">
                    Pending ({pendingOrders})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card className="relative overflow-hidden border-orange-200 shadow-sm">
          <div className="absolute -right-8 -top-8 size-32 rounded-full bg-orange-100/70 blur-2xl" />

          <CardHeader className="relative">
            <div className="flex size-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
              <Crown className="size-6" />
            </div>

            <CardTitle className="mt-3 text-lg">
              Current Subscription
            </CardTitle>

            <p className="text-sm text-gray-500">
              Your active vendor membership
            </p>
          </CardHeader>

          <CardContent className="relative space-y-5">
            <div className="flex items-center justify-between rounded-xl border border-orange-100 bg-orange-50 p-4">
              <div>
                <p className="text-xs text-gray-500">
                  Current Plan
                </p>

                <h3 className="mt-1 text-xl font-bold text-gray-900">
                  {isPremium ? "Premium" : "Free"}
                </h3>
              </div>

              <Badge
                className={
                  isPremium
                    ? "border-0 bg-green-600 text-white"
                    : "border-gray-300 bg-white text-gray-600"
                }
              >
                {isPremium ? "Active" : "Current"}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="size-4 text-green-600" />
                {isPremium
                  ? "Unlimited menu items"
                  : "Free plan menu item limit"}
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 className="size-4 text-green-600" />
                Vendor dashboard access
              </div>
            </div>

            {!isPremium && (
              <a
                href="/payment"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
              >
                <Crown className="size-4" />
                Upgrade to Premium
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
