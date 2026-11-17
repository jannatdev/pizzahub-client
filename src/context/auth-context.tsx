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
}

interface AuthContextValue {
  user: AuthUser | null;
  /** Signs the user out. The Navbar re-renders immediately. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * TEMPORARY mock user so the signed-in Navbar can be previewed before real
 * authentication (Better Auth) is wired up in Phase 5.
 *
 * The provider currently starts *signed in* so both Navbar states are easy to
 * test: click "Logout" to instantly see the signed-out Navbar, then refresh to
 * come back. When real auth lands, this will start signed-out instead.
 */
const MOCK_USER: AuthUser = {
  name: "Jane Doe",
  email: "jane.doe@pizzahub.com",
  image: "",
  role: "customer",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);

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
