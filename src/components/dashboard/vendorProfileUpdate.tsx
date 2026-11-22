
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DASHBOARD_HOME } from "@/lib/dashboard-paths";

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

import { UserRound, Loader2 } from "lucide-react";
import Image from "next/image";
import { AuthUser } from "@/type/auth";

interface VendorProfileClientProps {
  user: AuthUser;
}

export default function VendorProfileUpdate({
  user,
}: VendorProfileClientProps) {
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [email] = useState(user.email || "");
  const [businessName, setBusinessName] = useState(
    user.businessName || ""
  );
  const [imageUrl, setImageUrl] = useState(user.image || "");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Clean up temporary image preview URL.
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      let finalImageUrl = imageUrl;

      // Upload profile image if a new image is selected.
      if (imageFile) {
        const formData = new FormData();

        formData.append("profileImage", imageFile);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL is not configured.");
        }

        const uploadResponse = await fetch(
          `${apiUrl}/images/profile`,
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json().catch(() => null);

        if (!uploadResponse.ok || !uploadResult?.imageUrl) {
          throw new Error(
            uploadResult?.message ||
              `Image upload failed (HTTP ${uploadResponse.status}).`
          );
        }

        finalImageUrl = uploadResult.imageUrl;
      }

      // Update profile through the Next.js server API.
      const response = await fetch("/api/vendor/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          businessName,
          image: finalImageUrl,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to update profile."
        );
      }

      toast.success("Profile updated successfully!");

      router.refresh();
      router.push(DASHBOARD_HOME.vendor);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <Card className="p-6 sm:p-8">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              Profile Settings
            </CardTitle>

            <CardDescription>
              Update your name, shop name, profile image and account details.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>

                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>

                <Input
                  id="businessName"
                  placeholder="Enter your restaurant name"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Profile Image */}
              <div className="flex flex-col items-center gap-3">
                {preview || imageUrl ? (
                  <Image
                    src={preview || imageUrl}
                    alt="Profile"
                    width={25}
                    height={25}
                    className="h-24 w-24 rounded-full border border-red-200 object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-red-500">
                    <UserRound size={42} />
                  </div>
                )}

                <Label htmlFor="profileImage">
                  Change Profile Image
                </Label>

                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e.target.files?.[0] ?? null)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Save Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
