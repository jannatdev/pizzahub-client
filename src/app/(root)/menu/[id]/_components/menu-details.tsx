"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MapPin,
  ShoppingCart,
  Store,
  UtensilsCrossed,
  Star,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Menu } from "@/type/menu";
import type { UserRole } from "@/context/auth-context";
import { getMenuDetails } from "@/lib/api/menu";
import { createOrder } from "@/lib/api/order";
import { useSession } from "@/lib/auth-client";

/** Min delivery date for the order form (local calendar day). */
const TODAY = (() => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
})();

/**
 * Better Auth's client types only expose the core user fields. `role` is
 * declared server-side, so it must be declared here (same as the Navbar).
 */
type SessionUser = {
  id?: string;
  name?: string;
  email?: string;
  image?: string | null;
  role?: UserRole;
};

type PageState = "loading" | "ready" | "notfound" | "error";

interface MenuDetailsProps {
  id: string;
}

export const MenuDetails = ({ id }: MenuDetailsProps) => {
  const router = useRouter();

  const { data: session, isPending } = useSession();
  const user = session?.user as SessionUser | undefined;
  const isLoggedIn = Boolean(session?.user);
  const role = user?.role ?? "customer";

  // Item data + request state
  const [menuItem, setMenuItem] = useState<Menu | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  // Order button state (prevents double-clicks / duplicate requests)
  const [ordering, setOrdering] = useState(false);

  // Delivery form (backend requires delivery date + address)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalMessage, setAdditionalMessage] = useState("");
  const [formError, setFormError] = useState("");

  // Image gallery index
  const [activeIndex, setActiveIndex] = useState(0);

  // Active tab: "description" | "reviews"
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );

  // ---------------------------------------------------------------
  // Fetch item details (public endpoint — viewing needs no login)
  // ---------------------------------------------------------------
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const data = await getMenuDetails(id);

        if (ignore) return;

        setMenuItem(data);
        setActiveIndex(0);
        setPageState("ready");
      } catch (err) {
        if (ignore) return;

        const error = err as Error & { status?: number };

        // 400 (invalid id) and 404 (missing item) → not-found UI.
        // Never show raw server/Mongo errors — the API already returns
        // clean messages, anything else gets a generic one.
        if (error.status === 400 || error.status === 404) {
          setPageState("notfound");
        } else {
          setErrorMsg(
            error.message ||
              "Something went wrong while loading this item."
          );
          setPageState("error");
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [id]);

  // ---------------------------------------------------------------
  // Gallery images (supports an image array, falls back to imageUrl)
  // ---------------------------------------------------------------
  const galleryImages: string[] = !menuItem
    ? []
    : Array.isArray(menuItem.images) && menuItem.images.length > 0
      ? menuItem.images
      : menuItem.imageUrl
        ? [menuItem.imageUrl]
        : [];

  const showPrevImage = () =>
    setActiveIndex(
      (index) =>
        (index - 1 + galleryImages.length) % galleryImages.length
    );

  const showNextImage = () =>
    setActiveIndex(
      (index) => (index + 1) % galleryImages.length
    );

  // ---------------------------------------------------------------
  // Availability + ownership helpers
  // ---------------------------------------------------------------
  const isApproved = menuItem?.status === "Approved";
  const isActive = menuItem?.isActive === true;
  const isAvailable = isApproved && isActive;

  const isOwnItem = Boolean(
    user &&
      menuItem &&
      ((user.id && menuItem.vendorId && user.id === menuItem.vendorId) ||
        (user.email &&
          menuItem.vendorEmail &&
          user.email === menuItem.vendorEmail))
  );

  const unavailableReason = !menuItem
    ? ""
    : menuItem.status === "Pending"
      ? "This item is waiting for admin approval, so ordering is unavailable."
      : menuItem.status === "Rejected"
        ? "This item was rejected by the admin, so ordering is unavailable."
        : !isActive
          ? "This item is currently unavailable."
          : "Ordering unavailable for this item.";

  // Rating stars (visual only — backend does not expose a rating yet)
  const starCount = 4;
  const reviewCount = 2;

  // ---------------------------------------------------------------
  // Place order — step 1 opens the delivery form, step 2 submits
  // (backend re-validates everything)
  // ---------------------------------------------------------------
  const openOrderForm = () => {
    setFormError("");
    setOrderDialogOpen(true);
  };

  const handleOrder = async () => {
    // Ignore repeated clicks while a request is in flight
    if (ordering || !menuItem) return;

    if (!deliveryDate) {
      setFormError("Please choose a delivery date.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setFormError("Please enter a delivery address.");
      return;
    }

    setFormError("");
    setOrdering(true);

    try {
      await createOrder({
        menuId: menuItem._id,
        quantity: 1,
        deliveryDate,
        deliveryAddress: deliveryAddress.trim(),
        additionalMessage: additionalMessage.trim() || undefined,
      });

      setOrderDialogOpen(false);
      toast.success("Order placed successfully!", {
        description: "The vendor will review your order shortly.",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to place order."
      );
    } finally {
      setOrdering(false);
    }
  };

  // ---------------------------------------------------------------
  // Quantity helper
  // ---------------------------------------------------------------
  const [quantity, setQuantity] = useState(1);
  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  // ---------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------
  if (pageState === "loading") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-5 w-44" />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Error state
  // ---------------------------------------------------------------
  if (pageState === "error") {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500" />

        <h1 className="text-2xl font-bold">
          Something Went Wrong
        </h1>

        <p className="text-muted-foreground">{errorMsg}</p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>

          <Button
            render={<Link href="/browse-menu" />}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Not-found state (invalid id or missing item)
  // ---------------------------------------------------------------
  if (pageState === "notfound" || !menuItem) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <UtensilsCrossed className="h-12 w-12 text-orange-500" />

        <h1 className="text-2xl font-bold">
          Menu Item Not Found
        </h1>

        <p className="text-muted-foreground">
          The item you are looking for does not exist or has been
          removed.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>

          <Button
            render={<Link href="/browse-menu" />}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Ready — product details
  // ---------------------------------------------------------------
  // Status badge (mirrors the admin/vendor card styles)
  const statusBadge =
    menuItem.status === "Pending" ? (
      <Badge className="bg-yellow-100 text-yellow-700">
        Pending Approval
      </Badge>
    ) : menuItem.status === "Rejected" ? (
      <Badge className="bg-red-100 text-red-700">
        Rejected
      </Badge>
    ) : !isActive ? (
      <Badge variant="secondary">Unavailable</Badge>
    ) : (
      <Badge className="bg-green-100 text-green-700">
        Available
      </Badge>
    );

  const stars = Array.from({ length: starCount }).map((_, i) => (
    <Star
      key={i}
      className="h-4 w-4 fill-yellow-400 text-yellow-400"
    />
  ));

  const totalPrice = menuItem.price * quantity;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link
          href="/"
          className="text-red-600 hover:text-red-700 hover:underline"
        >
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <Link
          href="/browse-menu"
          className="text-red-600 hover:text-red-700 hover:underline"
        >
          {menuItem.category}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-900 font-medium">
          {menuItem.itemName}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 gap-y-6">
        {/* ------------------------------------------------------- */}
        {/* Image gallery                                             */}
        {/* ------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-red-100 bg-red-50">
            <Image
              src={galleryImages[activeIndex]}
              alt={`${menuItem.itemName} — image ${activeIndex + 1} of ${galleryImages.length}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {/* Previous / next (only when there is more than one image) */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={showPrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-red-600 shadow-sm transition hover:bg-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`View image ${index + 1}`}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 w-2 rounded-full transition ${
                        index === activeIndex
                          ? "bg-red-600"
                          : "bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {galleryImages.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`shrink-0 w-24 h-24 rounded-lg border overflow-hidden ${
                  activeIndex === index
                    ? "border-red-600 ring-2 ring-red-600"
                    : "border-red-100 hover:border-red-200 transition"
                }`}
              >
                <Image
                  src={src}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------- */}
        {/* Item information                                          */}
        {/* ------------------------------------------------------- */}
        <div className="space-y-5">
          {/* Category + status */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-orange-500 font-semibold text-white">
              {menuItem.category}
            </Badge>
            {statusBadge}
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {menuItem.itemName}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {stars}
            <span className="text-sm text-muted-foreground">
              ({reviewCount} customer reviews)
            </span>
          </div>

          {/* Short description */}
          {menuItem.description ? (
            <p className="text-muted-foreground leading-relaxed">
              {menuItem.description}
            </p>
          ) : null}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-red-600">
              ৳{menuItem.price}
            </span>
          </div>

          {/* Order actions */}
          <div className="flex flex-col sm:flex-row items-end gap-4">
            {/* Session still loading — avoid flashing the wrong button */}
            {isPending ? (
              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </Button>
            ) : !isLoggedIn ? (
              /* Not logged in → login prompt */
              <Button
                size="lg"
                render={<Link href="/sign-in" />}
                className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700"
              >
                Login to Order
              </Button>
            ) : role === "admin" ? (
              /* Admin → cannot place customer orders */
              <Button size="lg" className="w-full sm:w-auto" disabled>
                Admins cannot place orders
              </Button>
            ) : role === "vendor" ? (
              /* Vendor → cannot order (own item or otherwise) */
              <Button size="lg" className="w-full sm:w-auto" disabled>
                {isOwnItem
                  ? "You cannot order your own item"
                  : "Vendors cannot place orders"}
              </Button>
            ) : !isAvailable ? (
              /* Customer but item not approved/active */
              <Button size="lg" className="w-full sm:w-auto" disabled>
                Ordering unavailable
              </Button>
            ) : (
              /* Eligible customer */
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg bg-white px-2 py-1.5">
                  <button
                    type="button"
                    onClick={decrementQty}
                    disabled={quantity === 1}
                    className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Decrease quantity"
                  >
                    <span className="h-3.5 w-3.5 text-gray-500">−</span>
                  </button>
                  <span className="text-sm font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQty}
                    className="p-1 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Increase quantity"
                  >
                    <span className="h-3.5 w-3.5 text-gray-500">+</span>
                  </button>
                </div>
                <Button
                  size="lg"
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  disabled={ordering}
                  onClick={openOrderForm}
                >
                  {ordering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Order
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Why ordering is (or is not) available */}
          {!isLoggedIn ? (
            <p className="text-center text-xs text-muted-foreground">
              Sign in with a customer account to order this item.
            </p>
          ) : role === "admin" ? (
            <p className="text-center text-xs text-muted-foreground">
              Admin accounts cannot place customer orders.
            </p>
          ) : role === "vendor" ? (
            <p className="text-center text-xs text-muted-foreground">
              {isOwnItem
                ? "This is your own menu item — vendors cannot order from themselves."
                : "Vendor accounts cannot place customer orders."}
            </p>
          ) : !isAvailable ? (
            <p className="text-center text-xs text-muted-foreground">
              {unavailableReason}
            </p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              Your order is sent to the vendor for approval.
            </p>
          )}

          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-sm font-medium text-muted-foreground">
              Total:
            </span>
            <span className="text-lg font-bold text-red-600">
              ৳{totalPrice}
            </span>
          </div>

          {/* Category & Tags */}
          <div className="grid gap-4 pt-4 border-t border-red-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
              </span>
              <span className="text-sm text-gray-900">{menuItem.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {menuItem.category ? (
                  <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                    {menuItem.category}
                  </Badge>
                ) : null}
                {menuItem.location ? (
                  <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                    {menuItem.location}
                  </Badge>
                ) : null}
                <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                  Pizza
                </Badge>
                <Badge variant="outline" className="border-orange-200 bg-orange-50 text-orange-700">
                  Spicy
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Tabs: Description / Reviews                                 */}
      {/* ----------------------------------------------------------- */}
      <div className="mt-10">
        <div className="flex gap-1 border-b border-red-50/30 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === "description"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition ${
              activeTab === "reviews"
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            Reviews ({reviewCount})
          </button>
        </div>

        {/* Description panel */}
        {activeTab === "description" && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold">Description</h2>
              <p className="mt-2 text-muted-foreground leading-relaxed">
                {menuItem.description ||
                  "No description available for this item."}
              </p>
            </div>

            {/* Quick specs */}
            <div className="grid gap-3 sm:grid-cols-3 border border-red-50/20 rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  Size (Weight)
                </span>
                <span className="text-sm text-gray-900">12" (420g)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  Dough
                </span>
                <span className="text-sm text-gray-900">
                  {menuItem.location || "Deep Dish"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  Spicy
                </span>
                <span className="text-sm text-gray-900">🌶️</span>
              </div>
            </div>
          </div>
        )}

        {/* Reviews panel */}
        {activeTab === "reviews" && (
          <div className="mt-6 text-center py-12">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this item.
            </p>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Order form — delivery details (required by the backend)      */}
      {/* ----------------------------------------------------------- */}
      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Complete Your Order</DialogTitle>
            <DialogDescription>
              Tell the vendor when and where to deliver your pizza.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Item + price summary */}
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2 text-sm">
              <span className="truncate font-medium">
                {menuItem?.itemName}
              </span>
              <span className="shrink-0 font-bold text-red-600">
                ৳{menuItem?.price}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order-delivery-date">
                Delivery Date *
              </Label>
              <Input
                id="order-delivery-date"
                type="date"
                min={TODAY}
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order-delivery-address">
                Delivery Address *
              </Label>
              <Textarea
                id="order-delivery-address"
                rows={2}
                placeholder="House, street, area, city..."
                value={deliveryAddress}
                onChange={(event) =>
                  setDeliveryAddress(event.target.value)
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="order-message">
                Additional Message
              </Label>
              <Textarea
                id="order-message"
                rows={2}
                placeholder="Extra instructions for the vendor (optional)..."
                value={additionalMessage}
                onChange={(event) =>
                  setAdditionalMessage(event.target.value)
                }
              />
            </div>

            {formError ? (
              <p className="text-sm text-red-600">{formError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOrderDialogOpen(false)}
              disabled={ordering}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleOrder}
              disabled={ordering}
            >
              {ordering ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
