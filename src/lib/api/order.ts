const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Place an order for a menu item (POST /api/orders).
 * Requires the signed-in session cookie (`credentials: "include"`).
 * The backend re-checks role, item status, and price — never trust the client.
 */
export const placeOrder = async ({
  menuId,
  quantity = 1,
}: {
  menuId: string;
  quantity?: number;
}) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ menuId, quantity }),
    });
  } catch {
    // fetch only rejects when the request never left (backend down/wrong port)
    throw new Error(
      "Could not reach the API. Please make sure the backend server is running."
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message || `Order failed (HTTP ${response.status}).`
    ) as Error & { status?: number };

    error.status = response.status;
    throw error;
  }

  return data;
};
