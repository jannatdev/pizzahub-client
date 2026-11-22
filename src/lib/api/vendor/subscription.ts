import { authFetch } from "../auth-fetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const getVendorSubscription = async (token: string) => {
  const response = await  authFetch(`${API_URL}/vendor/subscription`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch subscription");
  }

  return result.data;
};
