import type { UserRole } from "@/context/auth-context";

/**
 * Landing page for each role inside the dashboard.
 *
 * This file is intentionally tiny and has no imports with runtime code, so it
 * is safe to use from BOTH client components (sidebar, header) and server
 * components (auth guards, redirects).
 */
export const DASHBOARD_HOME: Record<UserRole, string> = {
 
  admin: "/dashboard/admin/overview",
  vendor: "/dashboard/vendor/overview",
  customer: "/dashboard/customer",

};
