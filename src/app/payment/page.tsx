
   
   import { Suspense } from "react";

import {
  
  Check,
  Crown,
  Menu,
  Pizza,
  Sparkles,
  ShieldCheck,
  Zap,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
type PaymentPageProps = {
  searchParams: Promise<{
    canceled?: string;
  }>;
};

// The page never awaits searchParams itself (Cache Components can't
// prerender request data outside <Suspense>) — it only hands the promise to
// the notice below, which lives inside a boundary.
const PaymentPage = ({ searchParams }: PaymentPageProps) => {
    return (
         <div className="min-h-screen bg-[#fffaf5] text-gray-900">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-red-600 p-2 text-white">
              <Pizza size={22} />
            </div>
            <span className="text-xl font-bold">
              Pizza<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          <Link href="/dashboard">
            <Button variant="outline" className="rounded-full">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </nav>

      {/* Cancel notice — searchParams is only read inside this boundary. */}
      <Suspense fallback={null}>
        <CanceledNotice searchParams={searchParams} />
      </Suspense>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left Side */}
          <div>
            <Badge className="mb-5 border-0 bg-orange-100 px-4 py-2 text-red-700 hover:bg-orange-100">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade your vendor plan
            </Badge>

            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Unlock More
              <span className="text-red-600"> Menu Items</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">
              You have reached your free plan limit of 3 menu items.
              Upgrade your plan to showcase more delicious options
              and grow your business with PizzaHub.
            </p>

            {/* Current Limit */}
            <Card className="mt-8 rounded-2xl border-orange-100 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium text-gray-700">
                    Free menu item limit
                  </span>
                  <span className="font-semibold text-orange-600">
                    3 / 3 used
                  </span>
                </div>

                <Progress
                  value={100}
                  className="h-3 bg-orange-100 [&>div]:bg-red-600"
                />

                <p className="mt-3 text-sm text-gray-500">
                  You need an upgrade to add more menu items.
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">
                Why upgrade?
              </h2>

              {[
                "Add more menu items to your restaurant",
                "Showcase your complete food collection",
                "Attract more customers with variety",
                "Grow your restaurant's online presence",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Upgrade Card */}
          <Card className="relative overflow-hidden rounded-3xl border-0 shadow-xl shadow-orange-100">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-orange-100 blur-3xl" />

            <CardHeader className="relative pb-2 pt-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-orange-200">
                <Crown className="h-8 w-8" />
              </div>

              <Badge className="mx-auto w-fit bg-red-600 text-white hover:bg-red-600">
                Premium Vendor
              </Badge>

              <CardTitle className="mt-3 text-3xl">
                Expand Your Menu
              </CardTitle>

              <CardDescription className="text-base">
                Unlock more space for your delicious creations
              </CardDescription>
            </CardHeader>

            <CardContent className="relative p-6 md:p-8">
              {/* Price */}
              <div className="rounded-2xl bg-orange-50 p-6 text-center">
                <p className="text-sm font-medium text-gray-500">
                  Upgrade plan
                </p>

                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900">
                    ৳500
                  </span>
                  
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Unlock unlimited menu items
                </p>
              </div>

              {/* Plan Features */}
              <div className="my-7 space-y-4">
                <div className="flex items-center gap-3">
                  <Menu className="h-5 w-5 text-red-600" />
                  <span>Unlimited menu items</span>
                </div>

                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-red-600" />
                  <span>Grow your food business</span>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-red-600" />
                  <span>Secure payment</span>
                </div>

                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-red-600" />
                  <span>Premium vendor experience</span>
                </div>
              </div>

              {/* Payment Button */}
              {/* <Button
                className="h-12 w-full rounded-xl bg-orange-500 text-base font-semibold hover:bg-orange-600"
                onClick={() => {
                  // Connect your payment gateway here
                }}
              >
                Pay Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button> */}
              <form action="/api/checkout_sessions" method="POST">
              <section>
                <button type="submit" role="link"
                 className="h-12 w-full rounded-xl bg-red-600 text-white font-semibold hover:bg-orange-600">
                  Checkout
                </button>
              </section>
            </form>

              <p className="mt-4 text-center text-xs text-gray-500">
                Secure checkout · Upgrade anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    );
};

/**
 * Shown when Stripe's cancel button returns the customer to
 * /payment?canceled=true. Awaits searchParams behind <Suspense>, so the rest
 * of the page can still be prerendered (Cache Components rule).
 */
async function CanceledNotice({ searchParams }: PaymentPageProps) {
  const { canceled } = await searchParams;

  if (!canceled) return null;

  return (
    <div className="mx-auto mt-4 flex max-w-6xl items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        Payment canceled — you weren&apos;t charged. Feel free to shop around
        and check out when you&apos;re ready.
      </p>
    </div>
  );
}

export default PaymentPage;
