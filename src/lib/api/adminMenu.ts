
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Shared request helper. Every call sends `credentials: "include"` — the
 * dashboard runs on localhost:3000 and the API on localhost:8000 (different
 * origins), so without it the Better Auth session cookie is never sent and
 * the backend answers 401/403 for every request.
 */
const request = async (path: string, init?: RequestInit) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const url = `${API_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      credentials: "include",
    });
  } catch {
    throw new Error(
      `Could not reach the API at ${url}. Please make sure the backend server is running.`
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Request to ${path} failed (HTTP ${response.status}).`
    );
  }

  return data;
};

// Fetch all menu items (every status — this is the admin review queue)
export const getAllMenuItems = async () => {
  return request("/api/menu/all", { cache: "no-store" });
};

// Approve menu
export const approveMenu = async (id: string) => {
  return request(`/api/menu/${encodeURIComponent(id)}/approve`, {
    method: "PATCH",
  });
};

// Reject menu
export const rejectMenu = async (id: string) => {
  return request(`/api/menu/${encodeURIComponent(id)}/reject`, {
    method: "PATCH",
  });
};

export const deleteMenu = async (id: string) => {
  return request(`/api/menu/${encodeURIComponent(id)}/delete`, {
    method: "DELETE",
  });
};
