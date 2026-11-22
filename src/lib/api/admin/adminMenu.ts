import { authFetch } from "../auth-fetch";

// Fetch all menu items
export const getAllMenuItems = async () => {
  const result = await authFetch("/api/admin/menus", {
    method: "GET",
    cache: "no-store",
  });

  return result;
};

// Approve menu item
export const approveMenu = async (id: string) => {
  const result = await authFetch(
    `/api/admin/menus/${encodeURIComponent(id)}/approve`,
    {
      method: "PATCH",
    }
  );

  return result;
};

// Reject menu item
export const rejectMenu = async (id: string) => {
  const result = await authFetch(
    `/api/admin/menus/${encodeURIComponent(id)}/reject`,
    {
      method: "PATCH",
    }
  );

  return result;
};

// Delete menu item
export const deleteMenu = async (id: string) => {
  const result = await authFetch(
    `/api/admin/menus/${encodeURIComponent(id)}/delete`,
    {
      method: "DELETE",
    }
  );

  return result;
};