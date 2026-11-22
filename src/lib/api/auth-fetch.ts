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

  // 1. Get JWT from Better Auth
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unauthorized. Please sign in again.");
  }

  // 2. Prepare headers
  const headers = new Headers(init?.headers);

  headers.set("Authorization", `Bearer ${data.token}`);
  headers.set("Content-Type", "application/json");

  // 3. Send request
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });

  // 4. Parse response
  const result = await response.json().catch(() => null);

  // 5. Handle API errors
  if (!response.ok || !result?.success) {
    const apiError = new Error(
      result?.message || `Request failed (${response.status})`
    ) as Error & { status?: number };

    apiError.status = response.status;

    throw apiError;
  }

  // 6. Return API response
  return result;
};