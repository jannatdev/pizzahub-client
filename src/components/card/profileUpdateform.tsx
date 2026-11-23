
"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

import { authFetch } from "@/lib/api/auth-fetch";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ProfileData = {
  name: string;
  email: string;
  image?: string;
  role: "customer" | "vendor" | "admin";
  businessName?: string;
};

type ProfileUpdateFormProps = {
  profile: ProfileData;
  endpoint: string;
  userType: "customer" | "vendor";
};

export default function ProfileUpdateForm({
  profile,
  endpoint,
  userType,
}: ProfileUpdateFormProps) {
  const [name, setName] = useState(profile.name || "");
  const [image, setImage] = useState(profile.image || "");
  const [businessName, setBusinessName] = useState(
    profile.businessName || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (userType === "vendor" && !businessName.trim()) {
      toast.error("Business name is required.");
      return;
    }

    setIsSaving(true);

    try {
      // Only send editable profile fields.
      // Never send role or subscription information.
      const payload =
        userType === "vendor"
          ? {
              name: name.trim(),
              image: image.trim(),
              businessName: businessName.trim(),
            }
          : {
              name: name.trim(),
              image: image.trim(),
            };

      await authFetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Update Profile
        </CardTitle>
        <CardDescription>
          Manage your personal information and profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile image preview */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border">
              <AvatarImage src={image || undefined} alt={name} />
              <AvatarFallback className="text-xl">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <p className="font-semibold">{name || "Your Name"}</p>
              <p className="text-sm text-muted-foreground">
                Profile picture preview
              </p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Vendor-only business name */}
          {userType === "vendor" && (
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>
          )}

          {/* Profile image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Profile Image URL</Label>
            <Input
              id="image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://example.com/profile.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Optional. Paste a publicly accessible image URL.
            </p>
          </div>

          {/* Read-only account information */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={profile.email}
              readOnly
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Account Role</Label>
            <Input
              id="role"
              value={profile.role}
              readOnly
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Your account role cannot be changed from profile settings.
            </p>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-red-600 font-semibold text-white hover:bg-red-700"
          >
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
