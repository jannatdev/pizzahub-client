import { ShoppingBag } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function CustomerOrdersPage() {
  return (
    <PagePlaceholder
      icon={ShoppingBag}
      title="My Orders"
      description="Track your pizza orders and their delivery status here."
    />
  );
}
