"use client";

import { useEffect, useState } from "react";

import type { Order, OrderStatus } from "@/type/order";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { AlertCircle, Package, RefreshCw } from "lucide-react";
import ManageOrderCard from "@/components/card/vendor/manageOrderCard";
import { getVendorOrders } from "@/lib/api/vendor/vendorOrder";


export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Bumped by the "Try again" button so the effect below re-runs the read.
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

   
    (async () => {
      try {
        const result = await getVendorOrders();

        if (!active) return;
        setOrders(result.data ?? []);
        setError(null);
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch orders."
        );
      } finally {
        // Success, empty and failure all leave the loading state, so the page
        // can never get stuck behind the skeleton.
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [reloadToken]);

 const handleStatusUpdate = (
  orderId: string,
  status: OrderStatus,
) => {
  setOrders((previous) =>
    previous.map((order) =>
      order._id === orderId
        ? { ...order, status }
        : order
    )
  );
};

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <Card key={item}>
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Customer Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and respond to orders received from your customers.
          </p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-red-50 p-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="font-semibold">Could not load orders</h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {error}
            </p>

            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setLoading(true);
                setError(null);
                setReloadToken((token) => token + 1);
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Customer Orders
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage and respond to orders received from your customers.
        </p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-red-50 p-4">
              <Package className="h-8 w-8 text-red-600" />
            </div>

            <h2 className="font-semibold">No orders yet</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Customer orders will appear here when someone places an order.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <ManageOrderCard
              key={order._id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </div>
      )}
    </section>
  );
}
