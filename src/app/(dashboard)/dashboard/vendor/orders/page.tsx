import { ShoppingBag } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function VendorOrdersPage() {
  return (
    <PagePlaceholder
      icon={ShoppingBag}
      title="Customer Orders"
      description="Accept or reject incoming orders for your menu items."
    />
  );
}
