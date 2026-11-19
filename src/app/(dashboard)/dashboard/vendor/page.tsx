import { LayoutDashboard } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function VendorOverviewPage() {
  return (
    <PagePlaceholder
      icon={LayoutDashboard}
      title="Vendor Overview"
      description="Menu, order and revenue stats for your pizza shop will appear here."
    />
  );
}
