"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Roles a PizzaHub account can have.
 * (Admin is never granted through public sign-up — only the backend can assign it.)
 */
export type UserRole = "customer" | "vendor" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  /** Profile image URL. An empty string renders an initials avatar instead. */
  image: string;
  role: UserRole;
  /**
   * Vendor plan flag. Resolved server-side in the dashboard shell from the
   * backend (src/lib/vendor-plan.ts) — undefined for customers/admins and
   * whenever the plan could not be read. Display-only: the backend is still
   * the only thing that enforces menu limits.
   */
  isPremium?: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  /** Signs the user out. The Navbar re-renders immediately. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * TEMPORARY mock user kept around so the signed-in Navbar (avatar dropdown,
 * Dashboard link, Logout) can still be previewed during development.
 *
 * The provider starts *signed out* so the Navbar shows the Sign In / Sign Up
 * buttons by default. To preview the signed-in state, pass `MOCK_USER` as the
 * initial state below. When real auth (Better Auth, Phase 5) lands, the real
 * session replaces this entirely.
 */
export const MOCK_USER: AuthUser = {
  name: "Jane Doe",
  email: "jane.doe@pizzahub.com",
  image: "",
  role: "customer",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Returns the current auth state. Must be used inside an <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
