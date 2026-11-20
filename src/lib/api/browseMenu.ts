
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export const getAllPublicMenus = async ({
  search = "",
  category = "all",
  location = "all",
}: {
  search?: string;
  category?: string;
  location?: string;
}) => {
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

  const response = await fetch(
    `${API_URL}/api/browse-menu/all?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch menus");
  }

  return data;
};