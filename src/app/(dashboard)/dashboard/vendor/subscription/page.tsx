import { CreditCard } from "lucide-react";

import { PagePlaceholder } from "@/components/dashboard/placeholder";

export default function SubscriptionPage() {
  return (
    <PagePlaceholder
      icon={CreditCard}
      title="Subscription"
      description="Upgrade to Premium with Stripe for unlimited menu items."
    />
  );
}
