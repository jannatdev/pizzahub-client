import { Settings } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function VendorProfilePage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Profile Settings"
      description="Update your name, profile image and shop details."
    />
  );
}
