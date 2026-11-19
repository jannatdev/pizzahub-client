
"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  ImagePlus,
  MapPin,
  Pizza,
  Tag,
  FileText,
  X,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const AddMenuCard = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
 const [category, setCategory] = useState<string | null>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const { data: session, isPending } = authClient.useSession();

  // IMAGE UPLOAD
  const handleImageChange = async (file: File | undefined) => {
    if (!file) return;

    if (isUploading || isSubmitting) {
      toast.error("Please wait for the current operation to finish.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    // Create local preview
    const previewUrl = URL.createObjectURL(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(previewUrl);
    setImageUrl(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("menuImage", file);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
      }

      // FIX: Upload image through your existing backend endpoint
      const res = await fetch(
        `${apiUrl}/images/menu`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success || !data.imageUrl) {
        throw new Error(data.message || "Image upload failed.");
      }

      setImageUrl(data.imageUrl);

      toast.success("Image uploaded successfully.");
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setImagePreview(null);
      setImageUrl(null);

      toast.error(
        error instanceof Error
          ? error.message
          : "Image upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // REMOVE IMAGE
  const removeImage = () => {
    if (isUploading || isSubmitting) return;

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(null);
    setImageUrl(null);
  };

  // RESET FORM
  const resetForm = () => {
    formRef.current?.reset();

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setCategory("");
    setImagePreview(null);
    setImageUrl(null);
  };

  // CREATE MENU
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (isPending) {
      toast.error("Please wait while your session is loading.");
      return;
    }

    if (!session?.user?.email) {
      toast.error("Please sign in again to add menu items.");
      return;
    }

    if (isUploading) {
      toast.error("Please wait for the image upload to finish.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    const itemName = String(formData.get("itemName") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();

    if (!itemName || !category || !description || !price || !location) {
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

    const email = session.user.email;

    setIsSubmitting(true);

    try {
      // One POST request creates the menu item. `credentials: "include"` is
      // required: the API lives on another origin (NEXT_PUBLIC_API_URL), and
      // without it the browser omits the Better Auth session cookie, so the
      // server would answer 401 "You must be logged in."
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/menu/${encodeURIComponent(email)}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemName,
            category,
            description,
            price: Number(price),
            location,
            imageUrl,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create menu item.");
      }

      toast.success("Menu item created — pending admin approval.");

      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create menu item."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // SESSION LOADING SPINNER
  if (isPending) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader>
        <h2 className="text-xl font-bold text-gray-900">
          Add New Menu Item
        </h2>
        <p className="text-sm text-gray-500">
          Add a delicious item to your restaurant menu.
        </p>
      </CardHeader>

      <CardContent>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* ITEM NAME */}
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <div className="relative">
              <Pizza className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="itemName"
                name="itemName"
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
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="description"
                name="description"
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
              <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="price"
                name="price"
                type="number"
                min="0.01"
                step="0.01"
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
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                name="location"
                placeholder="e.g. Mirpur, Dhaka"
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="space-y-2">
            <Label>Menu Image</Label>

            {imagePreview ? (
              <div className="relative overflow-hidden rounded-xl border">
                <Image
                  src={imagePreview}
                  alt="Menu preview"
                  fill
                  className="h-56 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={isUploading || isSubmitting}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 shadow disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>

                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium">
                      <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                      Uploading image...
                    </div>
                  </div>
                )}

                {imageUrl && (
                  <div className="bg-green-50 px-3 py-2 text-sm text-green-700">
                    Image uploaded successfully.
                  </div>
                )}
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 transition hover:border-red-400 hover:bg-red-50/30">
                <ImagePlus className="mb-3 h-10 w-10 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">
                  Click to upload menu image
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  JPG, PNG, WEBP (Maximum 5MB)
                </span>

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
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting || isUploading}
              onClick={resetForm}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || isUploading || !session}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Menu...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Create Menu"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMenuCard;
