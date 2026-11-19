import { LayoutDashboard } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function CustomerOverviewPage() {
  return (
    <PagePlaceholder
      icon={LayoutDashboard}
      title="Customer Overview"
      description="Your order stats and recent activity will appear here."
    />
  );
}
