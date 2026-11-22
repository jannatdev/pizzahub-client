import { authFetch } from "../auth-fetch";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "customer" | "vendor" | "admin";
  createdAt: string;
}

export interface UsersResponse {
  success: boolean;
  users: AdminUser[];
  pagination: {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface UserStats {
  totalUsers: number;
  customers: number;
  vendors: number;
  admins: number;
}

export interface UserStatsResponse {
  success: boolean;
  stats: UserStats;
}

/**
 * Get all users
 */
export const getAllUsers = async ({
  search = "",
  role = "all",
  page = 1,
  limit = 10,
}: {
  search?: string;
  role?: string;
  page?: number;
  limit?: number;
}): Promise<UsersResponse> => {
  const query = new URLSearchParams();

  query.set("page", String(page));
  query.set("limit", String(limit));

  if (search.trim()) {
    query.set("search", search.trim());
  }

  if (role !== "all") {
    query.set("role", role);
  }

  const response = await authFetch(
    `${API_URL}/api/admin/users?${query.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch users"
    );
  }

  return data;
};

/**
 * Get single user
 */
export const getUserById = async (
  id: string
): Promise<{
  success: boolean;
  user: AdminUser;
}> => {
  const response = await fetch(
    `${API_URL}/api/admin/users/${id}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch user"
    );
  }

  return data;
};

/**
 * Get user statistics
 */
export const getUserStats =
  async (): Promise<UserStatsResponse> => {
    const response = await fetch(
      `${API_URL}/api/admin/users/stats`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to fetch user statistics"
      );
    }

    return data;
  };