import { Users } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function ManageUsersPage() {
  return (
    <PagePlaceholder
      icon={Users}
      title="Manage Users"
      description="Search, filter, block and unblock customers and vendors."
    />
  );
}
