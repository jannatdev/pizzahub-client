
import { authFetch } from "../auth-fetch";

export const getVendorSubscription = async () => {
  const result = await authFetch("/api/vendor/subscription", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  return result.data;
};
