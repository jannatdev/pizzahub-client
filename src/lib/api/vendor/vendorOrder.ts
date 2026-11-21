
import type {
  OrderStatus,
  VendorOrdersResponse,
} from "@/type/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// GET: Fetch vendor orders
export const getVendorOrders = async (): Promise<VendorOrdersResponse> => {
  const response = await fetch(`${API_URL}/vendor/orders`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch vendor orders.");
  }

  return result;
};

// PATCH: Accept or Reject an order
export const updateVendorOrderStatus = async (
  id: string,
  status: "Accepted" | "Rejected"
) => {
  const response = await fetch(
    `${API_URL}/vendor/orders/${id}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update order status.");
  }

  return result;
};
