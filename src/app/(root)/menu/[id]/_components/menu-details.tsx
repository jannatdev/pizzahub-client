"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
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
import { getAllPublicMenus } from "@/lib/api/browseMenu";
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

  // Other approved + active items of the same category (cross-links).
  // Stored together with their category so stale data from a previously
  // viewed item never renders under the wrong heading.
  const [related, setRelated] = useState<{
    category: string;
    items: Menu[];
  }>({ category: "", items: [] });

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
  // Related items — other approved + active dishes in the same
  // category. Best-effort: the section just stays hidden on failure.
  // setState only runs inside the async callback (React lint rule).
  // ---------------------------------------------------------------
  useEffect(() => {
    if (pageState !== "ready" || !menuItem?.category) return;

    const category = menuItem.category;
    const currentId = menuItem._id;
    let ignore = false;

    (async () => {
      try {
        const data = await getAllPublicMenus({ category });

        if (ignore) return;

        setRelated({
          category,
          items: (data.menus ?? [])
            .filter((item) => item._id !== currentId)
            .slice(0, 8),
        });
      } catch {
        // Non-critical — leave the section hidden.
      }
    })();

    return () => {
      ignore = true;
    };
  }, [pageState, menuItem]);

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
        quantity,
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
            className="bg-orange-500 text-white hover:bg-orange-600"
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
            className="bg-orange-500 text-white hover:bg-orange-600"
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

  // 4 full stars + 1 half star (visual placeholder — see starCount above)
  const stars = (
    <>
      {Array.from({ length: starCount }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      <span className="relative inline-flex">
        <Star className="h-4 w-4 text-gray-300" />
        <span className="absolute inset-0 w-1/2 overflow-hidden">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        </span>
      </span>
    </>
  );

  const totalPrice = menuItem.price * quantity;

  // Real tag values available in the data model (no fake demo tags)
  const tags = [menuItem.category, menuItem.location].filter(Boolean);

  // Same-category cross-links, only once they belong to THIS item's
  // category and excluding the item itself.
  const relatedForCategory =
    related.category === menuItem.category
      ? related.items.filter((item) => item._id !== menuItem._id)
      : [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb — Home » Category » Item */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm font-medium">
        <Link
          href="/"
          className="text-gray-900 hover:text-orange-500"
        >
          Home
        </Link>
        <span className="text-gray-400">»</span>
        <Link
          href="/browse-menu"
          className="text-gray-900 hover:text-orange-500"
        >
          {menuItem.category}
        </Link>
        <span className="text-gray-400">»</span>
        <span className="text-orange-500">
          {menuItem.itemName}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 gap-y-6">
        {/* ------------------------------------------------------- */}
        {/* Image gallery                                             */}
        {/* ------------------------------------------------------- */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
            {galleryImages[activeIndex] ? (
              <Image
                src={galleryImages[activeIndex]}
                alt={`${menuItem.itemName} — image ${activeIndex + 1} of ${galleryImages.length}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              /* No image uploaded for this item */
              <div className="flex h-full w-full items-center justify-center bg-orange-50">
                <UtensilsCrossed className="h-16 w-16 text-orange-200" />
              </div>
            )}

            {/* Previous / next (only when there is more than one image) */}
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={showPrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-orange-500 shadow-sm transition hover:bg-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  aria-label="Next image"
                  onClick={showNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-orange-500 shadow-sm transition hover:bg-white"
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
                          ? "bg-orange-500"
                          : "bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {/* <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {galleryImages.map((src, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative shrink-0 w-24 h-24 rounded-md border overflow-hidden ${
                  activeIndex === index
                    ? "border-orange-500 ring-2 ring-orange-500/40"
                    : "border-gray-200 hover:border-orange-300 transition"
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
          </div> */}

          {/* Other items in the same category — small image row */}
          {relatedForCategory.length > 0 ? (
            <div className="pt-2">
              <h2 className="text-sm font-semibold text-gray-900">
                More in{" "}
                <span className="text-orange-500">
                  {menuItem.category}
                </span>
              </h2>

              <div className="mt-3 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {relatedForCategory.map((item) => (
                  <Link
                    key={item._id}
                    href={`/menu/${item._id}`}
                    className="group w-24 shrink-0"
                  >
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.itemName}
                          fill
                          sizes="96px"
                          className="object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <UtensilsCrossed className="h-6 w-6 text-orange-200" />
                        </div>
                      )}
                    </div>

                    <p className="mt-1.5 truncate text-xs font-medium text-gray-700 transition group-hover:text-orange-500">
                      {item.itemName}
                    </p>
                    <p className="text-xs font-semibold text-orange-500">
                      ৳{item.price}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* ------------------------------------------------------- */}
        {/* Item information                                          */}
        {/* ------------------------------------------------------- */}
        <div className="space-y-5">
          {/* Availability status */}
          <div>{statusBadge}</div>

          {/* Name */}
          <h1 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            {menuItem.itemName}
          </h1>

          {/* Rating */}
          <div className="flex flex-wrap items-center gap-2">
            {stars}
            <span className="text-sm font-medium text-gray-700">
              ({reviewCount} customer reviews)
            </span>
          </div>

          {/* Short description */}
          <p className="text-sm leading-relaxed text-gray-500 sm:text-base">
            {menuItem.description ||
              "No description available for this item."}
          </p>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-orange-500">
              ৳{menuItem.price}
            </span>

            {quantity > 1 ? (
              <span className="text-sm font-medium text-gray-500">
                Total ৳{totalPrice}
              </span>
            ) : null}
          </div>

          {/* Order actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Session still loading — avoid flashing the wrong button */}
            {isPending ? (
              <Button
                size="lg"
                className="h-12 w-full px-6 sm:w-auto"
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
                className="h-12 w-full bg-orange-500 px-8 text-white hover:bg-orange-600 sm:w-auto"
              >
                Login to Order
              </Button>
            ) : role === "admin" ? (
              /* Admin → cannot place customer orders */
              <Button
                size="lg"
                className="h-12 w-full bg-gray-100 px-6 text-gray-500 hover:bg-gray-100 sm:w-auto"
                disabled
              >
                Admins cannot place orders
              </Button>
            ) : role === "vendor" ? (
              /* Vendor → cannot order (own item or otherwise) */
              <Button
                size="lg"
                className="h-12 w-full bg-gray-100 px-6 text-gray-500 hover:bg-gray-100 sm:w-auto"
                disabled
              >
                {isOwnItem
                  ? "You cannot order your own item"
                  : "Vendors cannot place orders"}
              </Button>
            ) : !isAvailable ? (
              /* Customer but item not approved/active */
              <Button
                size="lg"
                className="h-12 w-full bg-gray-100 px-6 text-gray-500 hover:bg-gray-100 sm:w-auto"
                disabled
              >
                Ordering unavailable
              </Button>
            ) : (
              /* Eligible customer — quantity + Order now */
              <div className="flex w-full items-center gap-3 sm:w-auto">
                <div className="flex h-12 items-center gap-1 rounded-lg border border-orange-200 bg-white px-2">
                  <button
                    type="button"
                    onClick={decrementQty}
                    disabled={quantity === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-orange-50 disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Decrease quantity"
                  >
                    <span className="text-base leading-none">−</span>
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={incrementQty}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition hover:bg-orange-50"
                    aria-label="Increase quantity"
                  >
                    <span className="text-base leading-none">+</span>
                  </button>
                </div>

                <Button
                  size="lg"
                  className="h-12 flex-1 bg-orange-500 px-8 text-sm font-semibold text-white hover:bg-orange-600 sm:flex-none"
                  disabled={ordering}
                  onClick={openOrderForm}
                >
                  {ordering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Order now"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Why ordering is (or is not) available */}
          {!isLoggedIn ? (
            <p className="text-xs text-gray-500">
              Sign in with a customer account to order this item.
            </p>
          ) : role === "admin" ? (
            <p className="text-xs text-gray-500">
              Admin accounts cannot place customer orders.
            </p>
          ) : role === "vendor" ? (
            <p className="text-xs text-gray-500">
              {isOwnItem
                ? "This is your own menu item — vendors cannot order from themselves."
                : "Vendor accounts cannot place customer orders."}
            </p>
          ) : !isAvailable ? (
            <p className="text-xs text-gray-500">{unavailableReason}</p>
          ) : (
            <p className="text-xs text-gray-500">
              Your order is sent to the vendor for approval.
            </p>
          )}

          {/* Category / Tags / Location — reference-style rows */}
          <div className="border-t border-gray-100 pt-5 text-sm">
            <p>
              <span className="font-semibold text-gray-900">
                Category:
              </span>{" "}
              <span className="text-gray-600">{menuItem.category}</span>
            </p>

            {tags.length > 0 ? (
              <p className="mt-3 border-t border-gray-100 pt-3">
                <span className="font-semibold text-gray-900">
                  Tags:
                </span>{" "}
                {tags.map((tag, index) => (
                  <span key={tag}>
                    {index > 0 ? ", " : ""}
                    <span className="text-gray-600 transition hover:text-orange-500">
                      {tag}
                    </span>
                  </span>
                ))}
              </p>
            ) : null}

            <p className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-3">
              <span className="font-semibold text-gray-900">
                Location:
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-3.5 w-3.5 text-orange-500" />
                {menuItem.location}
              </span>
            </p>
          </div>

          {/* Vendor Information */}
          <div className="rounded-lg border border-orange-100 bg-orange-50/50 p-4">
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
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-orange-100"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-600">
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
        </div>
      </div>

      {/* ----------------------------------------------------------- */}
      {/* Tabs: Description / Reviews                                 */}
      {/* ----------------------------------------------------------- */}
      <div className="mt-12">
        {/* Tab headers — reference-style boxes sitting on the divider line */}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`rounded-t-md border px-6 py-2.5 text-sm font-semibold transition ${
              activeTab === "description"
                ? "border-orange-300 bg-white text-orange-500"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-orange-500"
            }`}
          >
            Description
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`rounded-t-md border px-6 py-2.5 text-sm font-semibold transition ${
              activeTab === "reviews"
                ? "border-orange-300 bg-white text-orange-500"
                : "border-gray-200 bg-gray-50 text-gray-600 hover:text-orange-500"
            }`}
          >
            Reviews ({reviewCount})
          </button>
          <div className="flex-1 border-b border-gray-200" />
        </div>

        {/* Description panel */}
        {activeTab === "description" && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Description</h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-500 sm:text-base">
              {menuItem.description ||
                "No description available for this item."}
            </p>

            {/* Quick specs — real item data */}
            <dl className="mt-6 border-t border-gray-100">
              <div className="flex gap-6 border-b border-gray-100 py-3 text-sm">
                <dt className="w-40 shrink-0 font-medium text-gray-700">
                  Category:
                </dt>
                <dd className="text-gray-500">{menuItem.category}</dd>
              </div>

              <div className="flex gap-6 border-b border-gray-100 py-3 text-sm">
                <dt className="w-40 shrink-0 font-medium text-gray-700">
                  Location:
                </dt>
                <dd className="text-gray-500">{menuItem.location}</dd>
              </div>

              <div className="flex gap-6 border-b border-gray-100 py-3 text-sm">
                <dt className="w-40 shrink-0 font-medium text-gray-700">
                  Vendor:
                </dt>
                <dd className="text-gray-500">
                  {menuItem.vendorName || "Unknown Vendor"}
                </dd>
              </div>

              <div className="flex gap-6 border-b border-gray-100 py-3 text-sm">
                <dt className="w-40 shrink-0 font-medium text-gray-700">
                  Availability:
                </dt>
                <dd className="text-gray-500">
                  {isAvailable
                    ? "Approved & Active"
                    : menuItem.status === "Pending"
                      ? "Pending approval"
                      : menuItem.status === "Rejected"
                        ? "Rejected"
                        : "Inactive"}
                </dd>
              </div>
            </dl>
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
                {quantity > 1 ? ` × ${quantity}` : ""}
              </span>
              <span className="shrink-0 font-bold text-orange-500">
                ৳{totalPrice}
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
              className="bg-orange-500 text-white hover:bg-orange-600"
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
