import { Receipt } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function TransactionsPage() {
  return (
    <PagePlaceholder
      icon={Receipt}
      title="Transactions"
      description="View-only history of Premium subscription payments."
    />
  );
}
