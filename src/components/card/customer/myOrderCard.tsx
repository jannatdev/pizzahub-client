
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import type { Order, OrderStatus } from "@/type/order";
import { cancelOrder } from "@/lib/api/order";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  CalendarDays,
  MapPin,
  Store,
  Eye,
  XCircle,
  ReceiptText,
} from "lucide-react";

import OrderDetailsDialog from "./OrderDetailsDialog";

interface Props {
  order: Order;
  onOrderUpdate: (order: Order) => void;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Accepted: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-gray-100 text-gray-600 border-gray-200",
  Delivered: "bg-green-100 text-green-700",
  
};

const statusDot: Record<OrderStatus, string> = {
  Pending: "bg-yellow-500",
  Accepted: "bg-green-500",
  Rejected: "bg-red-500",
  Cancelled: "bg-gray-400",
  Delivered: "bg-green-500",
};

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString() : "—";

export default function OrderCard({
  order,
  onOrderUpdate,
}: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async () => {
    try {
      setCancelling(true);

      const updatedOrder = await cancelOrder(order._id);

      onOrderUpdate(updatedOrder);

      setCancelOpen(false);
      toast.success("Order cancelled successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden border shadow-sm transition-shadow hover:shadow-md">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row">

            {/* Item Image */}
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-36">
              {order.imageUrl ? (
                <Image
                  src={order.imageUrl}
                  alt={order.itemName}
                  fill
                  sizes="(max-width: 640px) 100vw, 144px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Store className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Information */}
            <div className="min-w-0 flex-1 space-y-3">

              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {order.itemName}
                    </h3>
                    <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
                      #{order._id.slice(-8)}
                    </span>
                  </div>

                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <Store className="h-4 w-4" />
                    {order.vendorName}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={`gap-1.5 capitalize ${statusStyles[order.status]}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${statusDot[order.status]}`}
                  />
                  {order.status}
                </Badge>
              </div>

              <Separator />

              <div className="grid gap-3 text-sm sm:grid-cols-2">

                <div className="flex gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-red-600" />
                  <div>
                    <p className="text-muted-foreground">
                      Delivery Date
                    </p>
                    <p className="font-medium">
                      {formatDate(order.deliveryDate)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <CalendarDays className="h-4 w-4 shrink-0 text-orange-500" />
                  <div>
                    <p className="text-muted-foreground">
                      Request Date
                    </p>
                    <p className="font-medium">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 sm:col-span-2">
                  <MapPin className="h-4 w-4 shrink-0 text-red-600" />
                  <div className="min-w-0">
                    <p className="text-muted-foreground">
                      Delivery Address
                    </p>
                    <p className="font-medium">
                      {order.deliveryAddress || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <p className="text-sm text-muted-foreground">
                  Quantity: {order.quantity}
                  {order.price ? (
                    <span className="ml-2">
                      (৳{order.price.toLocaleString()} each)
                    </span>
                  ) : null}
                </p>

                <p className="font-bold text-red-600">
                  ৳
                  {(
                    order.totalPrice ??
                    (order.price ?? 0) * (order.quantity ?? 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="flex flex-wrap justify-end gap-2 bg-muted/30 p-4">

          <Button
            size="sm"
            variant="outline"
            onClick={() => setDetailsOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>

          {/* Cancel only pending orders */}
          {order.status === "Pending" && (
            <AlertDialog open={cancelOpen} onOpenChange={(open) => {
              if (!cancelling) setCancelOpen(open);
            }}>
              <AlertDialogTrigger >
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={cancelling}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Cancel this order?
                  </AlertDialogTitle>

                  <AlertDialogDescription>
                    Are you sure you want to cancel
                    <span className="font-semibold text-foreground">
                      {" "}{order.itemName}
                    </span>
                    ? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel disabled={cancelling}>
                    Keep Order
                  </AlertDialogCancel>

                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelOrder();
                    }}
                    disabled={cancelling}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {cancelling ? (
                      <>
                        <ReceiptText className="mr-2 h-4 w-4 animate-pulse" />
                        Cancelling...
                      </>
                    ) : (
                      "Yes, Cancel"
                    )}
                  </AlertDialogAction>
                  <OrderDetailsDialog
                    order={order}
                    open={detailsOpen}
                    onOpenChange={setDetailsOpen}
                  />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </CardFooter>
      </Card>

      
    </>
  );
}
