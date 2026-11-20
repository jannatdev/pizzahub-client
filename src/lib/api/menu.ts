

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Shared request helper: builds the URL, explains network failures
// (backend not running) and always parses JSON safely.
const request = async (path: string, init?: RequestInit) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const url = `${API_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, init);
  } catch {
    throw new Error(
      `Could not reach the API at ${url}. Please make sure the backend server is running.`
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request to ${path} failed (HTTP ${response.status}).`
    ) as Error & { code?: string; status?: number };

    // Preserve the API error code (e.g. MENU_LIMIT_REACHED) so callers can
    // react to it, not just to the message.
    if (data?.code) {
      error.code = data.code;
    }
    error.status = response.status;

    throw error;
  }

  return data;
};

// Get vendor menu count
export const getVendorMenuCount = async () => {
  return request("/api/menu/vendor/count", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });
};

// Create menu item
export const createMenuItem = async (
  email: string,
  menuData: Record<string, unknown>
) => {
  return request(`/api/menu/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(menuData),
  });
};



export const getPremiumVendor = async () => {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_API_URL is not configured.");
    return null;
  }

  try {
    const res = await fetch(
      `${API_URL}/api/menu/vendor/premium-status`,
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch premium status");
    }

    return await res.json();
  } catch (error) {
    console.error("Premium status error:", error);
    return null;
  }
};