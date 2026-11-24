
import type { Order, ApiResponse } from "@/type/order";
import { authFetch } from "./auth-fetch";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Shared request helper for endpoints that need the customer's JWT.
const request = async (path: string, init?: RequestInit) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  // `authFetch` already prefixes NEXT_PUBLIC_API_URL and attaches the Bearer
  // token, so only the RELATIVE path may be passed here. Passing a full URL
  // used to produce `…/https://…/api/orders`, which 404'd and made every
  // single order fail with "Could not reach the API".
  try {
    return await authFetch(path, init);
  } catch (err) {
    // fetch() rejects with TypeError only when the request never left the
    // machine (backend down / offline). API errors (401, 403, 400…) already
    // carry the server's message and status — surface those unchanged.
    if (err instanceof TypeError) {
      throw new Error(
        "Could not reach the API. Please make sure the backend server is running."
      );
    }
    throw err;
  }
};

// GET MY ORDERS — GET /api/orders (backend returns the signed-in customer's
// own orders; there is no `/my-orders` path on the server).
export const getMyOrders = async (): Promise<Order[]> => {
 const result = await authFetch("/api/orders/my-orders", {
    method: "GET",
    cache: "no-store",
  });

  return (result.data as Order[] | undefined) ?? [];
};

// GET SINGLE ORDER
export const getOrderById = async (
  orderId: string
): Promise<Order> => {
 const result = await authFetch(`/api/orders/${orderId}`, {
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
  const result = await authFetch(`/api/orders/${orderId}/cancel`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!result.data) {
    throw new Error("Failed to cancel order.");
  }

  return result.data as Order;
};
