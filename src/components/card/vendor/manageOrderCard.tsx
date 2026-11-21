
"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import type { Order, OrderStatus } from "@/type/order";


import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import {
  CalendarDays,
  MapPin,
  Mail,
  UserRound,
  Package,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
} from "lucide-react";
import { updateVendorOrderStatus } from "@/lib/api/vendor/vendorOrder";

interface VendorOrderCardProps {
  order: Order;
  onStatusUpdate: (
    orderId: string,
    status: OrderStatus
  ) => void;
}

export default function ManageOrderCard({
  order,
  onStatusUpdate,
}: VendorOrderCardProps) {
  const [updating, setUpdating] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const isPending = order.status === "Pending";

  const handleUpdateStatus = async (
    status: "Accepted" | "Rejected"
  ) => {
    try {
      setUpdating(true);

      await updateVendorOrderStatus(order._id, status);

      onStatusUpdate(order._id, status);

      toast.success(
        `Order ${status.toLowerCase()} successfully!`
      );

      setRejectDialogOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setUpdating(false);
    }
  };

  const statusStyles: Record<OrderStatus, string> = {
    Pending: "bg-amber-100 text-amber-700 border-amber-200",
    Accepted: "bg-green-100 text-green-700 border-green-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
    Cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <>
      <Card className="overflow-hidden rounded-xl border shadow-sm transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between gap-3 bg-muted/30 px-5 py-4">
          <div>
            <CardTitle className="text-base font-semibold">
              Order #{order._id.slice(-6).toUpperCase()}
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          <Badge
            variant="outline"
            className={statusStyles[order.status]}
          >
            {order.status === "Pending" && (
              <Clock className="mr-1 h-3 w-3" />
            )}
            {order.status}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Customer Information
            </h3>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserRound className="h-4 w-4 text-red-600" />
                <span className="font-medium text-foreground">
                  {order.customerName}
                </span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-red-600" />
                <span>{order.customerEmail}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Item Information */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-28">
              {order.itemImage ? (
                <Image
                  src={order.itemImage}
                  alt={order.itemName}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold">{order.itemName}</h3>

              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span>Quantity: {order.quantity}</span>
                <span>Unit price: ৳{order.price}</span>
              </div>

              <p className="text-lg font-bold text-red-600">
                Total: ৳{order.totalPrice}
              </p>
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-red-600" />
                Delivery Date
              </h3>

              <p className="text-sm text-muted-foreground">
                {new Date(order.deliveryDate).toLocaleDateString(
                  "en-BD",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-red-600" />
                Delivery Address
              </h3>

              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress}
              </p>
            </div>
          </div>

          <Separator />

          {/* Customer Message */}
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="h-4 w-4 text-red-600" />
              Customer Message
            </h3>

            <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              {order.customerMessage?.trim()
                ? order.customerMessage
                : "No additional message from the customer."}
            </div>
          </div>

          {/* Actions */}
          {isPending ? (
            <>
              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  disabled={updating}
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject Order
                </Button>

                <Button
                  className="bg-red-600 text-white hover:bg-red-700"
                  disabled={updating}
                  onClick={() => handleUpdateStatus("Accepted")}
                >
                  {updating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
                  Accept Order
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              This order has already been processed.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this order?</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this order from{" "}
              {order.customerName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={updating}
            >
              Keep Order
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleUpdateStatus("Rejected")}
              disabled={updating}
            >
              {updating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
