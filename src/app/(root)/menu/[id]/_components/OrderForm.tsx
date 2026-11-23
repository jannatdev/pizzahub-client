"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { usePathname, useSearchParams } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Calendar } from "lucide-react";
import { authFetch } from "@/lib/api/auth-fetch";

export interface OrderFormProps {
  menuId: string;
  vendorName: string;
  itemName: string;
  itemImage: string;
}

export default function OrderForm({ menuId, vendorName, itemName}: OrderFormProps) {
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [additionalMessage, setAdditionalMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams?.() || new URLSearchParams();

  // Extract menuId from pathname or props
  const effectiveMenuId = menuId || pathname.match(/\/menu\/([^/]+)/)?.[1];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deliveryDate || !deliveryAddress.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await authFetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuId: effectiveMenuId,
          deliveryDate,
          deliveryAddress: deliveryAddress.trim(),
          additionalMessage: additionalMessage.trim(),
        }),
      });

      if (result.success) {
        toast.success("Order placed successfully!");
        router.push("/dashboard/customer/orders");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to place order.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to place order."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Card className="p-6 sm:p-8">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Place Your Order
          </CardTitle>
          <CardDescription>
            Order {itemName} from {vendorName}
          </CardDescription>
         </CardHeader>
        <CardContent className="space-y-6">
          {/* Menu item hidden fields are detected automatically */}
          <Input
            type="hidden"
            name="menuId"
            value={effectiveMenuId}
            readOnly
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Delivery Date */}
            <div>
              <Label htmlFor="deliveryDate">Delivery Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  id="deliveryDate"
                  placeholder="Select delivery date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  disabled
                  className="pl-30 pr-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                The delivery date must be after today.
              </p>
            </div>

            {/* Delivery Address */}
            <div>
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Input
                id="deliveryAddress"
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Where should we deliver your pizza?
              </p>
            </div>
          </div>

          {/* Additional Message / Special Instructions */}
          <div>
            <Label htmlFor="additionalMessage">Special Instructions</Label>
            <Input
              id="additionalMessage"
              placeholder="e.g., No onions, extra cheese, etc."
              value={additionalMessage}
              onChange={(e) => setAdditionalMessage(e.target.value)}
              className="w-full h-24 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Any special requests or allergies?
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeOpacity="0.25"
                  />
                  <path
                    d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2z"
                  />
                </svg>
                Placing order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}