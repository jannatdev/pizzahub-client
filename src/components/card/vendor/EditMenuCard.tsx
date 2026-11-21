"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertTriangle,
  FileText,
  ImagePlus,
  Loader2,
  MapPin,
  Pizza,
  Tag,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { MenuItem } from "@/type/menu";
import { MENU_CATEGORIES } from "@/lib/menu-categories";
import {
  getMyMenuItemById,
  updateMyMenuItem,
} from "@/lib/api/vendor/vendorMenu";

type PageState = "loading" | "ready" | "notfound" | "error";

interface EditMenuCardProps {
  id: string;
}

const EditMenuCard = ({ id }: EditMenuCardProps) => {
  const router = useRouter();

  // Item load state
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [item, setItem] = useState<MenuItem | null>(null);

  // Form fields (prefilled once the item loads)
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");

  // Image handling:
  //   originalImageUrl — what the item currently has in the database
  //   imageUrl         — what will be saved on submit
  //   preview          — local blob preview while a new upload is in flight
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------------------------------------------------------------
  // Load the existing item (vendor-owned, enforced by the backend)
  // ---------------------------------------------------------------
  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const result = await getMyMenuItemById(id);

        if (ignore) return;

        const loaded = result.data;

        setItem(loaded);
        setItemName(loaded.itemName);
        setCategory(loaded.category);
        setDescription(loaded.description);
        setPrice(String(loaded.price));
        setLocation(loaded.location);
        setOriginalImageUrl(loaded.imageUrl || "");
        setImageUrl(loaded.imageUrl || "");
        setPageState("ready");
      } catch (err) {
        if (ignore) return;

        const error = err as Error & { status?: number };

        // 400 (invalid id) / 404 (missing or not yours) → not-found UI
        if (error.status === 400 || error.status === 404) {
          setPageState("notfound");
        } else {
          setErrorMsg(
            error.message || "Something went wrong while loading this item."
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
  // Image upload (same endpoint and rules as AddMenuCard)
  // ---------------------------------------------------------------
  const handleImageChange = async (file: File | undefined) => {
    if (!file) return;

    if (isUploading || isSubmitting) {
      toast.error("Please wait for the current operation to finish.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(previewUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("menuImage", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
      }

      let res: Response;

      try {
        res = await fetch(`${apiUrl}/images/menu`, {
          method: "POST",
          body: formData,
        });
      } catch {
        throw new Error(
          "Could not reach the upload server. Please make sure the backend server is running."
        );
      }

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success || !data.imageUrl) {
        throw new Error(
          data?.message || `Image upload failed (HTTP ${res.status}).`
        );
      }

      // Swap to the uploaded image — the old image stays untouched
      // in the database until the form is saved.
      URL.revokeObjectURL(previewUrl);
      setPreview(null);
      setImageUrl(data.imageUrl);

      toast.success("Image uploaded successfully.");
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setPreview(null);

      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Revert a pending image change back to the saved image
  const revertImage = () => {
    if (isUploading || isSubmitting) return;

    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }

    setImageUrl(originalImageUrl);
  };

  const imageChanged = imageUrl !== originalImageUrl;

  // ---------------------------------------------------------------
  // Save changes
  // ---------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUploading || isSubmitting) {
      toast.error("Please wait for the current operation to finish.");
      return;
    }

    const trimmedName = itemName.trim();
    const trimmedDescription = description.trim();
    const trimmedLocation = location.trim();

    if (
      !trimmedName ||
      !category ||
      !trimmedDescription ||
      !price.trim() ||
      !trimmedLocation
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!imageUrl) {
      toast.error("Please upload an item image first.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateMyMenuItem(id, {
        itemName: trimmedName,
        category,
        description: trimmedDescription,
        price: Number(price),
        location: trimmedLocation,
        imageUrl,
      });

      if (result.success) {
        toast.success("Menu item updated successfully.");
        router.push("/dashboard/vendor/menu/ManageMenu");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update menu item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------------------------------------------------------
  // Loading skeleton
  // ---------------------------------------------------------------
  if (pageState === "loading") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Error state
  // ---------------------------------------------------------------
  if (pageState === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/40 px-6 py-14 text-center">
        <AlertTriangle className="h-10 w-10 text-orange-500" />
        <h2 className="text-lg font-bold">Something Went Wrong</h2>
        <p className="text-sm text-muted-foreground">{errorMsg}</p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button
            render={<Link href="/dashboard/vendor/menu/ManageMenu" />}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Back to My Menu
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Not-found state (invalid id, missing item, or not yours)
  // ---------------------------------------------------------------
  if (pageState === "notfound" || !item) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/40 px-6 py-14 text-center">
        <Pizza className="h-10 w-10 text-orange-400" />
        <h2 className="text-lg font-bold">Menu Item Not Found</h2>
        <p className="text-sm text-muted-foreground">
          This item does not exist or you do not own it.
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
          <Button
            render={<Link href="/dashboard/vendor/menu/ManageMenu" />}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Back to My Menu
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // Ready — the edit form
  // ---------------------------------------------------------------
  return (
    <Card className="border-red-100 shadow-sm">
      <CardHeader>
        <h2 className="text-xl font-bold">Edit Item Details</h2>
        <p className="text-sm text-muted-foreground">
          Update the information below. Editing does not change your
          item&apos;s approval status.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ITEM NAME */}
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <div className="relative">
              <Pizza className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
              <Input
                id="itemName"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g. Margherita Pizza"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* CATEGORY */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value ?? "")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {MENU_CATEGORIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your menu item..."
                className="min-h-28 pl-10"
                required
              />
            </div>
          </div>

          {/* PRICE */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (৳)</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
              <Input
                id="price"
                type="number"
                min="0.01"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* LOCATION */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-orange-400" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mirpur, Dhaka"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* IMAGE */}
          <div className="space-y-2">
            <Label>Menu Image</Label>

            {preview || imageUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-red-100 bg-red-50">
                <div className="relative aspect-video w-full">
                  <Image
                    src={preview ?? imageUrl}
                    alt={itemName || "Menu image preview"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 512px"
                  />
                </div>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium">
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                      Uploading image...
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    {imageChanged ? "New image (saved on submit)" : "Current image"}
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50">
                      Replace
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={isUploading || isSubmitting}
                        onChange={(e) =>
                          handleImageChange(e.target.files?.[0])
                        }
                      />
                    </label>

                    {imageChanged && (
                      <button
                        type="button"
                        onClick={revertImage}
                        disabled={isUploading || isSubmitting}
                        className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted disabled:opacity-50"
                      >
                        Revert
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-200 px-6 py-10 transition hover:border-red-400 hover:bg-red-50/40">
                <ImagePlus className="mb-3 h-10 w-10 text-orange-400" />
                <span className="text-sm font-medium text-red-600">
                  Click to upload a new image
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  JPG, PNG, WEBP (Maximum 5MB)
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isUploading || isSubmitting}
                  onChange={(e) => handleImageChange(e.target.files?.[0])}
                />
              </label>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 border-t border-red-100 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || isUploading}
              onClick={() => router.push("/dashboard/vendor/menu/ManageMenu")}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving Changes...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditMenuCard;
