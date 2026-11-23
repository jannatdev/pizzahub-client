import type { VendorOrdersResponse } from "@/type/order";
import { authFetch } from "@/lib/api/auth-fetch";

// GET: Fetch vendor orders
export const getVendorOrders = async (): Promise<VendorOrdersResponse> => {
  const result = await authFetch("/api/vendor/orders", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return result as VendorOrdersResponse;
};

// PATCH: Accept or Reject an order
export const updateVendorOrderStatus = async (
  id: string,
  status: "Accepted" | "Rejected"
) => {
  const result = await authFetch(`/api/vendor/orders/${id}/status`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return result;
};
