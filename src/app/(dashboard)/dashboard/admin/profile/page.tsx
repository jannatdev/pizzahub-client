import { Settings } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function AdminProfilePage() {
  return (
    <PagePlaceholder
      icon={Settings}
      title="Profile Settings"
      description="Update your name and profile image."
    />
  );
}
