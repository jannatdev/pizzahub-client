
"use client";

import Image from "next/image";

import type { Order, OrderStatus } from "@/type/order";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Store,
  CalendarDays,
  MapPin,
  User,
  Mail,
  ReceiptText,
} from "lucide-react";

interface Props {
  order: Order;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Accepted: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-gray-100 text-gray-600 border-gray-200",
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const Row = ({
  icon: Icon,
  label,
  value,
  accent = "text-red-600",
}: {
  icon: typeof Store;
  label: string;
  value: string;
  accent?: string;
}) => (
  <div className="flex gap-3">
    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${accent}`} />
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 break-words text-sm font-medium">
        {value}
      </p>
    </div>
  </div>
);

export default function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: Props) {
  const subtotal = (order.price ?? 0) * (order.quantity ?? 0);
  const total = order.totalPrice ?? subtotal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details
            <Badge
              variant="outline"
              className={`capitalize ${statusStyles[order.status]}`}
            >
              {order.status}
            </Badge>
          </DialogTitle>

          <DialogDescription className="font-mono text-xs">
            #{order._id}
          </DialogDescription>
        </DialogHeader>

        {/* Item summary */}
        <div className="flex gap-3 rounded-xl border bg-muted/30 p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
            {order.itemImage ? (
              <Image
                src={order.itemImage}
                alt={order.itemName}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Store className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">
              {order.itemName}
            </p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted-foreground">
              <Store className="h-3.5 w-3.5" />
              {order.vendorName}
            </p>
          </div>
        </div>

        {/* Delivery information */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Row
            icon={CalendarDays}
            label="Delivery Date"
            value={formatDate(order.deliveryDate)}
          />
          <Row
            icon={CalendarDays}
            label="Requested On"
            value={formatDate(order.createdAt)}
            accent="text-orange-500"
          />
          <div className="sm:col-span-2">
            <Row
              icon={MapPin}
              label="Delivery Address"
              value={order.deliveryAddress || "—"}
            />
          </div>
        </div>

        <Separator />

        {/* Additional message from the customer */}
        {order.additionalMessage ? (
          <>
            <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-3">
              <p className="text-xs uppercase tracking-wide text-orange-600">
                Additional Message
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm">
                {order.additionalMessage}
              </p>
            </div>
            <Separator />
          </>
        ) : null}

        {/* Customer */}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Customer
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              {order.customerName || "—"}
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              {order.customerEmail}
            </span>
          </div>
        </div>

        <Separator />

        {/* Price breakdown */}
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              Price × {order.quantity}
            </span>
            <span>৳{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span className="flex items-center gap-1.5">
              <ReceiptText className="h-4 w-4 text-red-600" />
              Total
            </span>
            <span className="text-red-600">
              ৳{total.toLocaleString()}
            </span>
          </div>
        </div>

        <DialogFooter>
          <span className="mr-auto text-xs text-muted-foreground">
            {order.status === "Pending"
              ? "This order is waiting for the vendor to accept it."
              : order.status === "Accepted"
                ? "The vendor has accepted this order."
                : order.status === "Rejected"
                  ? "The vendor rejected this order."
                  : "This order was cancelled."}
          </span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
