
"use client";

import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authFetch = async (
  path: string,
  init?: RequestInit
) => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  // Get JWT from Better Auth
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unauthorized. Please sign in again.");
  }

  // Prepare headers
  const headers = new Headers(init?.headers);

  headers.set("Authorization", `Bearer ${data.token}`);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  // Construct the URL only once
  const baseUrl = API_URL.replace(/\/+$/, "");
  const endpoint = path.startsWith("/")
    ? path
    : `/${path}`;

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers,
  });

  // Parse response
  const result = await response.json().catch(() => null);

  // Handle errors
  if (!response.ok || !result?.success) {
    const apiError = new Error(
      result?.message || `Request failed (${response.status})`
    ) as Error & { status?: number };

    apiError.status = response.status;
    throw apiError;
  }

  return result;
};
