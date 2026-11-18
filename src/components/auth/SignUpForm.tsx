"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
  import { Eye, EyeOff,  Lock } from "lucide-react";


type UserRole = "customer" | "vendor";


export default function SignUpForm(){

    const router =useRouter()
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      let profileImage = "";

      // Upload profile image through your backend
      if (imageFile) {
        const formData = new FormData();
        formData.append("profileImage", imageFile);

       const apiUrl = process.env.NEXT_PUBLIC_API_URL;
     console.log("Starting image upload...");
console.log(
  "Upload URL:",
  `${process.env.NEXT_PUBLIC_API_URL}/images/profile`
);

    const uploadResponse = await fetch(
      `${apiUrl}/images/profile`,
      {
        method: "POST",
        body: formData,
      }
    );

   

        const uploadResult = await uploadResponse.json();
     

        if (!uploadResponse.ok) {
          throw new Error(
            uploadResult.message || "Profile image upload failed"
          );
        }

        profileImage = uploadResult.imageUrl;
      }

      // Better Auth signup
      const { data, error } = await authClient.signUp.email({
        name: fullName,
        email,
        password,
        image: profileImage || undefined,
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message || "Signup failed");
      }

      // Store the role using your trusted backend role-assignment flow.
      // Do not trust a public client-provided role as authorization.
     console.log(data)
      toast.success("Account created successfully!");
      router.push('/');
      router.refresh();


    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Signup failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);

      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        throw new Error(error.message || "Google signup failed");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Google signup failed"
      );
      setIsGoogleLoading(false);
    }
  };

  // Image preview and file selection
  const handleImageChange = (file: File | null) => {
    setImageFile(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
 

 
  <div className="flex min-h-screen items-center justify-center bg-gray-50 px-5 py-10">

    {/* Keep your existing Card exactly as it is */}
    <Card className="w-full max-w-md border-0 shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold">
          Create Account
        </CardTitle>
        <CardDescription>
          Join PizzaHub and enjoy delicious food.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSignUp} className="space-y-4">

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            {preview ? (
              <Image
                src={preview}
                alt="Profile preview"
                width={88}
                height={88}
                unoptimized
                className="h-22 w-22 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-22 w-22 items-center justify-center rounded-full bg-orange-100 text-sm text-orange-700">
                Profile
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageChange(e.target.files?.[0] ?? null)
              }
              className="max-w-xs"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
           <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
                className="pl-10 pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading || isGoogleLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

          {/* Role */}
          <div className="space-y-2">
            <Label>Account Type</Label>
            <Select
              value={role}
              onValueChange={(value) =>
                setRole(value as UserRole)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? "Connecting..." : "Continue with Google"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-red-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>

  </div>


   
  );
}
