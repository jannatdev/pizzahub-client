import VendorOverviewCards from "@/components/card/vendor/vendorOverviewCard";


export default function VendorOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Vendor Overview
        </h1>
        <p className="text-sm text-gray-500">
          Track your menu performance, customer orders, and subscription.
        </p>
      </div>

      <VendorOverviewCards
        totalMenuItems={24}
        activeMenuItems={18}
        pendingOrders={5}
        acceptedOrders={12}
        isPremium={false}
      />
    </div>
  );
}