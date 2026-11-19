import { LayoutDashboard } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function AdminOverviewPage() {
  return (
    <div className="bg-red-50">
        <PagePlaceholder
      icon={LayoutDashboard}
      title="Admin Overview"
      description="Platform stats — users, menu items and transactions — will appear here."
    />
    </div>
   
  );
}
