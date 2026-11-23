
"use client";

import ProfileUpdateForm from "@/components/card/profileUpdateform";
import { useSession } from "@/lib/auth-client";

export default function VendorProfilePage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <p>Loading profile...</p>;
  }

  if (!session?.user) {
    return <p>Please sign in to view your profile.</p>;
  }

  const profile = {
    name: session.user.name || "",
    email: session.user.email || "",
    image: session.user.image || "",
    role: "vendor" as const,
  };

  return (
    <ProfileUpdateForm
      profile={profile}
      userType="vendor"
      endpoint="/vendor/profile"
    />
  );
}

