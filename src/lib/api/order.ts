
import type { Order, ApiResponse } from "@/type/order";
import { authFetch } from "./auth-fetch";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Shared request helper (mirrors `lib/api/menu.ts`): builds the URL, explains
// network failures (backend not running) and always parses JSON safely.
const request = async (path: string, init?: RequestInit) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const url = `${API_URL}${path}`;

  let response: Response;

  try {
    response = await  authFetch(url, init);
  } catch {
    throw new Error(
      "Could not reach the API. Please make sure the backend server is running."
    );
  }

  const data: ApiResponse<unknown> | null = await response
    .json()
    .catch(() => null);

  if (!response.ok || !data?.success) {
    const error = new Error(
      data?.message || `Request failed (HTTP ${response.status}).`
    ) as Error & { status?: number };

    error.status = response.status;
    throw error;
  }

  return data;
};

// GET MY ORDERS — GET /api/orders (backend returns the signed-in customer's
// own orders; there is no `/my-orders` path on the server).
export const getMyOrders = async (): Promise<Order[]> => {
  const result = await authFetch("/api/orders", {
    method: "GET",
    cache: "no-store",
  });

  return (result.data as Order[] | undefined) ?? [];
};

// GET SINGLE ORDER
export const getOrderById = async (
  orderId: string
): Promise<Order> => {
  const result = await authFetch(`api/orders/${orderId}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!result.data) {
    throw new Error("Order not found.");
  }

  return result.data as Order;
};
// CREATE ORDER — delivery date/address are required by the backend.
export const createOrder = async ({
  menuId,
  quantity = 1,
  deliveryDate,
  deliveryAddress,
  additionalMessage,
}: {
  menuId: string;
  quantity?: number;
  deliveryDate: string;
  deliveryAddress: string;
  additionalMessage?: string;
}): Promise<Order> => {
  const result = await request("/api/orders", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      menuId,
      quantity,
      deliveryDate,
      deliveryAddress,
      additionalMessage,
    }),
  });

  // The create endpoint answers with `order`, not `data`.
  const order = (result as ApiResponse<Order>).order;

  if (!order) {
    throw new Error("Order placed but no order was returned.");
  }

  return order;
};

// CANCEL ORDER — only Pending orders can be cancelled (backend enforces).
export const cancelOrder = async (orderId: string): Promise<Order> => {
  const result = await request(`/api/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!result.data) {
    throw new Error("Failed to cancel order.");
  }

  return result.data as Order;
};
