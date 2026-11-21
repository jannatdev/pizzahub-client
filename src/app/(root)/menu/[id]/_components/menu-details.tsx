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
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import type { Menu } from "@/type/menu";
import type { UserRole } from "@/context/auth-context";
import { getMenuDetails } from "@/lib/api/menu";
import { placeOrder } from "@/lib/api/order";
import { useSession } from "@/lib/auth-client";

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

  // Image gallery index
  const [activeIndex, setActiveIndex] = useState(0);

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

  // ---------------------------------------------------------------
  // Place order (backend re-validates everything)
  // ---------------------------------------------------------------
  const handleOrder = async () => {
    // Ignore repeated clicks while a request is in flight
    if (ordering || !menuItem) return;

    setOrdering(true);

    try {
      await placeOrder({ menuId: menuItem._id, quantity: 1 });

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
  // Ready — item details
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

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/browse-menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-red-600 transition-colors hover:text-red-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Browse Menu
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {/* ------------------------------------------------------- */}
        {/* Image gallery                                            */}
        {/* ------------------------------------------------------- */}
        <div>
          {galleryImages.length > 0 ? (
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
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-red-300">
              <Store className="h-12 w-12" />
              <span className="text-sm font-medium">
                No image available
              </span>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------- */}
        {/* Item information                                         */}
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
          <h1 className="text-3xl font-bold sm:text-4xl">
            {menuItem.itemName}
          </h1>

          {/* Price + location */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="text-3xl font-extrabold text-red-600">
              ৳{menuItem.price}
            </p>

            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-orange-500" />
              {menuItem.location}
            </p>
          </div>

          {/* Description */}
          {menuItem.description ? (
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-600">
                Description
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {menuItem.description}
              </p>
            </div>
          ) : null}

          {/* Vendor information */}
          <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-orange-600">
              Provided by
            </h2>

            <div className="mt-3 flex items-center gap-3">
              {menuItem.vendorImage ? (
                <Image
                  src={menuItem.vendorImage}
                  alt={menuItem.vendorName || "Vendor"}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-red-100"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Store className="h-5 w-5" />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {menuItem.vendorName || "Unknown Vendor"}
                </p>

                {menuItem.vendorEmail ? (
                  <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {menuItem.vendorEmail}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------- */}
          {/* Order box                                              */}
          {/* ----------------------------------------------------- */}
          <div className="space-y-3 rounded-xl border border-red-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Price
              </span>
              <span className="text-xl font-bold text-red-600">
                ৳{menuItem.price}
              </span>
            </div>

            {/* Session still loading — avoid flashing the wrong button */}
            {isPending ? (
              <Button
                size="lg"
                className="w-full"
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
                className="w-full bg-red-600 text-white hover:bg-red-700"
              >
                Login to Order
              </Button>
            ) : role === "admin" ? (
              /* Admin → cannot place customer orders */
              <Button size="lg" className="w-full" disabled>
                Admins cannot place orders
              </Button>
            ) : role === "vendor" ? (
              /* Vendor → cannot order (own item or otherwise) */
              <Button size="lg" className="w-full" disabled>
                {isOwnItem
                  ? "You cannot order your own item"
                  : "Vendors cannot place orders"}
              </Button>
            ) : !isAvailable ? (
              /* Customer but item not approved/active */
              <Button size="lg" className="w-full" disabled>
                Ordering unavailable
              </Button>
            ) : (
              /* Eligible customer */
              <Button
                size="lg"
                className="w-full bg-red-600 text-white hover:bg-red-700"
                disabled={ordering}
                onClick={handleOrder}
              >
                {ordering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order Now
                  </>
                )}
              </Button>
            )}

            {/* Why ordering is (or is not) available */}
            <p className="text-center text-xs text-muted-foreground">
              {!isLoggedIn
                ? "Sign in with a customer account to order this item."
                : role === "admin"
                  ? "Admin accounts cannot place customer orders."
                  : role === "vendor"
                    ? isOwnItem
                      ? "This is your own menu item — vendors cannot order from themselves."
                      : "Vendor accounts cannot place customer orders."
                    : !isAvailable
                      ? unavailableReason
                      : "Your order is sent to the vendor for approval."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
