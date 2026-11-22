// Server-only module. Never import this from a "use client" component.
import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import type { UserRole } from "@/context/auth-context";
import { AuthUser } from "@/type/auth";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCurrentUser = cache(async (): Promise<AuthUser> => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;

  if (!user) {
    redirect("/sign-in");
  }

return {
  name: user.name,
  email: user.email,
  image: user.image ?? "",
  role: (user.role as UserRole | undefined) ?? "customer",
  businessName: "",
};
});
export const getToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session?.token) {
    redirect("/unauthorize");
  }

  return session.session.token;
};

export const authFetch = async (
  path: string,
  init?: RequestInit
) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    const error = new Error(
      data?.message || `Request failed (${response.status})`
    ) as Error & { status?: number };

    error.status = response.status;
    throw error;
  }

  return data;
};



export async function requireRole(role: UserRole): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (user.role !== role) {
    redirect('/unauthorize');
  }

  return user;
}
