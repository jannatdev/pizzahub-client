
import type { MenuItem } from "@/type/menu";
import { authFetch } from "../auth-fetch";

// Common API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const data = await authFetch(endpoint, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  return data as T;
};

// 1. Get all vendor menu items
export const getMyMenuItems = async (
  status?: string
) => {
  const query =
    status && status !== "all"
      ? `?status=${encodeURIComponent(status)}`
      : "";

  return apiRequest<{
    success: boolean;
    data: MenuItem[];
  }>(`/api/vendor/menus${query}`);
};

// 2. Get single vendor menu item
export const getMyMenuItemById = async (id: string) => {
  return apiRequest<{
    success: boolean;
    data: MenuItem;
  }>(`/api/vendor/menus/${id}`);
};

// 3. Delete vendor menu item
export const deleteMyMenuItem = async (id: string) => {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(`/api/vendor/menus/${id}`, {
    method: "DELETE",
  });
};

// 4. Update menu availability
export const updateMenuAvailability = async (
  id: string,
  isActive: boolean
) => {
  return apiRequest<{
    success: boolean;
    message: string;
    data?: MenuItem;
  }>(`/api/vendor/menus/${id}/availability`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
};
