import type { BrowseMenusResponse } from "@/type/menu";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

/**
 * Fetch the public (approved + active) menu list.
 * The backend mounts this route at GET /api/browse-menu/all.
 */
export const getAllPublicMenus = async ({
  search = "",
  category = "all",
  location = "all",
  sort = "newest",
}: {
  search?: string;
  category?: string;
  location?: string;
  /** "newest" (default) | "price_asc" | "price_desc" */
  sort?: string;
}): Promise<BrowseMenusResponse> => {
  const query = new URLSearchParams();

  if (search.trim()) {
    query.set("search", search.trim());
  }

  if (category !== "all") {
    query.set("category", category);
  }

  if (location !== "all") {
    query.set("location", location);
  }

  if (sort !== "newest") {
    query.set("sort", sort);
  }

  const qs = query.toString();
  const url = `${API_URL}/api/browse-menu/all${qs ? `?${qs}` : ""}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
  } catch {
    // fetch only rejects when the request never left (backend down/wrong port)
    throw new Error(
      `Could not reach the API at ${url}. Please make sure the backend server is running.`
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || `Failed to fetch menus (HTTP ${response.status}).`
    );
  }

  return data as BrowseMenusResponse;
};
