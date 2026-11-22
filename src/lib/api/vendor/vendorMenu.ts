import type { MenuItem, UpdateMenuData } from "@/type/menu";
import { authFetch } from "../auth-fetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Common fetch function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await  authFetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    // Attach the HTTP status so callers can distinguish
    // 400/404 (not found) from other failures.
    const error = new Error(
      data.message || "Something went wrong"
    ) as Error & { status?: number };

    error.status = response.status;
    throw error;
  }

  return data;
};

// 1. Get all vendor menu items
export const getMyMenuItems = async (
  status?: string
) => {
  const query = status && status !== "all"
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

// 3. Update menu item
export const updateMyMenuItem = async (
  id: string,
  menuData: UpdateMenuData
) => {
  return apiRequest<{
    success: boolean;
    message: string;
    data: MenuItem;
  }>(`/api/vendor/menus/${id}`, {
    method: "PATCH",
    body: JSON.stringify(menuData),
  });
};

// 4. Delete menu item
export const deleteMyMenuItem = async (id: string) => {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(`/api/vendor/menus/${id}`, {
    method: "DELETE",
  });
};

// 5. Update menu availability
export const updateMenuAvailability = async (
  id: string,
  isActive: boolean
) => {
  return apiRequest<{
    success: boolean;
    message: string;
    data: MenuItem;
  }>(`/api/vendor/menus/${id}/availability`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
};