import { Utensils } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function VendorMenuPage() {
  return (
    <PagePlaceholder
      icon={Utensils}
      title="My Menu Items"
      description="Create, edit, price and manage the pizzas on your menu."
    />
  );
}
