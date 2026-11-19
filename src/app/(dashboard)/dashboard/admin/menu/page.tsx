import { Utensils } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function ManageMenuItemsPage() {
  return (
    <PagePlaceholder
      icon={Utensils}
      title="Manage Menu Items"
      description="Review, approve or reject menu items submitted by vendors."
    />
  );
}
