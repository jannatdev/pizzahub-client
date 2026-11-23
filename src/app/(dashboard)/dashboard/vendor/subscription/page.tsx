import SubscriptionStatus from "@/components/card/vendor/subscription-status";


export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Subscription
        </h1>
        <p className="text-sm text-gray-500">
          Manage your vendor plan and menu item limit.
        </p>
      </div>

      <SubscriptionStatus />
    </div>
  );
}
