
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Crown,
  CreditCard,
  Package,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RefreshButton } from "@/components/dashboard/refresh-button";
import { getVendorSubscription } from "@/lib/api/vendor/subscription";


type Subscription = {
  isPremium: boolean;
  count: number;
  freeLimit: number;
};

export default function SubscriptionStatus() {
  const [plan, setPlan] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchSubscription = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getVendorSubscription();

        if (active) {
          setPlan(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load your subscription."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSubscription();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-gray-500">
          Loading your subscription…
        </CardContent>
      </Card>
    );
  }

  if (error || !plan) {
    return (
      <Card className="border-red-200">
        <CardContent className="space-y-4 p-6">
          <p className="text-sm text-red-600">
            {error || "Could not load your subscription."}
          </p>
          <RefreshButton />
        </CardContent>
      </Card>
    );
  }

  const { isPremium, count: used, freeLimit: limit } = plan;
  const usagePercent =
    limit > 0 ? Math.min(100, (used / limit) * 100) : 0;

  if (isPremium) {
    return (
      <>
        <Card className="overflow-hidden border-orange-200 bg-linear-to-br from-orange-50 via-white to-red-50 shadow-sm">
          <CardHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-red-600 text-white">
              <Crown className="size-6" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <CardTitle className="text-xl">
               ` You&apos;re` on the Premium plan
              </CardTitle>
              <Badge className="border-0 bg-green-600 text-white">
                <Check className="mr-1 size-3" />
                Active
              </Badge>
            </div>

            <CardDescription>
              Your payment was verified — unlimited menu items are unlocked.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-orange-100 bg-white/70 p-4">
                <p className="text-sm text-gray-500">Menu items added</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <Package className="size-4 text-red-600" />
                  {used}
                </p>
              </div>

              <div className="rounded-xl border border-orange-100 bg-white/70 p-4">
                <p className="text-sm text-gray-500">Item limit</p>
                <p className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <Zap className="size-4 text-orange-500" />
                  Unlimited
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                render={<Link href="/dashboard/vendor/menu/AddMenu" />}
                className="rounded-xl bg-red-600 text-white hover:bg-orange-600"
              >
                <Sparkles className="mr-2 size-4" />
                Add a menu item
              </Button>

              <Button
                render={<Link href="/dashboard/vendor/menu" />}
                variant="outline"
                className="rounded-xl"
              >
                Manage my menu
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-gray-400">
          Plan status is read from the backend.
        </p>
      </>
    );
  }

  return (
    <>
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
            <CreditCard className="size-6" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CardTitle className="text-xl">Free plan</CardTitle>
            <Badge variant="outline">Current</Badge>
          </div>

          <CardDescription>
            Free vendors can keep up to {limit} active menu items.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Menu items used</span>
              <span className={used >= limit
                ? "font-semibold text-red-600"
                : "font-semibold text-orange-600"
              }>
                {used} / {limit}
              </span>
            </div>

            <Progress
              value={usagePercent}
              className="h-3 bg-orange-100 [&>div]:bg-red-600"
            />

            <p className="mt-2 text-sm text-gray-500">
              {used >= limit
                ? "You've reached the free limit. Upgrade to add more items."
                : `You can add ${limit - used} more item${
                    limit - used === 1 ? "" : "s"
                  } on the free plan.`}
            </p>
          </div>

          <div className="rounded-xl border border-orange-100 bg-orange-50 p-4">
            <p className="flex items-center gap-2 font-medium text-gray-900">
              <Crown className="size-4 text-orange-500" />
              Upgrade to Premium
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Unlimited menu items, one secure Stripe payment.
            </p>

            <Button
              render={<Link href="/payment" />}
              className="mt-4 w-full rounded-xl bg-red-600 text-white hover:bg-orange-600 sm:w-auto"
            >
              <Sparkles className="mr-2 size-4" />
              Upgrade for ৳500
            </Button>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-gray-400">
        Plan status is read from the backend.
      </p>
    </>
  );
}
