const API_URL =process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";



export const getAdminOverview = async () => {
  const response = await fetch(
    `${API_URL}/api/admin/overview/stats`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch dashboard statistics"
    );
  }

  return data.stats;
};