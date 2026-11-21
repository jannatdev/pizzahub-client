
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import type { Order, OrderStatus } from "@/type/order";




import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { PagePlaceholder } from "@/components/dashboard/placeholder";
import { Package, ShoppingBag } from "lucide-react";
import ManageOrderCard from "@/components/card/vendor/manageOrderCard";
import { getVendorOrders } from "@/lib/api/vendor/vendorOrder";

export default function OrdersPage() {

   const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // const fetchOrders = useCallback(async () => {
  //   try {
  //     const result = await getVendorOrders();
  //     setOrders(result.data);
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to fetch orders."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  useEffect(() => {
  let isMounted = true;

  const loadOrders = async () => {
    const result = await getVendorOrders();

    if (isMounted) {
      setOrders(result.data);
    }
  };

  loadOrders();

  return () => {
    isMounted = false;
  };
}, []);
  const handleStatusUpdate = (
    orderId: string,
    status: OrderStatus
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
  return (
  <div>

     <PagePlaceholder
      icon={ShoppingBag}
      title="Customer Orders"
      description="Accept or reject incoming orders for your menu items."
    />

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

  </div>
   
  );
}
