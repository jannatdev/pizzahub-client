
import { getCurrentUser } from "@/lib/session";

import VendorProfileUpdate from "@/components/dashboard/vendorProfileUpdate";

export default async function VendorProfilePage() {
  const user = await getCurrentUser();

  return <VendorProfileUpdate user={user} />;
}
