
import { authFetch } from "../auth-fetch";

export const getAdminOverview = async () => {
  const result = await authFetch("/api/admin/overview", {
    method: "GET",
    cache: "no-store",
  });

  return result.stats;
};
