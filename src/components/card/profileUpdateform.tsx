
"use client";

import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Camera, Upload, X } from "lucide-react";

import { authFetch } from "@/lib/api/auth-fetch";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type ImageUploadResponse = {
  success: boolean;
  message: string;
  imageUrl?: string;
};

export default function ProfileUpdateForm({
  profile,
  endpoint,
  userType,
}: ProfileUpdateFormProps) {
  const [name, setName] = useState(profile.name || "");
  const [image, setImage] = useState(profile.image || "");
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [businessName, setBusinessName] = useState(
    profile.businessName || ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Select and preview image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  // Upload image to ImgBB through backend
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      // Must match upload.single("profileImage") in Express
      formData.append("profileImage", selectedFile);

      const response = await authFetch("/images/profile", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result: ImageUploadResponse = await response.json();

      if (!response.ok || !result.success || !result.imageUrl) {
        throw new Error(result.message || "Image upload failed.");
      }

      // Save uploaded ImgBB URL in form state
      setImage(result.imageUrl);
      setPreview("");
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Profile image uploaded successfully!");
    } catch (error) {
      console.error("Image upload error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Update profile
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

    if (selectedFile) {
      toast.error("Please upload your selected image first.");
      return;
    }

    setIsSaving(true);

    try {
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

      const response = await authFetch(endpoint, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Profile update failed.");
      }

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
          <div className="flex flex-wrap items-center gap-5">
            <Avatar className="h-24 w-24 border-2 border-gray-200">
              <AvatarImage
                src={preview || image || undefined}
                alt={name}
              />
              <AvatarFallback className="bg-red-50 text-2xl font-bold text-red-600">
                {name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <p className="font-semibold">
                {name || "Your Name"}
              </p>

              <p className="text-sm text-muted-foreground">
                Profile picture
              </p>

              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>

                {selectedFile && (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isUploading}
                    onClick={handleImageUpload}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </Button>
                )}
              </div>

              {selectedFile && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="max-w-48 truncate">
                    {selectedFile.name}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={isUploading}
                    aria-label="Remove selected image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                JPG, PNG, or other image formats. Maximum 5MB.
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

          {/* Vendor business name */}
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
              You can also paste an image URL manually.
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={profile.email}
              readOnly
              disabled
            />
          </div>

          {/* Role */}
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

          {/* Save */}
          <Button
            type="submit"
            disabled={isSaving || isUploading || !!selectedFile}
            className="w-full bg-red-600 font-semibold text-white hover:bg-red-700"
          >
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
